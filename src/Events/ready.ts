import { Event } from "../Loaders/event";
import { Bot } from "../Client";
import { GUILDID } from "../Config";
export default class Ready extends Event {

    constructor() {
        super({ name: 'ready' })
    }

    public async run(bot: Bot): Promise<void> {
        console.log(`Logged in as ${bot.user?.tag}`)

        const cmd = await bot.guilds.cache.get(GUILDID)?.commands.set(bot.commands)

        if (cmd) return console.log("Successfully registered application (/) commands.")
    }

}