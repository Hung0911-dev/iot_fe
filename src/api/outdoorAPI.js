import axios from "axios"

export const getOutdoorHistoryData = async (date, page) => {
    const response = await axios.post(`http://localhost:8000/api/outdoor/getOutdoorHistoryData?page=${page}`, {date})
    return response.data
}
export const getTableHistoryData = async (date, page) => {
    const response = await axios.post(`http://localhost:8000/api/outdoor/getTableHistoryData?page=${page}`, {date})
    return response.data
}
export const toggleLight = async (userId, command) => {
    const response = await axios.post(`http://localhost:8000/api/control/light`, {userId, command})
    return response.data
}
export const getMotionCount = async (date) => {
    const response = await axios.post(`http://localhost:8000/api/outdoor/countMotion`, {date})
    return response.data
}
export const getOutdoorInteract = async (date) => {
    const response = await axios.post(`http://localhost:8000/api/control/getOutdoorInteract`, {date})
    return response.data
}