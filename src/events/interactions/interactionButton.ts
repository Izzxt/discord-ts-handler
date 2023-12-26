import { Events, Interaction, InteractionResponse } from "discord.js";
import {
  BUTTON_METADATA,
  INJECT_METADATA,
  classInjection,
} from "src/common/constants/constants";
import { Response } from "src/types/types";
import { logger } from "src/utils/logger";
import { Bot } from "../../client";
import { Event } from "../../loaders/event";
import { classInjectionInstance } from "src/loaders/events/handler";
import { buttonSet } from "src/common/decorators/decorators";

export default class InteractionButton extends Event {
  constructor() {
    super({ name: Events.InteractionCreate });
  }

  public async execute(bot: Bot, interaction: Interaction): Promise<Response> {
    try {
      if (interaction.isButton()) {
        buttonSet.has(interaction.customId) &&
          (await classInjectionInstance(bot, interaction, BUTTON_METADATA));
      }
    } catch (error) {
      logger.error(error);
    }
  }
}
