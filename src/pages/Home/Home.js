import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, Card, CardContent, IconButton, BottomNavigationAction, BottomNavigation, Paper, styled, Dialog, DialogTitle, DialogContent, DialogActions, Button  } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import BedIcon from "@mui/icons-material/Bed";
import WeekendIcon from "@mui/icons-material/Weekend";
import SecurityIcon from "@mui/icons-material/Security";
import PieChartIcon from "@mui/icons-material/PieChart";
import SettingsIcon from "@mui/icons-material/Settings";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import "./Home.css";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Indoor from "../Components/Indoor";
import socketService from "../../Functions/socketService";
import RealTimeChart from "../Components/RealTimeChart";
import HistoryDisplay from "../Components/HistoryDisplay";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { controllBuzzer, getHistoryData } from "../../api/IndoorAPI";
const Home = () => {
  const rooms = [
    { name: "Indoor", devices: 15, icon: <BedIcon fontSize="large" color="primary" /> },
    { name: "Outdoor", devices: 12, icon: <WeekendIcon fontSize="large" color="success" /> },
  ];
  const [popUp, setPopUp] = useState(true)
  const [popUpMessage, setPopUpMessage] = useState("Flame detected! Please check immediately.")
  const [historyData, setHistoryData] = useState([])
  const indoorTopics = [
    "Iot_InDoor/temperature",
    "Iot_InDoor/humidity",
    "Iot_InDoor/gas",
    "Iot_InDoor/flame",
    "Iot_InDoor/vibration",
    "Iot_InDoor/alert"
  ];

  const outdoorTopics = [
    "Iot_OutDoor/temperature",
    "Iot_OutDoor/humidity",
    "Iot_OutDoor/gas",
    "Iot_OutDoor/airQuality",
    "Iot_OutDoor/alert"
  ];

  const [sensorData, setSensorData] = useState([]);
  const [currentTab, setCurrentTab] = useState("Indoor");
  const [alerts, setAlerts] = useState([]);
  const triggerAlert = async (message) => {
    setPopUpMessage(message);
    setPopUp(true); 
    setAlerts((prevAlerts) => [...prevAlerts.slice(-4), message]);
    await controllBuzzer("675aac3c5a5c76cac0e428c9", 'on')
  };

  const closePopup = async () => {
    setPopUp(false);
    await controllBuzzer("675aac3c5a5c76cac0e428c9", 'off')
  };
  const handleSocketConnection = (topics) => {
    socketService.disconnect();

    socketService.connect("675aac3c5a5c76cac0e428c9");
    topics.forEach((topic) => {
      socketService.on(topic, (message) => {
        setSensorData((prevData) => {
          const updatedData = [...prevData];
          const index = updatedData.findIndex((sensor) => sensor.sensorType === message.sensorType);

          if (index !== -1) {
            updatedData[index] = { ...updatedData[index], value: message.value };
          } else {
            updatedData.push({ sensorType: message.sensorType, value: message.value });
          }
          if (message.sensorType === "flame" && message.value === 1) {
            setAlerts((prevAlerts) => [...prevAlerts.slice(-4), "Flame detected! Please check immediately."]);
            triggerAlert("Flame detected! Please check immediately.")
          }
          if (message.sensorType === "vibration" && message.value === 1) {
            setAlerts((prevAlerts) => [...prevAlerts.slice(-4), "Vibration detected! Possible intruder alert."]);
            triggerAlert("Vibration detected! Possible intruder alert.")
          }
          return updatedData;
        });
      });
    });
  };
  // useEffect(() => {
  //   const turnon = async () => {
  //     await controllBuzzer('675aac3c5a5c76cac0e428c9', 'on')
  //   }
  //   turnon()
  // }, [])
  useEffect(() => {
    const topics = currentTab === "Indoor" ? indoorTopics : outdoorTopics;
    handleSocketConnection(topics);
    return () => {
      const allTopics = [...indoorTopics, ...outdoorTopics];
      allTopics.forEach((topic) => socketService.off(topic));
    };
  }, [currentTab]);
  const [value, setValue] = useState(0);
  const CustomBottomNavigation = styled(BottomNavigation)(({ theme }) => ({
    backgroundColor: "red", 
    borderRadius: "20px",
    height: "60px",
  }));
  return (
    <Box className="background">
      <Dialog
      open={popUp}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        style: { borderRadius: "12px", overflow: "hidden", position: "relative" },
      }}
    >
      <Box
        sx={{
          background: "linear-gradient(to right, #FF7D7D, #FFBABA)",
          height: "12px",
        }}
      />

      <IconButton
        onClick={closePopup}
        sx={{ position: "absolute", top: 8, right: 8, color: "#888" }}
      >
        <CloseIcon />
      </IconButton>

      <DialogTitle sx={{ textAlign: "center", mt: 2 }}>
        <WarningAmberIcon
          fontSize="large"
          sx={{
            color: "#FF7D7D",
            backgroundColor: "rgba(255, 125, 125, 0.2)",
            borderRadius: "50%",
            padding: "10px",
            marginBottom: "8px",
          }}
        />
        <Typography variant="h6" fontWeight="bold">
          Warning
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" textAlign="center">
          {popUpMessage}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", mb: 2 }}>
        <Button
          onClick={closePopup}
          color="error"
          variant="contained"
          sx={{ borderRadius: "8px" }}
        >
          Turn off the buzzer
        </Button>
      </DialogActions>
    </Dialog>
      <Box className="tab-bar">
        <IconButton className="tab-icon active">
          <HomeIcon />
        </IconButton>
        <IconButton className="tab-icon">
          <SecurityIcon />
        </IconButton>
        <IconButton className="tab-icon">
          <PieChartIcon />
        </IconButton>
        <IconButton className="tab-icon">
          <SettingsIcon />
        </IconButton>
        <IconButton className="tab-icon power">
          <PowerSettingsNewIcon />
        </IconButton>
      </Box>
      <Box sx={{ maxWidth: "1200px", margin: "6% auto 0 auto", padding: "20px", backgroundColor: "rgba(255, 254, 254, 0.2)", backdropFilter: "blur(5px)", borderRadius: "50px", height: "800px" } }>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h4" fontWeight="bold" color="#fff">
            My Home
          </Typography>
          <IconButton>
            <HomeIcon sx={{ color: "#fff" }} />
          </IconButton>
        </Box>
        <div className="container">
          <div className="left-container">
            <Indoor sensorData={sensorData}/>
            <Card sx={{marginTop: '20px', borderRadius: '16px', backgroundColor: "rgba(255, 254, 254, 0.2)", backdropFilter: "blur(5px)"}}>
              <RealTimeChart sensorData={sensorData}/>
            </Card>
          </div>
          <div className="right-container">
            <div className="right-container-up">
            <Typography variant="h6" color="error" gutterBottom>
                Alerts:
              </Typography>
              {alerts.length > 0 ? (
                alerts.map((alert, index) => (
                  <Typography key={index} variant="body1" color="error">
                     {new Date().toLocaleString()} {alert}
                  </Typography>
                ))
              ) : (
                <Typography variant="body2" color="success">
                  No alerts currently.
                </Typography>
              )}
            </div>
            <div className="right-container-down">
              <HistoryDisplay /> 
            </div>
          </div>
        </div>

      </Box>
      {/* <Paper elevation={3} className="bottom-nav-container">
        <CustomBottomNavigation
          value={value}
          onChange={(event, newValue) => setValue(newValue)}
          showLabels
          sx={{
            backgroundColor: "rgba(255, 254, 254, 0.7)",
            borderRadius: "20px",
            height: "60px",
          }}
          className="bottom-nav"
        >
          <BottomNavigationAction
            label="Indoor"
            icon={<HomeIcon />}
            className={`nav-item ${value === 0 ? "active" : ""}`}
          />
          <BottomNavigationAction
            label="Outdoor"
            icon={<WeekendIcon />}
            className={`nav-item ${value === 1 ? "active" : ""}`}
          />
          <BottomNavigationAction
            icon={<AddCircleOutlineIcon />}
            className="nav-item add-button"
          />
        </CustomBottomNavigation>
      </Paper> */}
    </Box>
  );
};

export default Home;
