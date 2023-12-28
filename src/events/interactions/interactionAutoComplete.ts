import { ApplicationCommandOptionType, Events, Interaction } from "discord.js";
import { Bot } from "src/client";
import { Response } from "src/types/types";
import { Event } from "../../loaders/event";
import { AUTO_COMPLETE_METADATA, COMMAND_METADATA } from "src/common/constants/constants";
import { commandSet } from "src/common/decorators/decorators";
import { classInjectionInstance } from "src/loaders/interactions/handler";
import { logger } from "src/utils/logger";

export default class InteractionAutoComplete extends Event {
  constructor() {
    super({ name: Events.InteractionCreate });
  }

  public async execute(bot: Bot, interaction: Interaction): Promise<Response> {
    if (!interaction.isAutocomplete()) return;
    try {
      if (commandSet.has(interaction.commandName)) {
        await classInjectionInstance(bot, interaction, AUTO_COMPLETE_METADATA, bot._object);
      }

    } catch (error) {
      logger.error(error);
    }
  }
}