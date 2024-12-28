import axios from "axios";

export const getHistoryData = async (date, page) => {
    const response = await axios.post(`http://localhost:8000/api/indoor/getIndoorHistoryData?page=${page}`, {date})
    return response.data
}
export const controllBuzzer = async (userId, command) => {
    const response = await axios.post(`http://localhost:8000/api/control/buzzer`, {userId, command})
    return response.data
}
export const getDataForHistory = async (date, page) => {
    const response = await axios.post(`http://localhost:8000/api/indoor/getIndoorHistoryData?page=${page}`, {date})
    return response.data
}
export const getTableHistoryData = async (date, page) => {
    const response = await axios.post(`http://localhost:8000/api/indoor/getTableHistoryData?page=${page}`, {date})
    return response.data
}
export const getFlameAndVibrationCount = async (date) => {
    const response = await axios.post(`http://localhost:8000/api/indoor/getFlameAndVibrationCount`, {date})
    return response.data
}
export const getIndoorInteract = async (date) => {
    const response = await axios.post(`http://localhost:8000/api/control/getIndoorInteract`, {date})
    return response.data
}