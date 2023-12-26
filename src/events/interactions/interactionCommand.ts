import { ApplicationCommandOptionType, Events, Interaction, InteractionResponse } from "discord.js";
import { logger } from "src/utils/logger";
import { Bot } from "../../client";
import { Event } from "../../loaders/event";
import { COMMAND_METADATA } from "src/common/constants/constants";
import { commandSet } from "src/common/decorators/decorators";
import { classInjectionInstance } from "src/loaders/interactions/handler";
import { HandlerObject } from "src/loaders/interactions/handlerObject";

export default class InteractionCommand extends Event {
  constructor() {
    super({ name: Events.InteractionCreate });
  }

  public async execute(bot: Bot, interaction: Interaction) {
    if (!interaction.isCommand()) return;
    const args: any[] = [];
    try {
      if (commandSet.has(interaction.commandName)) {
        for (let option of interaction.options.data) {
          if (option.type === ApplicationCommandOptionType.Subcommand) {
            if (option.name) args.push(option.name);
            option.options?.forEach((x) => {
              if (x.value) args.push(x.value);
            });
          } else if (option.value) args.push(option.value);
        }
        await classInjectionInstance(bot, interaction, COMMAND_METADATA, bot._object);
      }
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error)
      };
    }
  }
}
