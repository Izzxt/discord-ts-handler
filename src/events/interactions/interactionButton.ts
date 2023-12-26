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
import { buttonSet } from "src/common/decorators/decorators";
import { classInjectionInstance } from "src/loaders/interactions/handler";

export default class InteractionButton extends Event {
  constructor() {
    super({ name: Events.InteractionCreate });
  }

  public async execute(bot: Bot, interaction: Interaction): Promise<Response> {
    if (!interaction.isButton()) return;
    try {
      buttonSet.has(interaction.customId) &&
        (await classInjectionInstance(bot, interaction, BUTTON_METADATA, bot._object));
    } catch (error) {
      logger.error(error);
    }
  }
}
