import { useEffect, useState } from "react";
import { getMotionCount, getOutdoorInteract } from "../../api/outdoorAPI";
import { getFlameAndVibrationCount, getIndoorInteract } from "../../api/IndoorAPI";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from "chart.js";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
const HistoryInteract = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); 
    const dd = String(today.getDate()).padStart(2, '0');
    
    const formattedDate = `${yyyy}-${mm}-${dd}`;
    const [indoorData, setIndoorData] = useState([])
    const [outdoorData, setOutdoordoorData] = useState([])
    const [indoorInteract, setIndoorInteract] = useState([])
    const [outdoorInteract, setOutdoorInteract] = useState([])

    const [timeRange, setTimeRange] = useState("today"); 
    const [selectedDate, setSelectedDate] = useState("");
    const getIndoorInteracts = async (date) => {
        const response = await getIndoorInteract(date)
    }
    const getOutdoorInteracts = async (date) => {
        const response = await getOutdoorInteract(date)
    }
    const getFlameAndVibration = async (date) => {
        const response = await getFlameAndVibrationCount(date)
        setIndoorData(response)
    }
    const getMotion = async (date) => {

        const response = await getMotionCount(date)
        setOutdoordoorData(response)
    }
    const fetchData = async () => {
        let queryDate = formattedDate
        if (timeRange === "day") {
          await getFlameAndVibration(selectedDate);
          await getMotion(selectedDate);

        } else if (timeRange === "month") {
            queryDate = selectedDate.slice(0, 7); 
          await getFlameAndVibration(queryDate);
          await getMotion(queryDate);
        } else if (timeRange === "year") {
            queryDate = selectedDate.slice(0, 4); 
          await getFlameAndVibration(queryDate);
          await getMotion(queryDate);
        } else if(timeRange === "today") {
            getFlameAndVibration(formattedDate)
            getMotion(formattedDate)
        }
        const indoorResponse = await getIndoorInteract(queryDate);
        console.log(indoorResponse)
        const outdoorResponse = await getOutdoorInteract(queryDate);

        setIndoorInteract(indoorResponse);
        setOutdoorInteract(outdoorResponse);
      };
      const countActions = (data, device) => {
        let onCount = 0;
        let offCount = 0;
    
        data.forEach((item) => {

          if (item.actions.some((action) => action.includes(`${device} turn-on`))) {
            onCount++;
          }
          if (item.actions.some((action) => action.includes(`${device} turn-off`))) {
            offCount++;
          }
        });
        return { onCount, offCount };
      };
      const indoorCounts = countActions(indoorInteract, "Buzzer");
      const outdoorCounts = countActions(outdoorInteract, "LED");
      const indoorPieData = {
        labels: ["On", "Off"],
        datasets: [
          {
            label: "Buzzer Actions",

            data: [indoorCounts.onCount, indoorCounts.offCount],
            backgroundColor: ["rgba(54, 162, 235, 0.7)", "rgba(255, 99, 132, 0.7)"],
            borderColor: ["black", "black"],
            borderWidth: 1,
          },
        ],
      };
    
      const outdoorPieData = {
        labels: ["On", "Off"],
        datasets: [
          {
            label: "LED Actions",
            data: [outdoorCounts.onCount, outdoorCounts.offCount],
            backgroundColor: ["rgba(75, 192, 192, 0.7)", "rgba(255, 206, 86, 0.7)"],
            borderColor: ["black", "black"],
            borderWidth: 1,
          },
        ],
      };
      const formatTime = (time) => {
        if (timeRange === "day" || timeRange === "today") {
          return `${time}:00`; 
        }  else if (timeRange === "year") {
            const months = [
              "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
              "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];
            return months[parseInt(time, 10) - 1]; 
          }
          return `${time}`;
      };
      useEffect(() => {
        fetchData();
      }, [selectedDate, timeRange]);

      const generateLabels = () => {
        if (timeRange === "day" || timeRange === "today") {
          return Array.from({ length: 24 }, (_, i) => `${i}:00`); 
        } else if (timeRange === "month") {
          const daysInMonth = new Date(selectedDate.slice(0, 4), selectedDate.slice(5, 7), 0).getDate();
          return Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`); 
        } else if (timeRange === "year") {
          return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]; // Nhãn theo tháng
        }
        return [];
      };
    
      const labels = generateLabels();
      const data = {
        labels, 
        datasets: [
          {
            label: "Vibration Count",
            data: labels.map((time) =>
              indoorData.find((item) => formatTime(item.time) === time)?.vibrationCount || 0
            ),
            backgroundColor: "rgba(54, 162, 235, 0.7)", 
          },
          {
            label: "Flame Count",
            data: labels.map((time) =>
              indoorData.find((item) => formatTime(item.time) === time)?.flameCount || 0
            ),
            backgroundColor: "rgba(255, 99, 132, 0.7)", 
          },
          {
            label: "Motion Detect Count",
            data: labels.map((time) =>
              {
                return (
                    outdoorData.find((item) => formatTime(item.time) === time)?.motionDetectCount || 0
                )
              }
            ),
            backgroundColor: "rgba(75, 192, 192, 0.7)", 
          },
        ],
      };
    
      const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            labels: {
              color: "white", 
            },
          },
          title: {
            display: true,
            text: "Detection Counts Over Time",
            color: "white", 
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: `${(timeRange === 'day' || timeRange === 'today') ? "Hour" : (timeRange === 'month' ? "Date" : "Month")} `,
              color: "white",
            },
            ticks: {
              color: "white", 
            },
          },
          y: {
            title: {
              display: true,
              text: "Count",
              color: "white", 
            },
            ticks: {
              color: "white", 
            },
          },
        },
      };
    
      return (
        <div>
           <div style={{
            display: 'flex',
           }}>
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
      <Button variant="contained" color="primary" sx={{ height: "55px", marginLeft: '15px' }}>
        Fetch Data
      </Button>
           </div>

          <div style={{height: "300px"}}>
          <Bar data={data} options={options} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
        <div style={{ width: "45%", height: "300px", textAlign: 'center'}}>
          <h3>Buzzer (Indoor)</h3>
          <Pie data={indoorPieData} style={{
            marginLeft: '25%'
          }} options={{
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "white", // Màu chữ chú thích
          },
        },
      },
    }}/>
        </div>
        <div style={{ width: "45%", height: "300px", textAlign: "center"  }}>
          <h3>LED (Outdoor)</h3>
          <Pie data={outdoorPieData}  style={{
            marginLeft: '25%'
          }} options={{
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "white", // Màu chữ chú thích
          },
        },
      },
    }} />
        </div>
      </div>
        </div>
      );
}
export default HistoryInteract;