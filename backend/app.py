from flask import Flask, jsonify
from flask_cors import CORS
import requests
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "ok",
        "service": "MS Security App",
        "version": "0.1.0"
    })

@app.route('/alerts', methods=['GET'])
def alerts():
    mock_alerts = [
        {"id": 1, "severity": "High", "title": "Suspicious login attempt", "source": "Azure Sentinel", "status": "Open"},
        {"id": 2, "severity": "Medium", "title": "Port scan detected", "source": "Microsoft Defender", "status": "Open"},
        {"id": 3, "severity": "Low", "title": "Registry key modified", "source": "Wazuh", "status": "Resolved"},
        {"id": 4, "severity": "Critical", "title": "Malware detected", "source": "Microsoft Defender", "status": "Open"},
        {"id": 5, "severity": "Medium", "title": "Failed authentication x10", "source": "Azure Sentinel", "status": "Open"}
    ]
    return jsonify({"alerts": mock_alerts, "total": len(mock_alerts)})

@app.route('/stats', methods=['GET'])
def stats():
    mock_alerts = [
        {"id": 1, "severity": "High", "source": "Azure Sentinel", "status": "Open"},
        {"id": 2, "severity": "Medium", "source": "Microsoft Defender", "status": "Open"},
        {"id": 3, "severity": "Low", "source": "Wazuh", "status": "Resolved"},
        {"id": 4, "severity": "Critical", "source": "Microsoft Defender", "status": "Open"},
        {"id": 5, "severity": "Medium", "source": "Azure Sentinel", "status": "Open"}
    ]

    by_severity = {}
    by_status = {}
    by_source = {}

    for alert in mock_alerts:
        by_severity[alert["severity"]] = by_severity.get(alert["severity"], 0) + 1
        by_status[alert["status"]] = by_status.get(alert["status"], 0) + 1
        by_source[alert["source"]] = by_source.get(alert["source"], 0) + 1

    return jsonify({
        "total": len(mock_alerts),
        "by_severity": by_severity,
        "by_status": by_status,
        "by_source": by_source
    })

WAZUH_URL = "https://localhost:55000"
WAZUH_USER = "wazuh-wui"
WAZUH_PASS = "MyS3cr37P450r.*-"

def get_wazuh_token():
    r = requests.post(
        f"{WAZUH_URL}/security/user/authenticate",
        auth=(WAZUH_USER, WAZUH_PASS),
        verify=False
    )
    return r.json()["data"]["token"]

@app.route('/wazuh/agents', methods=['GET'])
def wazuh_agents():
    token = get_wazuh_token()
    r = requests.get(
        f"{WAZUH_URL}/agents",
        headers={"Authorization": f"Bearer {token}"},
        verify=False
    )
    return jsonify(r.json()["data"]["affected_items"])

@app.route('/wazuh/alerts', methods=['GET'])
def wazuh_alerts():
    r = requests.get(
        "https://localhost:9200/wazuh-alerts-*/_search",
        auth=("admin", "SecretPassword"),
        json={
            "size": 20,
            "sort": [{"timestamp": {"order": "desc"}}],
            "query": {
                "range": {
                    "rule.level": {"gte": 7}
                }
            }
        },
        verify=False
    )
    hits = r.json().get("hits", {}).get("hits", [])
    alerts = []
    for hit in hits:
        src = hit["_source"]
        alerts.append({
            "id": src.get("id", ""),
            "timestamp": src.get("timestamp", ""),
            "agent": src.get("agent", {}).get("name", ""),
            "rule_id": src.get("rule", {}).get("id", ""),
            "rule_level": src.get("rule", {}).get("level", 0),
            "description": src.get("rule", {}).get("description", ""),
            "groups": src.get("rule", {}).get("groups", [])
        })
    return jsonify({"alerts": alerts, "total": len(alerts)})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
