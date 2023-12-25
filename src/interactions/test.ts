import { codeBlock } from "@discordjs/builders";
import {
  ActionRow,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CacheType,
  ChannelType,
  CommandInteraction,
  InteractionResponse,
  SlashCommandBuilder
} from "discord.js";
import { Bot } from "../client";
import { Interaction } from "../loaders/interaction";
import { Inject, ButtonId } from "src/events/interactions/interactionButton";

export const MY_DECORATOR_METADATA = "__my_decorator__";

@Inject
export default class Test extends Interaction {
  constructor() {
    super({
      buttonIds: ["test-btn"],
      data: new SlashCommandBuilder()
        .setName("test")
        .setDescription("Test something"),
    });
  }

  public async executeCommandInteraction(
    bot: Bot,
    interaction: CommandInteraction,
    ...args: any[]
  ): Promise<InteractionResponse<boolean> | undefined> {
    const btn = new ButtonBuilder()
      .setCustomId("test-btn")
      .setLabel("Test Button")
      .setStyle(ButtonStyle.Secondary);

    const btnRow = new ActionRowBuilder<ButtonBuilder>().addComponents(btn);
    return interaction.reply({ ephemeral: true, components: [btnRow] });
  }

  @ButtonId("test-btn")
  public async testBtn(bot: Bot, interaction: ButtonInteraction<CacheType>) {
    console.log("test-btn")
  }

  public async any() {
    console.log("any")
  }
}
