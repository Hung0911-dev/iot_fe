import React, { useEffect } from "react";
import { Box, Card, CardContent, Typography,Grid, Switch } from "@mui/material";
import "./Indoor.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDroplet, faFireFlameSimple, faTemperatureThreeQuarters } from '@fortawesome/free-solid-svg-icons';
const Indoor = ({ sensorData }) => {

    useEffect(() => {
      console.log(sensorData)
    },[sensorData])
    


  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", marginLeft: "-110px", textAlign: "center", alignContent: "center" }}>
      {sensorData.length > 0 ? (
        <Grid container spacing={20} justifyContent="center">
          {sensorData.map((sensor, index) => (
            sensor.sensorType !== "vibration" && sensor.sensorType !== "flame" && (
                <Grid item xs={6} sm={3} key={index}>
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
                            color: "#333", 
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
                        sx={{ fontSize: "18px", color: "#5c6bc0" }}>
                         {sensor.sensorType === "temperature" ? (
                          <FontAwesomeIcon icon={faTemperatureThreeQuarters} />
                         ) : (
                          sensor.sensorType === "humidity" ? (
                            <FontAwesomeIcon icon={faDroplet} />
                          ) : (
                            <FontAwesomeIcon icon={faFireFlameSimple} />
                          )
                         )
                        } 
                        <span style={{
                          marginTop: "10px"
                        }}>
                        {sensor.sensorType}
                        </span>
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{ fontSize: "22px", mt: 1, color: "#43a047" }}
                        >
                            {sensor.value}{sensor.sensorType === "temperature" ? (
                          "°C"
                         ) : (
                          sensor.sensorType === "humidity" ? (
                            "%"
                          ) : (
                            "ppm"
                          )
                         )
                        }
                        </Typography>
                    </CardContent>
                    </Card>
                </Grid>
            )
          ))}
        </Grid>
      ) : (
        <Typography variant="h6" textAlign="center">
          Loading...
        </Typography>
      )}
    </Box>
  );
};

export default Indoor;