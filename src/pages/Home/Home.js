import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, Card, CardContent, IconButton } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import BedIcon from "@mui/icons-material/Bed";
import WeekendIcon from "@mui/icons-material/Weekend";
import BathtubIcon from "@mui/icons-material/Bathtub";
import KitchenIcon from "@mui/icons-material/Kitchen";
import StoreIcon from "@mui/icons-material/Store";
import SchoolIcon from "@mui/icons-material/School"
import mqtt from 'mqtt';
import "./Home.css"
import { useNavigate } from "react-router-dom";
import socketService from "../../Functions/socketService";
const Home = () => {
  const [message, setMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [indoorData, setIndoorData] = useState([])
  const navigate = useNavigate()
    const rooms = [
        { name: "Indoor", devices: 15, icon: <BedIcon fontSize="large" color="primary" /> },
        { name: "Outdoor", devices: 12, icon: <WeekendIcon fontSize="large" color="success" /> },
    ];
    const topics = [
      'Iot_InDoor/temperature',
      'Iot_InDoor/humidity',
      'Iot_InDoor/gas',
      'Iot_InDoor/flame',
      'Iot_InDoor/vibration',
      'test-event'
  ];
    
    useEffect(() => {
      const brokerUrl = 'wss://877ab903f4a0407aa62686c3d962bb59.s1.eu.hivemq.cloud:8884/mqtt';
 
      const options = {
        clientId: `testClient_${Math.random().toString(16).slice(3)}`,
        clean: false,  
        connectTimeout: 20000,
        username: 'Hung091103',
        password: 'Hung091103',
      };
    
      const client = mqtt.connect(brokerUrl, options);
    
      client.on('connect', () => {
        console.log('Connected to HiveMQ Cloud.');
        setIsConnected(true); 
    
        const topic = 'Iot_InDoor';
        client.subscribe(topic, { qos: 1 }, (err) => {
          if (err) {
            console.error('Subscription error:', err);
          } else {
            console.log(`Subscribed to topic: ${topic}`);
          }
        });
      });
    
      client.on('message', (topic, message) => {
        console.log(`Received message from topic "${topic}":`, JSON.parse(message.toString( )));
        setIndoorData(JSON.parse(message.toString()))
        setMessage(message);
      });
    
      client.on('error', (err) => {
        console.error('Connection error:', err);
      });
  
      client.on('close', () => {
        console.log('Disconnected from HiveMQ Cloud.');
        setIsConnected(false);
      });
  
      client.on('reconnect', () => {
        console.log('Reconnecting...');
      });

      return () => {
        client.end(); 
       
      };
    }, []);
  
      return (
        <Box sx={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h4" fontWeight="bold">
              My Home
            </Typography>
            <IconButton>
              <HomeIcon />
            </IconButton>
          </Box>
    
          <Card sx={{ mb: 3, padding: "16px", background: "linear-gradient(to right, #7b1fa2, #512da8)", color: "#fff" }}>
            <Typography variant="h5">All Devices</Typography>
            <Typography variant="body1">45 devices</Typography>
          </Card>
    
          <Grid container spacing={3}>
            {rooms.map((room, index) => (
              <Grid item xs={12} sm={6} md={4} key={index} onClick={() => navigate('/indoor', {state: indoorData})}>
                <Card sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "16px" }} className="card">
                  {room.icon}
                  <CardContent>
                    <Typography variant="h6" align="center">
                      {room.name}
                    </Typography>
                    <Typography variant="body2" align="center">
                      {room.devices} devices
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      );
}
export default Home;