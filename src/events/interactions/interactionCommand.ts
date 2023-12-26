import { ApplicationCommandOptionType, Events, Interaction, InteractionResponse } from "discord.js";
import { logger } from "src/utils/logger";
import { Bot } from "../../client";
import { Event } from "../../loaders/event";
import { COMMAND_METADATA } from "src/common/constants/constants";
import { classInjectionInstance } from "src/loaders/events/handler";
import { commandSet } from "src/common/decorators/decorators";

export default class InteractionCommand extends Event {
  constructor() {
    super({ name: Events.InteractionCreate });
  }

  public async execute(bot: Bot, interaction: Interaction): Promise<InteractionResponse<boolean> | undefined> {
    const args: any[] = [];
    try {
      if (interaction.isCommand()) {
        if (commandSet.has(interaction.commandName)) {
          for (let option of interaction.options.data) {
            if (option.type === ApplicationCommandOptionType.Subcommand) {
              if (option.name) args.push(option.name);
              option.options?.forEach((x) => {
                if (x.value) args.push(x.value);
              });
            } else if (option.value) args.push(option.value);
          }
          return await classInjectionInstance(bot, interaction, COMMAND_METADATA);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error)
      };
    }
  }
}
