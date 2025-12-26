import axios from 'axios'

export const Api = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT || 'https://group-09-web-backend.onrender.com/api/v1'
})
