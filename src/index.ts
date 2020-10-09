import EventSource from 'eventsource'
import axios from 'axios'

const clientGateay = axios.create({
  baseURL: 'https://api.chat.innatical.com'
})

const makePropertyMapper = <T>(prototype: any, key: string, mapper: (value: any) => T) =>  {
	const values = new Map<any, T>()
	Object.defineProperty(prototype, key, {
		set(firstValue: any) {
			Object.defineProperty(this, key, {
				get() {
					return values.get(this)
				},
				set(value: any) {
					values.set(this, mapper(value))
				},
				enumerable: true,
			})
			this[key] = firstValue
		},
		enumerable: true,
		configurable: true,
	})
}

export const Command = (target: Client, propertyKey: string, descriptor: PropertyDescriptor) => {
  makePropertyMapper(target, 'commands', (value) => ({...value, [propertyKey]: descriptor.value}))
}

export class Channel {
  client: Client
  id: string

  constructor(client: Client, id: string) {
    this.client = client
    this.id = id
  }

  async send(content: string) {
    await clientGateay.post(`/channels/${this.id}/messages`, new URLSearchParams({ content }), {
      headers: {
        Authorization: this.client.token
      }
    })
  }
}

export class Message {
  id: string
  content: string
  created_at: string
  updated_at: string
  channel: Channel

  constructor(id: string, content: string, created_at: string, updated_at: string, channel: Channel) {
    this.id = id
    this.content = content
    this.created_at = created_at
    this.updated_at = updated_at
    this.channel = channel
  }
}

export abstract class Client {
  token: string
  prefix: string
  commands: {
    [key: string]: (message: Message) => void
  } = {}

  constructor(prefix: string, token: string) {
    this.token = token
    this.prefix = prefix
  }

  run() {
    const gateway = new EventSource('https://api.chat.innatical.com/events/subscribe', {
      headers: {
        Authorization: this.token
      }
    })

    gateway.addEventListener('NEW_MESSAGE', (e: any) => {
      const data = JSON.parse(e.data)
      const message = new Message(data.id, data.content, data.created_at, data.updated_at, new Channel(this, data.channel_id))
      const handler = Object.keys(this.commands).find(command => data.content.startsWith(this.prefix + command))
      if (handler) this.commands[handler](message)
      if (this.onMessage) this.onMessage(message)
    })
  }

  onMessage?(message: Message): void
}