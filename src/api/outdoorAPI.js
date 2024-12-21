import axios from "axios"

export const getOutdoorHistoryData = async (date, page) => {
    const response = await axios.post(`http://localhost:8000/api/outdoor/getOutdoorHistoryData?page=${page}`, {date})
    return response.data
}