import { Bot } from "../../Client";
import { Client } from "discord.js";
import { readdirSync } from "fs";
import path from "path/posix";

export class EventHandler {
    public _bot: Client

    constructor(bot: Bot) {
        this._bot = bot
    }

    public async init() {
        const event = readdirSync('./src/Events').filter(file => file.endsWith('.ts'));

        for (const file of event) {
            const Event = await require(path.join(__dirname, '../../../', `Events/${file}`)).default
            const ev = new Event()
            this._bot.on(ev._name.name, ev.run.bind(null, this._bot))
        }
    }
}