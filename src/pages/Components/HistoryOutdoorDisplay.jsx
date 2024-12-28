import { Button, Card, CardContent, FormControl, InputLabel, MenuItem, Select, TextField, Typography, Pagination, Stack } from "@mui/material";
import "./HistoryDisplay.css"
import { useEffect, useState } from "react";
import { getTableHistoryData } from "../../api/outdoorAPI";
const HistoryOutdoorDisplay = () => {
    const [historyData, setHistoryData] = useState([])
    const [timeRange, setTimeRange] = useState("today"); 
    const [selectedDate, setSelectedDate] = useState("");
    const [historyDataToShow, setHistoryDataToShow] = useState([])
    const [page, setPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const limit = 3;
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); 
    const dd = String(today.getDate()).padStart(2, '0');
    
    const formattedDate = `${yyyy}-${mm}-${dd}`;
    const handleGetHistoryData = async (date) => {
        const response = await getTableHistoryData(date, page)
        const countPage = Math.ceil(response.length / limit)
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const slicedResponse = response.slice(startIndex, endIndex);
        setHistoryDataToShow(slicedResponse)
        setTotalPage(countPage)
        setHistoryData(response)
      }
    useEffect(() => {
      if(timeRange === "today"){
        handleGetHistoryData(formattedDate)
      }
    }, [timeRange]) 
    const handleFetchData = async () => {
      console.log(selectedDate)
        if (timeRange !== "today" && selectedDate) {
          try {
            const response = await getTableHistoryData(selectedDate, page);
            console.log(response)
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
      const handlePageChange = (event, value) => {
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const slicedResponse = historyData.slice(startIndex, endIndex);
        setHistoryDataToShow(slicedResponse)
        setPage(value);

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

      {timeRange !== "today" && (
        <div>
          <TextField
            type={timeRange === "day" ? "date" : timeRange === "month" ? "month" : "number"}
            label={`Select ${timeRange}`}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2, ml: 2, backgroundColor: "#ffffff", borderRadius: "8px" }}
          />
        </div>
      )}
      <Button variant="contained" color="primary" onClick={handleFetchData} sx={{ height: "55px" }}>
        Fetch Data
      </Button>
      </div>
      <div style={{
              display: "flex",
              justifyContent: "space-between",

            }}>
              <Typography variant="h6"  gutterBottom>
                  History Data:
              </Typography>
              <Stack spacing={2} direction="row" justifyContent="flex-end">
              <Pagination
                count={totalPage}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="small"
              />
            </Stack>
            </div>
        {
            historyData.length === 0 ? (
                <h1>No data</h1>
            ) : (
                <div className="table-container">
            <table className="history-table">
            <thead>
                <tr className="history-thead">
                <th>Timestamp</th>
                <th>Temperature (°C)</th>
                <th>Humidity (%)</th>
                <th>Air Quality (ppm)</th>
                <th>Motion</th>
                </tr>
            </thead>
            <tbody>
                {
                historyDataToShow.map((data, index) => (
                    <tr key={index}>
                    <td>{data.createdAt}</td>
                    <td>{data.avgTemperature || '-'}</td>
                    <td>{data.avgHumidity || '-'}</td>
                    <td>{data.avgAirQuality || '-'}</td>
                    <td>{data.motionDetectCount > 0 ? "Yes" : "No"}</td>
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
export default HistoryOutdoorDisplay;