import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Permissions} from "discord.js";
import { Bot } from "../Client";
import { Command } from "../Loaders/Command";

export default class Kick extends Command {
    constructor() {
        super({
            data: new SlashCommandBuilder()
                .setName('kick')
                .setDescription('Kick a user from the server')
                .addUserOption(option => option.setName('user').setDescription('User to be kicked'))
                .addStringOption(option => option.setName('reason').setDescription('Reason to kick the user'))
        })
    }
    public async run(bot: Bot, interaction: CommandInteraction): Promise<void> {
        const user = interaction.options.getUser('user')
        const reason = interaction.options.getString('reason')
        const perm = interaction.member?.permissions as Permissions;

        if (!perm.has('KICK_MEMBERS')) return interaction.reply({ content: 'You don\'t have permissions to use this command', ephemeral: true })

        if (!interaction.guild?.me?.permissions.has('KICK_MEMBERS')) return interaction.reply({ content: 'This bot need permission KICK_MEMBER to use this command', ephemeral: true })

        if (user === null) return
        if (reason === null) return

        await interaction.guild.members.kick(user, reason).then(async () => {
            return await interaction.reply({ content: `Kick : ${user?.username} Reason : ${reason}` })
        })
    }

}