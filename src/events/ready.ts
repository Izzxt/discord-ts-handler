import { Event } from "../loaders/event";
import { Bot } from "../client";
import { GUILDID } from "../config";
import { logger } from "../utils/logger";
import { Events } from "discord.js";

export default class Ready extends Event {

    constructor() {
        super({ name: Events.ClientReady })
    }

    public async execute(bot: Bot): Promise<void> {
        logger.info(`Logged in as ${bot.user?.tag}`)

        const cmd = await bot.guilds.cache.get(GUILDID)?.commands.set(bot.interactions)

        if (cmd) return logger.info("Successfully registered application (/) commands.")
    }

}