import { Events, Interaction } from "discord.js";
import { SELECT_MENU_METADATA } from "src/common/constants/constants";
import { Response } from "src/types/types";
import { logger } from "src/utils/logger";
import { Bot } from "../../client";
import { Event } from "../../loaders/event";
import { classInjectionInstance } from "src/loaders/events/handler";

export default class InteractionSelectMenu extends Event {
  constructor() {
    super({ name: Events.InteractionCreate });
  }

  public async execute(bot: Bot, interaction: Interaction): Promise<Response> {
    try {
      if (interaction.isAnySelectMenu())
        await classInjectionInstance(bot, interaction, SELECT_MENU_METADATA);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error)
      };
    }
  }
}
