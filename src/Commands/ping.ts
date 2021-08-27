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