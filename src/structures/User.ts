export default class User {
  id: string
  username: string
  avatar: string
  discriminator: number

  constructor({ id, username, avatar, discriminator }: User) {
    this.id = id
    this.username = username
    this.avatar = avatar
    this.discriminator = discriminator
  }
}
