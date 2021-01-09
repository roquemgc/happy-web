import axios from 'axios'

const api = axios.create({
    baseURL: 'https://orphanages-happy.herokuapp.com/'
})

export default api;