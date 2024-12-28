import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, Card, CardContent, IconButton, BottomNavigationAction, BottomNavigation, Paper, styled, Dialog, DialogTitle, DialogContent, DialogActions, Button, Switch  } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import BedIcon from "@mui/icons-material/Bed";
import WeekendIcon from "@mui/icons-material/Weekend";
import SecurityIcon from "@mui/icons-material/Security";
import YardIcon from '@mui/icons-material/Yard';
import PieChartIcon from "@mui/icons-material/PieChart";
import SettingsIcon from "@mui/icons-material/Settings";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import "./Home.css";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Indoor from "../Components/Indoor";
import socketService from "../../Functions/socketService";
import RealTimeChart from "../Components/RealTimeChart";
import HistoryDisplay from "../Components/HistoryDisplay";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { controllBuzzer, getHistoryData } from "../../api/IndoorAPI";
import Outdoor from "../Components/Outdoor";
import RealTimeChartOutdoor from "../Components/RealTimeChartOutdoor";
import HistoryOutdoorDisplay from "../Components/HistoryOutdoorDisplay";
import { toggleLight } from "../../api/outdoorAPI";
import HistoryInteract from "../Components/HistoryInteract";
const Home = () => {
  const rooms = [
    { name: "Indoor", devices: 15, icon: <BedIcon fontSize="large" color="primary" /> },
    { name: "Outdoor", devices: 12, icon: <WeekendIcon fontSize="large" color="success" /> },
  ];
  const [popUp, setPopUp] = useState(true)
  const [popUpMessage, setPopUpMessage] = useState("Flame detected! Please check immediately.")
  const [lightOn, setLightOn] = useState(false)
  const [historyData, setHistoryData] = useState([])
  const indoorTopics = [
    "Iot_InDoor/temperature",
    "Iot_InDoor/humidity",
    "Iot_InDoor/gas",
    "Iot_InDoor/flame",
    "Iot_InDoor/vibration",
  ];

  const outdoorTopics = [
    "Iot_OutDoor/temperature",
            "Iot_OutDoor/humidity",
            "Iot_OutDoor/air",
            "Iot_OutDoor/motion",
            "Iot_OutDoor/Led_Control"
  ];
  const [selectedTab, setSelectedTab] = useState("indoor")
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
  const handleToggle = async (event) => {
    setLightOn(event.target.checked); 
    if(event.target.checked){
      const response =await toggleLight("675aac3c5a5c76cac0e428c9", "ON")
      console.log(response)
    } else {
      const response = await toggleLight("675aac3c5a5c76cac0e428c9", "OFF")
      console.log(response)

    }
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
          if(message.sensorType === "motion" && message.value === 1){
            setAlerts((prevAlerts) => [...prevAlerts.slice(-4), "Motion detected! Possible unauthorized activity in the monitored area."]);
            triggerAlert("Motion detected! Possible unauthorized activity in the monitored area.")
          }
          return updatedData;
        });
      });
    });
  };
  useEffect(() => {
    const topics = selectedTab === "indoor" ? indoorTopics : outdoorTopics;
    handleSocketConnection(topics);
    return () => {
      const allTopics = [...indoorTopics, ...outdoorTopics];
      allTopics.forEach((topic) => socketService.off(topic));
    };
  }, [selectedTab]);
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
        <IconButton className={`tab-icon ${selectedTab === 'indoor' && 'active'}`} onClick={() => {
          setSelectedTab('indoor')
        }}>
          <HomeIcon />
        </IconButton>
        <IconButton className={`tab-icon ${selectedTab === 'indoor' && 'active'}`} onClick={() => {
          setSelectedTab('outdoor')
        }}>
          <YardIcon/>
        </IconButton>
        <IconButton className="tab-icon" onClick={() => {
          setSelectedTab('interact')
        }}>
          <PieChartIcon />
        </IconButton>
        <IconButton className="tab-icon">
          <SettingsIcon />
        </IconButton>
        <IconButton className="tab-icon power">
          <PowerSettingsNewIcon />
        </IconButton>
      </Box>
      <Box sx={{ maxWidth: "1300px", margin: "6% auto 0 auto", padding: "20px", backgroundColor: "rgba(255, 254, 254, 0.2)", backdropFilter: "blur(5px)", borderRadius: "50px", height: "720px" } }>
        {
          selectedTab === 'interact' ? (
            <div>
              <div>
                <HistoryInteract/>
              </div>
            </div>
          ) : (
            <>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h4" fontWeight="bold" color="#fff">
            My Home
          </Typography>
          <IconButton>
            <HomeIcon sx={{ color: "#fff" }} />
          </IconButton>
        </Box>
        <div className="container">
          {
            selectedTab === "indoor" ? (
              <div className="left-container">
            <Indoor sensorData={sensorData}/>
            <Card sx={{marginTop: '20px', borderRadius: '16px', backgroundColor: "rgba(255, 254, 254, 0.2)", backdropFilter: "blur(5px)", height: "490px"}}>
              <RealTimeChart sensorData={sensorData} type={selectedTab}/>
            </Card>
          </div>
            ) : (
              <div className="left-container">
                <Outdoor sensorData={sensorData}/>
                <Card sx={{marginTop: '20px', borderRadius: '16px', backgroundColor: "rgba(255, 254, 254, 0.2)", backdropFilter: "blur(5px)", height: "490px"}}>
                  <RealTimeChartOutdoor sensorData={sensorData} type={selectedTab}/>
                </Card>
          </div>
            )
          }
          <div className="right-container">
           {
            selectedTab === 'outdoor' ? (
              <div style={{
                display: "flex",
                justifyContent: "space-between",
              }}>
              <div className="right-container-up" style={{
                width: '60%',
                height: '200px',
                overflowY: 'scroll'
              }}>
                <>
                    <Typography variant="h6" color="error" gutterBottom>
                      Alerts:
                    </Typography>
                    {alerts.map((alert, index) => (
                      <Typography key={index} variant="body1" color="error">
                        {new Date().toLocaleString()} {alert}
                      </Typography>
                    ))}
                  </>
              </div>
              <Card
          sx={{
            marginBottom: "20px",
            borderRadius: "16px",
            backgroundColor: lightOn ? "#c4f053" : "#ddd",
            padding: "20px",
            boxShadow: lightOn ? "0px 4px 12px rgba(196, 240, 83, 0.6)" : "0px 4px 8px rgba(0, 0, 0, 0.2)",
            color: "#000",
            height: "190px",
            width: '23%',
            position: "relative",
            overflow: "hidden",
            transition: "background-color 0.5s ease, box-shadow 0.5s ease",
          }}
        >
          <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100px",
          animation: lightOn ? "fadeIn 0.5s ease-in-out" : "fadeOut 0.5s ease-in-out",
        }}
      >
        {lightOn ? (
          <LightbulbIcon
            sx={{
              fontSize: "64px",
              color: "#ffeb3b",
              animation: "glow 1.5s infinite alternate",
            }}
          />
        ) : (
          <LightbulbOutlinedIcon
            sx={{
              fontSize: "64px",
              color: "#555",
            }}
          />
        )}
      </Box>
      <Typography variant="h6" fontWeight="bold" textAlign="center" sx={{ marginBottom: "8px" }}>
        {lightOn ? "Light On" : "Light Off"}
      </Typography>
      <Typography variant="body2" textAlign="center" sx={{ marginBottom: "16px", color: "#333" }}>
        Toggle the light
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Switch
          checked={lightOn}
          onChange={handleToggle}
          color="primary"
          sx={{
            "& .MuiSwitch-thumb": {
              backgroundColor: lightOn ? "#ffeb3b" : "#555",
            },
            "& .MuiSwitch-track": {
              backgroundColor: lightOn ? "#c4f053" : "#ddd",
            },
          }}
        />
      </Box>
        </Card>
              </div>
            ) : (
              <div className="right-container-up" style={{
                height: '200px',
                overflowY: 'scroll'
              }}>
                <>
                    <Typography variant="h6" color="error" gutterBottom>
                      Alerts:
                    </Typography>
                    {alerts.map((alert, index) => (
                      <Typography key={index} variant="body1" color="error">
                        {new Date().toLocaleString()} {alert}
                      </Typography>
                    ))}
                  </>
              </div>
            )
           }
            <div className="right-container-down">
              {
                selectedTab === 'indoor' ? (
                  <HistoryDisplay /> 
                ) : (
                  <HistoryOutdoorDisplay/>
                )
              }
            </div>
          </div>
        </div>
            </>
          )
        }

      </Box>
    </Box>
  );
};

export default Home;
