from flask import Flask, jsonify
from flask_cors import CORS

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

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
