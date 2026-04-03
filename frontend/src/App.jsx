import { useState, useEffect } from "react"

const severityColors = {
  Critical: { bg: "#fee2e2", text: "#991b1b", border: "#ef4444" },
  High:     { bg: "#ffedd5", text: "#9a3412", border: "#f97316" },
  Medium:   { bg: "#fef9c3", text: "#854d0e", border: "#eab308" },
  Low:      { bg: "#dcfce7", text: "#166534", border: "#22c55e" },
}

export default function App() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("All")
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetch("http://localhost:5000/alerts")
      .then(res => res.json())
      .then(data => {
        setAlerts(data.alerts)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    fetch("http://localhost:5000/stats")
      .then(res => res.json())
      .then(data => setStats(data))
  }, [])

  const filtered = filter === "All"
    ? alerts
    : alerts.filter(a => a.severity === filter)

  if (loading) return <div style={{padding: "2rem"}}>Cargando alertas...</div>

  return (
    <div style={{padding: "2rem", fontFamily: "Arial, sans-serif"}}>
      <h1 style={{color: "#1e293b"}}>🔵 MS Security App — Alert Dashboard</h1>

      {stats && (
        <div style={{display: "flex", gap: "1rem", marginBottom: "1.5rem"}}>
          {Object.entries(stats.by_severity).map(([severity, count]) => {
            const colors = severityColors[severity] || {}
            return (
              <div key={severity} style={{
                padding: "1rem 1.5rem",
                borderRadius: "8px",
                backgroundColor: colors.bg,
                borderLeft: `4px solid ${colors.border}`,
                minWidth: "100px"
              }}>
                <div style={{fontSize: "1.5rem", fontWeight: "bold", color: colors.text}}>{count}</div>
                <div style={{fontSize: "0.85rem", color: colors.text}}>{severity}</div>
              </div>
            )
          })}
        </div>
      )}

      <div style={{marginBottom: "1rem", display: "flex", gap: "0.5rem"}}>
        {["All", "Critical", "High", "Medium", "Low"].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            style={{
              padding: "6px 16px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              backgroundColor: filter === s ? "#1e293b" : "#e2e8f0",
              color: filter === s ? "white" : "#1e293b",
              fontWeight: filter === s ? "bold" : "normal"
            }}>
            {s}
          </button>
        ))}
      </div>

      <p style={{color: "#64748b"}}>
        Mostrando {filtered.length} de {alerts.length} alertas
      </p>

      <table style={{width: "100%", borderCollapse: "collapse"}}>
        <thead>
          <tr style={{backgroundColor: "#1e293b", color: "white"}}>
            <th style={{padding: "12px", textAlign: "left"}}>ID</th>
            <th style={{padding: "12px", textAlign: "left"}}>Severidad</th>
            <th style={{padding: "12px", textAlign: "left"}}>Título</th>
            <th style={{padding: "12px", textAlign: "left"}}>Fuente</th>
            <th style={{padding: "12px", textAlign: "left"}}>Estado</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(alert => {
            const colors = severityColors[alert.severity] || {}
            return (
              <tr key={alert.id} style={{backgroundColor: colors.bg, borderLeft: `4px solid ${colors.border}`}}>
                <td style={{padding: "10px"}}>{alert.id}</td>
                <td style={{padding: "10px", color: colors.text, fontWeight: "bold"}}>{alert.severity}</td>
                <td style={{padding: "10px"}}>{alert.title}</td>
                <td style={{padding: "10px"}}>{alert.source}</td>
                <td style={{padding: "10px"}}>{alert.status}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}