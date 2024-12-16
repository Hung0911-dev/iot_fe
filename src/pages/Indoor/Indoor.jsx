import { Card, Typography, Grid, Box, Tabs, Tab } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { styled } from '@mui/system';
import mqtt from 'mqtt';

import socketService from '../../Functions/socketService';
import { getHistoryData } from '../../api/IndoorAPI';
const Indoor = () => {
    const [sensorData, setSensorData] = useState([])
    const location = useLocation()
    const [currentTab, setCurrentTab] = useState(0);
    const topics = [
      'Iot_InDoor/temperature',
      'Iot_InDoor/humidity',
      'Iot_InDoor/gas',
      'Iot_InDoor/flame',
      'Iot_InDoor/vibration',
      'test-event'
  ];
  const handleGetHistoryData = async () => {
    const response = await getHistoryData()
  }
  const handleSocketMessage = async (topic) => {
    socketService.on(topic, (message) => {
        setSensorData((prevData) => {
            if (!Array.isArray(prevData)) {
                return [];
            }

            const updatedData = prevData.map((sensor) => {
                if (sensor.sensorType === message.sensorType) {
                    return { ...sensor, value: message.value };
                }
                return sensor;
            });

            const isExistingSensor = updatedData.some((sensor) => sensor.sensorType === message.sensorType);
            if (!isExistingSensor) {
                updatedData.push({
                    sensorType: message.sensorType,
                    value: message.value,
                    icon: message.icon || '', 
                });
            }


            return updatedData;
        });
    });
};
    useEffect(() => {
        const state = location.state
        setSensorData(state)
        topics.map(async (topic) => {
          await handleSocketMessage(topic)
        })
        return () => {
          topics.map((topic) => {
            socketService.off(topic)
          })
        }
    }, [])
    const SensorCard = styled(Card)({
        padding: '20px',
        textAlign: 'center',
        backgroundColor: '#f4f4f9',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.05)',
        },
      });
      const renderCurrentTab = () => {
        switch (currentTab) {
          case 1:
            return (
              <Grid container spacing={3} maxWidth="lg">
                {sensorData.map((sensor, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <SensorCard>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#00796b', marginBottom: '10px' }}>
                        {sensor.icon} {sensor.sensorType}
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#004d40' }}>
                        {sensor.value}
                      </Typography>
                    </SensorCard>
                  </Grid>
                ))}
              </Grid>
            );
          case 0:
            return (
              <Typography variant="h6" sx={{ color: '#004d40', textAlign: 'center' }}>
                Displaying the Visualization data of sensors...
              </Typography>
            );
          case 2:
            return (
              <Typography variant="h6" sx={{ color: '#004d40', textAlign: 'center' }}>
                Displaying the history data of sensors...
              </Typography>
            );
          default:
            return null;
        }
      };
    
    return (
        <div style={{ margin: '20px', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
          {
            sensorData ? (
                <>
                    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: '#e0f7fa',
      padding: '20px',
    }}>
      <Typography variant="h4" sx={{ color: '#006064', marginBottom: '20px', fontWeight: 'bold' }}>
        Smart Home - Indoor Sensors
      </Typography>
      <Tabs
        value={currentTab}
        onChange={(e, newValue) => setCurrentTab(newValue)}
        indicatorColor="primary"
        textColor="primary"
        centered
        sx={{ marginBottom: '20px' }}
      >
        <Tab label="Visualize Data" />
        <Tab label="Current Data" />
        <Tab label="History Data" />
      </Tabs>
      {renderCurrentTab()}
    </Box>
                </>
            ) : (
                <h1>Loading...</h1>
            )
          }
        </div>
      );
}
export default Indoor;