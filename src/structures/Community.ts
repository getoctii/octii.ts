import Channel from './Channel'
import Client from './Client'

export default class Community {
  client: Client
  id: string
  name: string
  icon: string
  large: boolean
  ownerID: string
  channels: Channel[]

  constructor({ client, id, name, icon, large, ownerID, channels }: Community) {
    this.client = client
    this.id = id
    this.name = name
    this.icon = icon
    this.large = large
    this.ownerID = ownerID
    this.channels = channels
  }
}
