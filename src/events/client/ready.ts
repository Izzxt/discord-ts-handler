import { Event } from "src/loaders/event";
import { Bot } from "../../client";
import { CLIENTID, GUILDID, TOKEN } from "../../config";
import { logger } from "../../utils/logger";
import { Events, REST, Routes } from "discord.js";

export default class Ready extends Event {
    constructor() {
        super({ name: Events.ClientReady });
    }

    public async execute(bot: Bot): Promise<void> {
        try {
            const rest = new REST({ version: "10" }).setToken(TOKEN);

            logger.info(`Started refreshing ${bot.interactions.length} application (/) commands.`);

            const data = await rest.put(Routes.applicationGuildCommands(CLIENTID, GUILDID), { body: bot.interactions });

            if (Array.isArray(data)) {
                logger.info(`Successfully reloaded ${data.length} application (/) commands.`);
            }
        } catch (error) {
            logger.error(error);
        }
    }
}
