import { Events, Interaction } from "discord.js";
import { MODAL_METADATA } from "src/common/constants/constants";
import { Response } from "src/types/types";
import { logger } from "src/utils/logger";
import { Bot } from "../../client";
import { Event } from "../../loaders/event";
import { classInjectionInstance } from "src/loaders/events/handler";
import { modalSet } from "src/common/decorators/decorators";

export default class InteractionModal extends Event {
  constructor() {
    super({ name: Events.InteractionCreate });
  }

  public async execute(bot: Bot, interaction: Interaction): Promise<Response> {
    try {
      if (interaction.isModalSubmit())
        modalSet.has(interaction.customId) &&
          await classInjectionInstance(bot, interaction, MODAL_METADATA);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error)
      };
    }
  }
}
