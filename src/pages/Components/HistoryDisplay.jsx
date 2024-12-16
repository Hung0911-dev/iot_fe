import { Card, CardContent, Typography } from "@mui/material";
import "./HistoryDisplay.css"
import { useEffect, useState } from "react";
import { getHistoryData } from "../../api/IndoorAPI";
const HistoryDisplay = () => {
    const [historyData, setHistoryData] = useState([])
    const [page, setpage] = useState(1)
    const handleGetHistoryData = async (date) => {
        
        const response = await getHistoryData(date, page)
        console.log(response)
        setHistoryData(response)
      }
      useEffect(() => {
        handleGetHistoryData()
      }, [])
    return (
        <>
            <Typography variant="h6"  gutterBottom>
                History Data:
            </Typography>
        <div className="table-container">
            <table className="history-table">
            <thead>
                <tr>
                <th>Timestamp</th>
                <th>Temperature (°C)</th>
                <th>Humidity (%)</th>
                <th>Gas (ppm)</th>
                <th>Vibration</th>
                <th>Flame</th>
                </tr>
            </thead>
            <tbody>
                {historyData  ? (
                historyData.temperatureData.map((data, index) => (
                    <tr key={index}>
                    <td>{new Date(data.createdAt).toLocaleString()}</td>
                    <td>{data.value.toFixed(2) || '-'}</td>
                    <td>{historyData.humidityData[index].value.toFixed(2) || '-'}</td>
                    <td>{historyData.gasData[index].value.toFixed(2) || '-'}</td>
                    <td>{data.vibration === 1 ? 'Yes' : 'No'}</td>
                    <td>{data.flame === 1 ? 'Yes' : 'No'}</td>
                    </tr>
                ))
                ) : (
                <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>No history data available.</td>
                </tr>
                )}
            </tbody>
            </table>
        </div>
        </>
    )
}
export default HistoryDisplay;