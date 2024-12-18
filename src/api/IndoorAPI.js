import axios from "axios";

export const getHistoryData = async (date, page) => {
    const response = await axios.post(`http://localhost:8000/api/indoor/getIndoorHistoryData?page=${page}`, {date})
    return response.data
}
export const controllBuzzer = async (userId, command) => {
    const response = await axios.post(`http://localhost:8000/api/controll/buzzer`, {userId, command})
    return response.data
}
export const getDataForHistory = async (date, page) => {
    const response = await axios.post(`http://localhost:8000/api/indoor/getHistoryData?page=${page}`, {date})
    return response.data
}