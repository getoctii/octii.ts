import { clientGateway } from '../constants'
import Client from './Client'

export default class Channel {
  client: Client
  id: string

  constructor(client: Client, id: string) {
    this.client = client
    this.id = id
  }

  async send(content: string) {
    await clientGateway.post(
      `/channels/${this.id}/messages`,
      new URLSearchParams({ content }),
      {
        headers: {
          Authorization: this.client.token
        }
      }
    )
  }
}
