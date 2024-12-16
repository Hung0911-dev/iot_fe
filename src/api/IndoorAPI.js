import axios from "axios";

export const getHistoryData = async (date, page) => {
    const response = await axios.post(`http://localhost:8000/api/indoor/getIndoorHistoryData?page=${page}`, {date})
    return response.data
}