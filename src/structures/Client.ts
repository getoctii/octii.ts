import Message from './Message'
import decode from 'jwt-decode'
import EventSource from 'eventsource'
import Channel from './Channel'
import Community from './Community'
import User from './User'
import { clientGateway } from '../constants'

interface JoinEvent {
  id: string
  community_id: string
  user_id: string
}

export default abstract class Client {
  id: string
  token: string
  prefix: string

  commands: {
    [key: string]: (message: Message) => void
  } = {}

  constructor(prefix: string, token: string) {
    this.token = token
    this.id = decode(token)
    this.prefix = prefix
  }

  run() {
    const gateway = new EventSource(
      `https://gateway.octii.chat/events/subscribe/${this.id}`,
      {
        headers: {
          Authorization: this.token
        }
      }
    )

    gateway.addEventListener('NEW_MESSAGE', (e: any) => {
      const data = JSON.parse(e.data)
      const message = new Message(
        data.id,
        data.content,
        data.created_at,
        data.updated_at,
        data.author,
        new Channel(this, data.channel_id)
      )
      if (message.author.id !== this.id) {
        const handler = Object.keys(this.commands).find((command) =>
          data.content.startsWith(this.prefix + command)
        )
        if (handler) this.commands[handler](message)
      }
      if (this.onMessage) this.onMessage(message)
    })

    gateway.addEventListener('JOIN_MEMBER', async (e: any) => {
      const data = JSON.parse(e.data)

      if (this.onJoin) {
        const community = (
          await clientGateway.get(`/communities/${data.community_id}`, {
            headers: {
              Authorization: this.token
            }
          })
        ).data
        const user = (
          await clientGateway.get(`/users/${data.user_id}`, {
            headers: {
              Authorization: this.token
            }
          })
        ).data

        this.onJoin(
          new Community({
            client: this,
            id: community.id,
            name: community.name,
            icon: community.icon,
            large: community.large,
            ownerID: community.owner_id,
            channels: community.channels.map(
              (c: any) => new Channel(this, c.id)
            )
          }),
          new User({
            id: user.id,
            username: user.username,
            avatar: user.avatar,
            discriminator: user.discriminator
          })
        )
      }
    })

    if (this.onReady) this.onReady()
  }

  onJoin?(community: Community, user: User): void
  onMessage?(message: Message): void
  onReady?(): void
}
