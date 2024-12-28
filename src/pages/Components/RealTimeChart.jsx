import React, { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto"; // Tự động import các component cần thiết từ Chart.js
import { MenuItem, Select, FormControl, InputLabel, TextField, Button } from "@mui/material";
import { getHistoryData } from "../../api/IndoorAPI";
import "./RealTimeChart.css"
import { getOutdoorHistoryData } from "../../api/outdoorAPI";
const RealTimeChart = ({ sensorData, type }) => {
  const chartRef = useRef(null);
  const [timeRange, setTimeRange] = useState("present"); 
  const [selectedDate, setSelectedDate] = useState("");
  const [historicalData, setHistoricalData] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [], 
    datasets: [
      {
        label: "Temperature",
        data: [],
        borderColor: "#FF6384",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderWidth: 2,
      },
      {
        label: "Humidity",
        data: [],
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderWidth: 2,
      },
      {
        label: "Gas",
        data: [],
        borderColor: "#FFCE56",
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        borderWidth: 2,
      },
    ],
  });

  useEffect(() => {
    if (timeRange === "present" && sensorData) {
      setChartData((prevChartData) => {
        const newLabels = [...prevChartData.labels, new Date().toLocaleTimeString()];
        const newTemperatureData = [
          ...prevChartData.datasets[0].data,
          sensorData.find((s) => s.sensorType === "temperature")?.value || 0,
        ];
        const newHumidityData = [
          ...prevChartData.datasets[1].data,
          sensorData.find((s) => s.sensorType === "humidity")?.value || 0,
        ];
        const newGasData = [
          ...prevChartData.datasets[2].data,
          sensorData.find((s) => s.sensorType === "gas")?.value || 0,
        ];

        return {
          ...prevChartData,
          labels: newLabels.slice(-20),
          datasets: [
            { ...prevChartData.datasets[0], data: newTemperatureData.slice(-20) },
            { ...prevChartData.datasets[1], data: newHumidityData.slice(-20) },
            { ...prevChartData.datasets[2], data: newGasData.slice(-20) },
          ],
        };
      });
    }
  }, [sensorData, timeRange]);
  const handleFetchData = async () => {
    if (timeRange !== "present" && selectedDate) {
      try {
        if(type === 'indoor'){
          const response = await getHistoryData(selectedDate);
        console.log("Backend Response:", response);
  
        let newLabels = [];
        let temperatureData = [];
        let humidityData = [];
        let gasData = [];
  
        if (timeRange === "day") {
          newLabels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  
          newLabels.forEach((label, hour) => {
            const hourData = response.find((d) => parseInt(d.time, 10) === hour);
            console.log(hourData)

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
  
        setChartData({
          labels: newLabels,
          datasets: [
            { ...chartData.datasets[0], data: temperatureData },
            { ...chartData.datasets[1], data: humidityData },
            { ...chartData.datasets[2], data: gasData },
          ],
        });
      }
      } catch (error) {
        console.error("Error fetching historical data:", error);
      }
    }
  };
  
  return (
    <div style={{ width: "90%", margin: "auto" }}>
      <h2>Real-Time Indoor Data</h2>
      <div className="head-selection">
        <FormControl variant="outlined" sx={{ mb: 2, minWidth: 150, backgroundColor: "#ffffff", borderRadius: "8px"}}>
          <InputLabel>Time Range</InputLabel>
          <Select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} label="Time Range">
            <MenuItem value="present">Real-Time</MenuItem>
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
      <Line
  ref={chartRef}
  data={chartData}
  options={{
    responsive: true,
    animation: {
      duration: 0, 
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Time",
          color: "#ffffff",
          font: { size: 14, weight: "bold" },
        },
        ticks: {
          color: "#ffffff", 
          font: { size: 12 },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.2)", 
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Values",
          color: "#ffffff", 
          font: { size: 14, weight: "bold" },
        },
        ticks: {
          color: "#ffffff", 
          font: { size: 12 },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.2)", 
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "#ffffff", 
          font: { size: 14 },
        },
      },
    },
  }}
/>

    </div>
  );
};

export default RealTimeChart;
