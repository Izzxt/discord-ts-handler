import { Event } from "../../loaders/event";
import { ApplicationCommandOptionType, Events, Interaction, InteractionResponse, codeBlock } from "discord.js";
import { Bot, ERROR_MESSAGE } from "../../client";
import { logger } from "src/utils/logger";

export default class InteractionCreate extends Event {
  constructor() {
    super({ name: Events.InteractionCreate });
  }

  public async execute(bot: Bot, interaction: Interaction): Promise<InteractionResponse<boolean> | undefined> {
    if (interaction.isCommand()) {
      const cmd = bot.interaction.get(interaction.commandName);

      if (!cmd) return await interaction.reply({ content: ERROR_MESSAGE, ephemeral: true });

      const args: any[] = [];

      for (let option of interaction.options.data) {
        if (option.type === ApplicationCommandOptionType.Subcommand) {
          if (option.name) args.push(option.name);
          option.options?.forEach((x) => {
            if (x.value) args.push(x.value);
          });
        } else if (option.value) args.push(option.value);
      }

      try {
        await cmd.executeCommandInteraction?.(bot, interaction, ...args);
      } catch (error) {
        if (error instanceof Error) {
          logger.error(error)
        };
      }
    }
  }
}
