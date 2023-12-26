import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CacheType,
  CommandInteraction,
  InteractionResponse,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  ModalSubmitInteraction,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { ButtonId, Command, Inject, ModalId } from "src/common/decorators/decorators";
import { Bot } from "../client";
import { Interaction } from "../loaders/interaction";

@Inject
export default class Test extends Interaction {
  constructor() {
    super({
      data: new SlashCommandBuilder().setName("test").setDescription("Test something"),
    });
  }

  @Command("test")
  public async executeCommandInteraction(
    bot: Bot,
    interaction: CommandInteraction,
    ...args: any[]
  ): Promise<InteractionResponse<boolean> | undefined> {
    const btn = new ButtonBuilder().setCustomId("test-btn").setLabel("Test Button").setStyle(ButtonStyle.Secondary);
    const btn1 = new ButtonBuilder().setCustomId("test-btn1").setLabel("Test Button 1").setStyle(ButtonStyle.Secondary);

    const btnRow = new ActionRowBuilder<ButtonBuilder>().addComponents(btn, btn1);

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId("test-select")
      .setPlaceholder("Select something")
      .addOptions([
        {
          label: "Test 1",
          value: "test1",
          description: "Test 1",
        },
        {
          label: "Test 2",
          value: "test2",
          description: "Test 2",
        },
      ]);
    const selectMenuRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

    return interaction.reply({ ephemeral: true, components: [btnRow, selectMenuRow] });
  }

  @ButtonId("test-btn")
  public async testBtn(bot: Bot, interaction: ButtonInteraction<CacheType>) {
    console.log("excute?");
    await interaction.reply({ content: "Test Button Clicked", ephemeral: true });
  }

  @ButtonId("test-btn1")
  public async buttonApaPunBoleh(bot: Bot, interaction: ButtonInteraction<CacheType>) {
    const modal = new ModalBuilder().setCustomId("test-modal").setTitle("Test Modal");

    const input = new TextInputBuilder()
      .setCustomId("test")
      .setLabel("Test Input")
      .setPlaceholder("Test Input")
      .setStyle(TextInputStyle.Short)

    const component1 = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(input);

    modal.addComponents(component1);

    await interaction.showModal(modal);
  }
}
