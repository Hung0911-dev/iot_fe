import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography,Grid, Switch } from "@mui/material";
import "./Outdoor.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AirIcon from '@mui/icons-material/Air';
import { faDroplet, faFireFlameSimple, faTemperatureThreeQuarters, faWind } from '@fortawesome/free-solid-svg-icons';
const Outdoor = ({ sensorData }) => {

        const [tempData, setTempData] = useState(0)
        const [humidityData, setHumidityData] = useState(0)
        const [airData, setAirData] = useState(0)
    
        useEffect(() => {
          if(sensorData){
            sensorData.map((data) => {
              if(data.sensorType === "temperature"){
                setTempData(data.value)
              } else if(data.sensorType === "humidity"){
                setHumidityData(data.value)
              } else if(data.sensorType === "air"){
                setAirData(data.value)
              }
            })
          }
        },[sensorData])
    


  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", marginLeft: "-110px", textAlign: "center", alignContent: "center" }}>
        <Grid container spacing={20} justifyContent="center">
                        <Grid item xs={6} sm={3} >
                            <Card
                                sx={{
                                    padding: "12px",
                                    textAlign: "center",
                                    borderRadius: "16px",
                                    width: "160px",
                                    height: "120px",
                                    background: "rgba(255, 255, 255, 0.2)",
                                    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
                                    backdropFilter: "blur(8px)", 
                                    color: "#ffff", 
                                    transition: "transform 0.2s ease, box-shadow 0.3s ease",
                                    "&:hover": {
                                    transform: "translateY(-5px)", 
                                    boxShadow: "0 10px 16px rgba(0, 0, 0, 0.2)",
                                    },
                                }}
                                >
                            <CardContent className="container-box">
                                <Typography className="left-box" variant="body1"
                                fontWeight="bold"
                                sx={{ fontSize: "18px", color: "#5c6bc0", fontWeight: "700" }}>
                                  <FontAwesomeIcon icon={faTemperatureThreeQuarters} />
                                <span style={{
                                  marginTop: "10px"
                                }}>
                                Temperature
                                </span>
                                </Typography>
                                <Typography
                                    variant="h6"
                                    sx={{ fontSize: "22px", mt: 1, color: "#ff6050", fontWeight: "700" }}
                                >
                                  {tempData}
                                  °C
                                </Typography>
                            </CardContent>
                            </Card>
                         
                        </Grid>
                        <Grid item xs={6} sm={3} >
                        <Card
                                sx={{
                                    padding: "12px",
                                    textAlign: "center",
                                    borderRadius: "16px",
                                    width: "160px",
                                    height: "120px",
                                    background: "rgba(255, 255, 255, 0.2)",
                                    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
                                    backdropFilter: "blur(8px)", 
                                    color: "#ffff", 
                                    transition: "transform 0.2s ease, box-shadow 0.3s ease",
                                    "&:hover": {
                                    transform: "translateY(-5px)", 
                                    boxShadow: "0 10px 16px rgba(0, 0, 0, 0.2)",
                                    },
                                }}
                                >
                            <CardContent className="container-box">
                                <Typography className="left-box" variant="body1"
                                fontWeight="bold"
                                sx={{ fontSize: "18px", color: "#5c6bc0", fontWeight: "700" }}>
                                <FontAwesomeIcon icon={faDroplet} />
                                <span style={{
                                  marginTop: "10px"
                                }}>
                                Humidity
                                </span>
                                </Typography>
                                <Typography
                                    variant="h6"
                                    sx={{ fontSize: "22px", mt: 1, color: "#ff6050", fontWeight: "700" }}
                                >
                                  {humidityData}
                                  %
                                </Typography>
                            </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={6} sm={3} >
                             
                        <Card
                                sx={{
                                    padding: "12px",
                                    textAlign: "center",
                                    borderRadius: "16px",
                                    width: "160px",
                                    height: "120px",
                                    background: "rgba(255, 255, 255, 0.2)",
                                    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
                                    backdropFilter: "blur(8px)", 
                                    color: "#ffff", 
                                    transition: "transform 0.2s ease, box-shadow 0.3s ease",
                                    "&:hover": {
                                    transform: "translateY(-5px)", 
                                    boxShadow: "0 10px 16px rgba(0, 0, 0, 0.2)",
                                    },
                                }}
                                >
                            <CardContent className="container-box">
                                <Typography className="left-box" variant="body1"
                                fontWeight="bold"
                                sx={{ fontSize: "18px", color: "#5c6bc0", fontWeight: "700" }}>
                                <FontAwesomeIcon icon={faWind} />
        
                                <span style={{
                                  marginTop: "10px"
                                }}>
                                Air Quality
                                </span>
                                </Typography>
                                <Typography
                                    variant="h6"
                                    sx={{ fontSize: "22px", mt: 1, color: "#ff6050", fontWeight: "700" }}
                                >
                                  {airData}
                                  ppm
                                </Typography>
                            </CardContent>
                            </Card>
                        </Grid>
                </Grid>
    </Box>
  );
};

export default Outdoor;