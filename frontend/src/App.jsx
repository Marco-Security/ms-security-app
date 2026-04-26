import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const theme = {
  bg: "#0a0e1a",
  surface: "#111827",
  surfaceHover: "#1a2235",
  border: "#1f2d45",
  accent: "#38bdf8",
  accentDim: "rgba(56,189,248,0.1)",
  text: "#e2e8f0",
  textMuted: "#64748b",
  textDim: "#94a3b8",
}

const severityConfig = {
  Critical: { bg: "rgba(239,68,68,0.12)", text: "#f87171", border: "#ef4444", dot: "#ef4444" },
  High:     { bg: "rgba(249,115,22,0.12)", text: "#fb923c", border: "#f97316", dot: "#f97316" },
  Medium:   { bg: "rgba(234,179,8,0.12)",  text: "#facc15", border: "#eab308", dot: "#eab308" },
  Low:      { bg: "rgba(34,197,94,0.12)",  text: "#4ade80", border: "#22c55e", dot: "#22c55e" },
}

const statusConfig = {
  Open:     { text: "#f87171", bg: "rgba(239,68,68,0.1)" },
  Resolved: { text: "#4ade80", bg: "rgba(34,197,94,0.1)" },
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Syne:wght@400;600;700;800&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: ${theme.bg};
    color: ${theme.text};
    font-family: 'Syne', sans-serif;
    min-height: 100vh;
  }

  .dashboard {
    max-width: 100%;
    margin: 0 auto;
    padding: 2rem;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid ${theme.border};
  }

  .header-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${theme.accent};
    box-shadow: 0 0 12px ${theme.accent};
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  .header h1 {
    font-size: 1.4rem;
    font-weight: 700;
    color: ${theme.text};
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .header-badge {
    margin-left: auto;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem;
    color: ${theme.accent};
    background: ${theme.accentDim};
    border: 1px solid rgba(56,189,248,0.2);
    padding: 4px 10px;
    border-radius: 4px;
    letter-spacing: 0.08em;
  }

  .severity-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .severity-card {
    background: ${theme.surface};
    border: 1px solid ${theme.border};
    border-radius: 10px;
    padding: 1.2rem 1.4rem;
    position: relative;
    overflow: hidden;
    transition: transform 0.2s, border-color 0.2s;
  }

  .severity-card:hover {
    transform: translateY(-2px);
  }

  .severity-card .count {
    font-size: 2.2rem;
    font-weight: 800;
    line-height: 1;
    margin-bottom: 0.3rem;
    font-family: 'JetBrains Mono', monospace;
  }

  .severity-card .label {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: ${theme.textMuted};
    font-weight: 600;
  }

  .chart-section {
    background: ${theme.surface};
    border: 1px solid ${theme.border};
    border-radius: 10px;
    padding: 1.5rem;
    margin-bottom: 2rem;
  }

  .section-title {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: ${theme.textMuted};
    font-weight: 700;
    margin-bottom: 1.2rem;
  }

  .filters {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.2rem;
    flex-wrap: wrap;
  }

  .filter-btn {
    font-family: 'Syne', sans-serif;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 6px 14px;
    border-radius: 6px;
    border: 1px solid ${theme.border};
    background: transparent;
    color: ${theme.textMuted};
    cursor: pointer;
    transition: all 0.2s;
  }

  .filter-btn:hover {
    border-color: ${theme.accent};
    color: ${theme.accent};
  }

  .filter-btn.active {
    background: ${theme.accentDim};
    border-color: ${theme.accent};
    color: ${theme.accent};
  }

  .table-wrap {
    background: ${theme.surface};
    border: 1px solid ${theme.border};
    border-radius: 10px;
    overflow: hidden;
  }

  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid ${theme.border};
  }

  .alert-count {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem;
    color: ${theme.textMuted};
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  thead tr {
    background: rgba(255,255,255,0.02);
  }

  th {
    padding: 12px 16px;
    text-align: left;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: ${theme.textMuted};
    font-weight: 700;
    border-bottom: 1px solid ${theme.border};
  }

  td {
    padding: 12px 16px;
    font-size: 0.875rem;
    border-bottom: 1px solid rgba(31,45,69,0.5);
    color: ${theme.textDim};
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  tbody tr:hover td {
    background: ${theme.surfaceHover};
    color: ${theme.text};
  }

  .severity-badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    padding: 3px 8px;
    border-radius: 4px;
    text-transform: uppercase;
  }

  .status-badge {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    padding: 3px 8px;
    border-radius: 4px;
    text-transform: uppercase;
    font-family: 'JetBrains Mono', monospace;
  }

  .id-cell {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem;
    color: ${theme.textMuted};
  }

  .custom-tooltip {
    background: #1a2235;
    border: 1px solid ${theme.border};
    border-radius: 6px;
    padding: 8px 12px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem;
    color: ${theme.text};
  }
`

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const cfg = severityConfig[label] || {}
    return (
      <div className="custom-tooltip">
        <span style={{ color: cfg.text }}>{label}</span>
        <span style={{ color: theme.textMuted }}> — </span>
        <span>{payload[0].value} alertas</span>
      </div>
    )
  }
  return null
}

const WazuhTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const color = label === "L10" || label === "L12" ? "#f87171" :
                  label === "L8"  || label === "L9"  ? "#fb923c" : theme.accent
    return (
      <div className="custom-tooltip">
        <span style={{ color }}>{label}</span>
        <span style={{ color: theme.textMuted }}> — </span>
        <span>{payload[0].value} eventos</span>
      </div>
    )
  }
  return null
}

export default function App() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("All")
  const [stats, setStats] = useState(null)
  const [wazuhAlerts, setWazuhAlerts] = useState([])
  const [wazuhFilter, setWazuhFilter] = useState(0)
  const [lastRefresh, setLastRefresh] = useState(null)

  useEffect(() => {
    fetch("http://localhost:5000/alerts")
      .then(res => res.json())
      .then(data => { setAlerts(data.alerts); setLoading(false) })
  }, [])

  useEffect(() => {
    fetch("http://localhost:5000/stats")
      .then(res => res.json())
      .then(data => setStats(data))
  }, [])

  useEffect(() => {
  const fetchWazuhAlerts = () => {
    fetch("http://localhost:5000/wazuh/alerts")
      .then(res => res.json())
      .then(data => {
        setWazuhAlerts(data.alerts || [])
        setLastRefresh(new Date().toLocaleTimeString())
      })
  }
  fetchWazuhAlerts()
  const interval = setInterval(fetchWazuhAlerts, 30000)
  return () => clearInterval(interval)
  }, [])

  const filtered = filter === "All" ? alerts : alerts.filter(a => a.severity === filter)

  const chartData = stats
    ? Object.entries(stats.by_severity).map(([name, value]) => ({ name, value }))
    : []

  const wazuhChartData = [7, 8, 9, 10, 12].map(level => ({
    name: `L${level}`,
    value: wazuhAlerts.filter(a => a.rule_level === level).length
  }))

  const wazuhFiltered = wazuhAlerts.filter(a => wazuhFilter === 0 || a.rule_level === wazuhFilter)

  const exportToCSV = () => {
    const headers = ["Timestamp", "Agente", "Nivel", "Descripción", "Rule ID"]
    const rows = wazuhFiltered.map(a => [
      a.timestamp?.slice(0, 19).replace("T", " "),
      a.agent,
      a.rule_level,
      `"${(a.description || "").replace(/"/g, '""')}"`,
      a.rule_id
    ])
  
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `wazuh_alerts_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: theme.bg, color: theme.accent, fontFamily: "JetBrains Mono", fontSize: "0.85rem", letterSpacing: "0.1em" }}>
      LOADING...
    </div>
  )

  return (
    <>
      <style>{styles}</style>
      <div className="dashboard">

        {/* Header */}
        <div className="header">
          <div className="header-dot" />
          <h1>MS Security — Alert Dashboard</h1>
          <div style={{ marginLeft: "auto", display: "flex", gap: "0.75rem", alignItems: "center" }}>
            {wazuhAlerts.filter(a => a.rule_level >= 10).length > 0 && (
              <span style={{
                fontFamily: "JetBrains Mono",
                fontSize: "0.7rem",
                color: "#f87171",
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.3)",
                padding: "4px 10px",
                borderRadius: "4px",
                letterSpacing: "0.08em",
                animation: "pulse 2s infinite"
              }}>
                ⚠ {wazuhAlerts.filter(a => a.rule_level >= 10).length} CRÍTICO{wazuhAlerts.filter(a => a.rule_level >= 10).length > 1 ? "S" : ""}
              </span>
            )}
            <span className="header-badge">LIVE</span>
          </div>
        </div>

        {/* Severity Cards */}
        {stats && (
          <div className="severity-cards">
            {Object.entries(stats.by_severity).map(([severity, count]) => {
              const cfg = severityConfig[severity] || {}
              return (
                <div key={severity} className="severity-card" style={{ borderColor: `${cfg.border}33` }}>
                  <div className="count" style={{ color: cfg.text }}>{count}</div>
                  <div className="label">{severity}</div>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: cfg.border, opacity: 0.6 }} />
                </div>
              )
            })}
          </div>
        )}

        {/* Mock Alerts Chart */}
        {stats && (
          <div className="chart-section">
            <div className="section-title">Distribución por Severidad — Mock Alerts</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.border} vertical={false} />
                <XAxis dataKey="name" tick={{ fill: theme.textMuted, fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: theme.textMuted, fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(56,189,248,0.05)" }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} fill={theme.accent} label={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Wazuh Chart */}
        <div className="chart-section">
          <div className="section-title">Distribución de Alertas Wazuh — Windows-Marco</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={wazuhChartData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.border} vertical={false} />
              <XAxis dataKey="name" tick={{ fill: theme.textMuted, fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: theme.textMuted, fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
              <Tooltip content={<WazuhTooltip />} cursor={{ fill: "rgba(56,189,248,0.05)" }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} fill={theme.accent} label={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Mock Alerts Table */}
        <div className="table-wrap" style={{ marginBottom: "2rem" }}>
          <div className="table-header">
            <div className="section-title" style={{ margin: 0 }}>Alertas Recientes</div>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <div className="filters" style={{ margin: 0 }}>
                {["All", "Critical", "High", "Medium", "Low"].map(s => (
                  <button key={s} className={`filter-btn ${filter === s ? "active" : ""}`} onClick={() => setFilter(s)}>{s}</button>
                ))}
              </div>
              <span className="alert-count">{filtered.length}/{alerts.length}</span>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Severidad</th>
                <th>Título</th>
                <th>Fuente</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(alert => {
                const sc = severityConfig[alert.severity] || {}
                const st = statusConfig[alert.status] || {}
                return (
                  <tr key={alert.id}>
                    <td className="id-cell">{String(alert.id).padStart(3, "0")}</td>
                    <td>
                      <span className="severity-badge" style={{ background: sc.bg, color: sc.text }}>
                        {alert.severity}
                      </span>
                    </td>
                    <td style={{ color: theme.text }}>{alert.title}</td>
                    <td>{alert.source}</td>
                    <td>
                      <span className="status-badge" style={{ background: st.bg, color: st.text }}>
                        {alert.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Wazuh Real Alerts Table */}
        <div className="table-wrap">
          <div className="table-header">
            <div className="section-title" style={{ margin: 0 }}>Wazuh — Windows-Marco</div>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <div style={{ display: "flex", gap: "0.4rem" }}>
                {[0, 7, 8, 9, 10, 12].map(level => (
                  <button key={level} className={`filter-btn ${wazuhFilter === level ? "active" : ""}`}
                    onClick={() => setWazuhFilter(level)}
                    style={{ padding: "4px 10px" }}>
                    {level === 0 ? "All" : `L${level}`}
                  </button>
                ))}
              </div>
              <button onClick={exportToCSV} style={{
                fontFamily: "JetBrains Mono",
                fontSize: "0.7rem",
                color: theme.accent,
                background: theme.accentDim,
                border: `1px solid ${theme.accent}`,
                padding: "4px 12px",
                borderRadius: "4px",
                cursor: "pointer",
                letterSpacing: "0.08em"
              }}>
                ↓ EXPORT CSV
              </button>
              <span style={{ fontFamily: "JetBrains Mono", fontSize: "0.7rem", color: theme.textMuted }}>
                ↻ {lastRefresh || "--:--:--"}
              </span>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Agente</th>
                <th>Nivel</th>
                <th>Descripción</th>
                <th>Rule ID</th>
              </tr>
            </thead>
            <tbody>
              {wazuhFiltered.map(alert => (
                <tr key={alert.id}>
                  <td className="id-cell">{alert.timestamp?.slice(0, 19).replace("T", " ")}</td>
                  <td style={{ color: theme.accent }}>{alert.agent}</td>
                  <td>
                    <span className="severity-badge" style={{
                      background: alert.rule_level >= 10 ? "rgba(239,68,68,0.12)" :
                                  alert.rule_level >= 8  ? "rgba(249,115,22,0.12)" :
                                  "rgba(56,189,248,0.1)",
                      color: alert.rule_level >= 10 ? "#f87171" :
                             alert.rule_level >= 8  ? "#fb923c" :
                             theme.accent
                    }}>
                      {alert.rule_level}
                    </span>
                  </td>
                  <td style={{ color: theme.text }}>{alert.description}</td>
                  <td className="id-cell">{alert.rule_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </>
  )
}