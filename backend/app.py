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

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
