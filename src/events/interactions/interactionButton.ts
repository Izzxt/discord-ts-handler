import { Events, Interaction } from "discord.js";
import { Response } from "src/types/types";
import { Bot, ERROR_MESSAGE } from "../../client";
import { Event } from "../../loaders/event";
import { logger } from "src/utils/logger";

export default class InteractionButton extends Event {
  constructor() {
    super({ name: Events.InteractionCreate });
  }

  public async execute(bot: Bot, interaction: Interaction): Promise<Response> {
    if (interaction.isButton()) {
      const cmd = bot.buttons.get(interaction.customId);
      if (!cmd) return await interaction.reply({ content: ERROR_MESSAGE, ephemeral: true });

      if (cmd.interactionOpt.buttonIds === undefined) return await interaction.reply({ content: ERROR_MESSAGE, ephemeral: true });

      if (cmd.interactionOpt.buttonIds.includes(interaction.customId)) {
        try {
          await cmd.executeButtonInteraction?.(bot, interaction, interaction.customId);
        } catch (error) {
          if (error instanceof Error) logger.error(error);
        }
      }
    }
  }
}
