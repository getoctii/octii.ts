import axios from 'axios'

export const clientGateway = axios.create({
  baseURL: 'https://api.octii.chat/v1'
})
