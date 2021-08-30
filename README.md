<!-- GETTING STARTED -->
# Discord TS Handler

## Getting Started

### Prerequisites
1. Make sure you have nodejs installed.
* yarn
  ```sh
  npm install -g yarn
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/your_username_/Project-Name.git
   ```
2. Install packages
   ```sh
   yarn
   ```
3. Rename `env.example` to `.env`
4. Enter your TOKEN, PREFIX, GUILDID, CLIENTID in `.env`
   ```sh
   TOKEN=your bot token
   PREFIX=
   GUILDID=your guild id
   CLIENTID=your client id
   ```
<!-- USAGE EXAMPLES -->
## Usage

* Build
   ```sh
   yarn start:build
   ```
* Start
   ```sh
   yarn start
   ```

### Register Commands
```ts
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Bot } from "src/Client";
import { Command } from "../Loaders/Command";

export default class Ping extends Command {

    constructor() {
        super({
            data: new SlashCommandBuilder().setName('ping').setDescription('Send websockets ping in ms')
        })
    }

    public async run(bot: Bot, interaction: CommandInteraction, ...args: any[]): Promise<void> {
        interaction.reply({ content: `Pong! ${bot.ws.ping}`, ephemeral: false })
    }

}
```

### Register Events
```ts
import { Event } from "../Loaders/event";
import { Bot } from "../Client";
import { GUILDID } from "../Config";

export default class Ready extends Event {

    constructor() {
        super({ name: 'ready' })
    }

    public async run(bot: Bot): Promise<void> {
        console.log(`Logged in as ${bot.user?.tag}`)
    }

}
```

<!-- CONTACT -->
## Contact

Discord - Izzat#0333

<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements
* [reconlx](https://youtube.com/c/reconlxx)
