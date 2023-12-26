import {
  AnySelectMenuInteraction,
  CacheType,
  ModalSubmitInteraction,
  SlashCommandBuilder
} from "discord.js";
import { Command, Inject, ModalId, RoleKey, SelectMenuId } from "src/common/decorators/decorators";
import { Bot } from "../client";
import { Interaction } from "../loaders/interaction";

@Inject
export default class Test2 extends Interaction {
  constructor() {
    super({
      data: new SlashCommandBuilder().setName("test2").setDescription("Test something"),
    });
  }

  @RoleKey(["test"])
  @Command("test2")
  async testCommand(bot: Bot, interaction: AnySelectMenuInteraction<CacheType>) {
    await interaction.reply({ content: `Test Command Clicked`, ephemeral: true });
  }

  @ModalId("test-modal")
  async testModal(bot: Bot, interaction: ModalSubmitInteraction<CacheType>) {
    const input = interaction.components[0].components[0].value;
    await interaction.reply({ content: `Test Modal Clicked ${input}`, ephemeral: true });
  }

  @SelectMenuId("test-select")
  async testSelect(bot: Bot, interaction: AnySelectMenuInteraction<CacheType>) {
    const input = interaction.values[0];
    await interaction.reply({ content: `Test Select ${input}`, ephemeral: true });
  }
}
