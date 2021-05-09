import axios from 'axios'

export const clientGateway = axios.create({
  baseURL: 'https://gateway.octii.chat'
})
