import { SlashCommandBuilder } from "@discordjs/builders";
import {
    ActionRowBuilder,
    AnyComponentBuilder,
    AnySelectMenuInteraction,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    CacheType,
    CommandInteraction,
    InteractionResponse,
    ModalActionRowComponentBuilder,
    ModalBuilder,
    ModalSubmitInteraction,
    PermissionsBitField,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    TextInputBuilder,
    TextInputStyle,
} from "discord.js";
import { Bot } from "src/client";
import { Response } from "src/types/types";
import { Interaction } from "../loaders/interaction";

export default class Ping extends Interaction {
    constructor() {
        super({
            buttonIds: ["ping-btn", "pong-btn", "modal-btn"],
            menuIds: ["ping-menu", "ping-menu2"],
            modalIds: ["myModal"],
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
        const mbtn = new ButtonBuilder().setCustomId("modal-btn").setLabel("Modal").setStyle(ButtonStyle.Secondary);

        const select = new StringSelectMenuBuilder()
            .setCustomId("ping-menu")
            .setPlaceholder("Make a selection!")
            .addOptions(
                new StringSelectMenuOptionBuilder().setLabel("Bulbasaur").setDescription("The dual-type Grass/Poison Seed Pokémon.").setValue("bulbasaur"),
                new StringSelectMenuOptionBuilder().setLabel("Charmander").setDescription("The Fire-type Lizard Pokémon.").setValue("charmander"),
                new StringSelectMenuOptionBuilder().setLabel("Squirtle").setDescription("The Water-type Tiny Turtle Pokémon.").setValue("squirtle")
            );
        const select2 = new StringSelectMenuBuilder()
            .setCustomId("ping-menu2")
            .setPlaceholder("Make a selection!!!!!")
            .addOptions(
                new StringSelectMenuOptionBuilder().setLabel("Bulbasaur").setDescription("The dual-type Grass/Poison Seed Pokémon.").setValue("bulbasaur"),
                new StringSelectMenuOptionBuilder().setLabel("Charmander").setDescription("The Fire-type Lizard Pokémon.").setValue("charmander"),
                new StringSelectMenuOptionBuilder().setLabel("Squirtle").setDescription("The Water-type Tiny Turtle Pokémon.").setValue("squirtle")
            );

        const menus = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select);
        const menus2 = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select2);
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(btn, pbtn, mbtn);

        await interaction.reply({ ephemeral: false, components: [menus, menus2, row] });
    }

    public async executeButtonInteraction(bot: Bot, interaction: ButtonInteraction<CacheType>, buttonId: string): Promise<Response> {
        if (buttonId === "ping-btn") {
            await interaction.deferUpdate();
            await interaction.followUp({ content: `Pong! ${bot.ws.ping}, ExecuteButtonInteraction`, ephemeral: true });
        }

        if (buttonId === "pong-btn") {
            await interaction.deferUpdate();
            await interaction.followUp({ content: `Ping! ${bot.ws.ping}, ExecuteButtonInteraction`, ephemeral: true });
        }

        if (buttonId === "modal-btn") {
            const modal = new ModalBuilder().setCustomId("myModal").setTitle("My Modal");

            const favoriteColorInput = new TextInputBuilder().setCustomId("favoriteColorInput").setLabel("What's your favorite color?").setStyle(TextInputStyle.Short);

            const hobbiesInput = new TextInputBuilder().setCustomId("hobbiesInput").setLabel("What's some of your favorite hobbies?").setStyle(TextInputStyle.Paragraph);

            const firstActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(favoriteColorInput);
            const secondActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(hobbiesInput);

            modal.addComponents(firstActionRow, secondActionRow);

            await interaction.showModal(modal);
        }

        return;
    }

    public async executeSelectMenuInteraction(bot: Bot, interaction: AnySelectMenuInteraction<CacheType>, menuId: string): Promise<Response> {
        await interaction.deferUpdate();
        if (menuId === "ping-menu") {
            await interaction.followUp({ content: `Ping! ${bot.ws.ping}, ExecuteSelectMenuInteraction`, ephemeral: true });
        }

        if (menuId === "ping-menu2") {
            if (interaction.values[0] === "bulbasaur") {
                await interaction.followUp({ content: `Bulbasaur, ExecuteSelectMenuInteraction`, ephemeral: true });
            }
        }
        return;
    }

    public async executeModalInteraction(bot: Bot, interaction: ModalSubmitInteraction<CacheType>, ...args: any[]): Promise<Response> {
        await interaction.deferUpdate();
        const favoriteColor = interaction.fields.getField("favoriteColorInput").value;
        const hobbies = interaction.fields.getField("hobbiesInput").value;

        await interaction.followUp({ content: `Your favorite color is ${favoriteColor} and your hobbies are ${hobbies}, ExecuteModalInteraction`, ephemeral: true });
        return;
    }
}
