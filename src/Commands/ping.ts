import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, InteractionResponse, PermissionsBitField } from "discord.js";
import { Bot } from "src/Client";
import { Command } from "../Loaders/Command";

export default class Ping extends Command {
    constructor() {
        super({
            data: new SlashCommandBuilder().setName("ping").setDescription("Send websockets ping in ms"),
        });
    }

    public async run(bot: Bot, interaction: CommandInteraction, ...args: any[]): Promise<InteractionResponse<boolean> | undefined> {
        const perm = interaction.member?.permissions as Readonly<PermissionsBitField>;

        if (!perm.has(PermissionsBitField.Flags.KickMembers)) {
            return interaction.reply({ content: "You don't have permissions to use this command", ephemeral: true });
        }
        interaction.reply({ content: `Pong! ${bot.ws.ping}`, ephemeral: false });
    }
}
