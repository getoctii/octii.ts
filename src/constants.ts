import axios from 'axios'

export const clientGateway = axios.create({
  baseURL: 'https://api.chat.innatical.com'
})
