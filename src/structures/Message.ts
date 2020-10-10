import Channel from './Channel'

export default class Message {
  id: string
  content: string
  created_at: string
  updated_at: string
  channel: Channel
  author: {
    id: string
    username: string
    avatar: string
    discriminator: number
  }

  constructor(
    id: string,
    content: string,
    created_at: string,
    updated_at: string,
    author: {
      id: string
      username: string
      avatar: string
      discriminator: number
    },
    channel: Channel
  ) {
    this.id = id
    this.content = content
    this.created_at = created_at
    this.updated_at = updated_at
    this.author = author
    this.channel = channel
  }
}
