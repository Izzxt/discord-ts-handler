import {
  AnySelectMenuInteraction,
  CacheType,
  ModalSubmitInteraction
} from "discord.js";
import { Inject, ModalId, SelectMenuId } from "src/common/decorators/decorators";
import { Bot } from "../client";
import { Interaction } from "../loaders/interaction";

@Inject
export default class Test2 extends Interaction {
  constructor() {
    super({
      data: undefined,
    });
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
