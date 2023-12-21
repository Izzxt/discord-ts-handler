import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, InteractionResponse, PermissionsBitField } from "discord.js";
import { Bot } from "../client";
import { Interaction } from "../loaders/interaction";

export default class Kick extends Interaction {
    constructor() {
        super({
            data: new SlashCommandBuilder()
                .setName("kick")
                .setDescription("Kick a user from the server")
                .addUserOption((option) => option.setName("user").setDescription("User to be kicked"))
                .addStringOption((option) => option.setName("reason").setDescription("Reason to kick the user")),
        });
    }
    public async executeCommandInteraction(bot: Bot, interaction: CommandInteraction, ...args: any[]): Promise<InteractionResponse<boolean> | undefined> {
        const user = interaction.options.getUser("user");
        const reason = interaction.options.get("reason");
        const perm = interaction.member?.permissions as Readonly<PermissionsBitField>;

        if (!perm.has(PermissionsBitField.Flags.KickMembers)) {
            return interaction.reply({ content: "You don't have permissions to use this command", ephemeral: true });
        }

        if (!interaction.guild?.members.me?.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return interaction.reply({ content: "This bot need permission KICK_MEMBER to use this command", ephemeral: true });
        }

        if (user === null) return;
    }
}
