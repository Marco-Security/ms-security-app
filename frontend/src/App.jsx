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
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch("http://localhost:5000/alerts")
      .then(res => res.json())
      .then(data => {
        setAlerts(data.alerts)
        setLoading(false)
      })
      .catch(err => {
        setError("Error conectando al backend")
        setLoading(false)
      })
  }, [])

  if (loading) return <div style={{padding: "2rem"}}>Cargando alertas...</div>
  if (error) return <div style={{padding: "2rem", color: "red"}}>{error}</div>

  return (
    <div style={{padding: "2rem", fontFamily: "Arial, sans-serif"}}>
      <h1 style={{color: "#1e293b"}}>🔵 MS Security App — Alert Dashboard</h1>
      <p style={{color: "#64748b"}}>Total alertas: {alerts.length}</p>
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
          {alerts.map(alert => {
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