import { SlashCommandBuilder } from "@discordjs/builders";
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CacheType, CommandInteraction, InteractionResponse, PermissionsBitField } from "discord.js";
import { Bot } from "src/client";
import { Interaction } from "../loaders/interaction";
import { Response } from "src/types/types";

export default class Ping extends Interaction {
    constructor() {
        super({
            buttonIds: ["ping-btn", "pong-btn"],
            data: new SlashCommandBuilder().setName("ping").setDescription("Send websockets ping in ms"),
        });
    }

    public async executeCommandInteraction(bot: Bot, interaction: CommandInteraction, ...args: any[]): Promise<InteractionResponse<boolean> | undefined> {
        const perm = interaction.member?.permissions as Readonly<PermissionsBitField>;

        if (!perm.has(PermissionsBitField.Flags.KickMembers)) {
            return interaction.reply({ content: "You don't have permissions to use this command", ephemeral: true });
        }

        const btn = new ButtonBuilder().setCustomId("ping-btn").setLabel("Ping").setStyle(ButtonStyle.Primary);
        const pbtn = new ButtonBuilder().setCustomId("pong-btn").setLabel("Pong").setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(btn, pbtn);

        await interaction.reply({ ephemeral: false, components: [row] });
    }

    public async executeButtonInteraction(bot: Bot, interaction: ButtonInteraction<CacheType>, buttonId: string): Promise<Response> {
        await interaction.deferUpdate();
        if (buttonId === "ping-btn") {
            await interaction.followUp({ content: `Pong! ${bot.ws.ping}, ExecuteButtonInteraction`, ephemeral: true });
        }

        if (buttonId === "pong-btn") {
            await interaction.followUp({ content: `Ping! ${bot.ws.ping}, ExecuteButtonInteraction`, ephemeral: true });
        }

        return;
    }
}
