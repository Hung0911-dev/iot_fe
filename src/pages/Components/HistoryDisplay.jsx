import { Button, Card, CardContent, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import "./HistoryDisplay.css"
import { useEffect, useState } from "react";
import { getHistoryData, getTableHistoryData } from "../../api/IndoorAPI";
const HistoryDisplay = () => {
    const [historyData, setHistoryData] = useState([])
    const [timeRange, setTimeRange] = useState("today"); 
    const [selectedDate, setSelectedDate] = useState("");
    
    const [page, setpage] = useState(1)
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); 
    const dd = String(today.getDate()).padStart(2, '0');
    
    const formattedDate = `${yyyy}-${mm}-${dd}`;
    const handleGetHistoryData = async (date) => {
        
        const response = await getTableHistoryData(date, page)

        setHistoryData(response)
      }
      useEffect(() => {
        handleGetHistoryData(formattedDate)
    }, [])
    const handleFetchData = async () => {
        if (timeRange !== "today" && selectedDate) {
          try {
            const response = await getTableHistoryData(selectedDate, page);
            setHistoryData(response)
            let newLabels = [];
        let temperatureData = [];
        let humidityData = [];
        let gasData = [];
  
        if (timeRange === "day") {
          newLabels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  
          newLabels.forEach((label, hour) => {
            const hourData = response.find((d) => parseInt(d.time, 10) === hour);
            temperatureData.push(hourData?.temperature || 0);
            humidityData.push(hourData?.humidity || 0);
            gasData.push(hourData?.gas || 0);
          });
        } else if (timeRange === "month") {
          const daysInMonth = new Date(selectedDate.split("-")[0], selectedDate.split("-")[1], 0).getDate();
          newLabels = Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            if (day % 10 === 1 && day !== 11) return `${day}st`;
            if (day % 10 === 2 && day !== 12) return `${day}nd`;
            if (day % 10 === 3 && day !== 13) return `${day}rd`;
            return `${day}th`;
          });
  
          newLabels.forEach((label, day) => {
            const dayData = response.find((d) => parseInt(d.time, 10) === day + 1);
            temperatureData.push(dayData?.temperature || 0);
            humidityData.push(dayData?.humidity || 0);
            gasData.push(dayData?.gas || 0);
          });
        } else if (timeRange === "year") {
          newLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
          newLabels.forEach((label, month) => {
            const monthData = response.find((d) => parseInt(d.time, 10) === month + 1);
            temperatureData.push(monthData?.temperature || 0);
            humidityData.push(monthData?.humidity || 0);
            gasData.push(monthData?.gas || 0);
          });
        }
  
          } catch (error) {
            console.error("Error fetching historical data:", error);
          }
        }
      };
    return (
        <>
        <div className="head-selection">
        <FormControl variant="outlined" sx={{ mb: 2, minWidth: 150, backgroundColor: "#ffffff", borderRadius: "8px"}}>
          <InputLabel>Time Range</InputLabel>
          <Select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} label="Time Range">
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="day">Day</MenuItem>
            <MenuItem value="month">Month</MenuItem>
            <MenuItem value="year">Year</MenuItem>
          </Select>
        </FormControl>

      {timeRange !== "present" && (
        <div>
          <TextField
            type={timeRange === "day" ? "date" : timeRange === "month" ? "month" : "number"}
            label={`Select ${timeRange}`}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2, ml: 2, backgroundColor: "#ffffff", borderRadius: "8px" }}
          />
          <Button variant="contained" color="primary" onClick={handleFetchData} sx={{ ml: 2 }}>
            Fetch Data
          </Button>
        </div>
      )}
      </div>
            <Typography variant="h6"  gutterBottom>
                History Data:
            </Typography>
        {
            historyData.length === 0 ? (
                <h1>No data</h1>
            ) : (
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
                {
                historyData.map((data, index) => (
                    <tr key={index}>
                    <td>null</td>
                    <td>{data.temperature || '-'}</td>
                    <td>{data.humidity || '-'}</td>
                    <td>{data.gas || '-'}</td>
                    <td>{data.vibration === 1 ? 'Yes' : 'No'}</td>
                    <td>{data.flame === 1 ? 'Yes' : 'No'}</td>
                    </tr>
                ))

                }
            </tbody>
            </table>
        </div>
            )
        }
        </>
    )
}
export default HistoryDisplay;