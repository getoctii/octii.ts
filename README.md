# octii.ts

The offical bot library for [octii.chat](https://octii.chat) using the user API.

## Installation

The prefered package manager is yarn but npm can be used. To install simply run:

```zsh
yarn add @innatical/octii.ts
```

## Usage

```ts
import { Client, Command, Message } from 'octii.ts'

class Bot extends Client {
  constructor() {
    super('!', process.env.BOT_TOKEN!)
  }

  @Command
  async ping(msg: Message) {
    await msg.channel.send('Pong!')
  }
}

new Bot().run()
```

## Documentation

Soon&trade;

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
