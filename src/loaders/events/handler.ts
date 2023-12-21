import { Bot } from "../../client";
import { Client } from "discord.js";
import { readdirSync } from "fs";
import path from "path";

export class EventHandler {
    public _bot: Client

    constructor(bot: Bot) {
        this._bot = bot
    }

    public async init() {
        const event = readdirSync('./src/events')

        event.forEach(async file => {
            const Event = await require(path.join(__dirname, '../../', `events/${file}`)).default
            const ev = new Event()
            this._bot.on(ev._name.name, ev.execute.bind(null, this._bot))
        })
    }
}