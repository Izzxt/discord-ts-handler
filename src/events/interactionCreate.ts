import { Event } from "../loaders/event";
import { ApplicationCommandOptionType, Events, Interaction, InteractionResponse } from "discord.js";
import { Bot } from "../client";

export default class InteractionCreate extends Event {
  constructor() {
    super({ name: Events.InteractionCreate });
  }

  public async execute(bot: Bot, interaction: Interaction): Promise<InteractionResponse<boolean> | undefined> {
    if (interaction.isCommand()) {
      const cmd = bot.interaction.get(interaction.commandName);

      if (!cmd) return await interaction.reply({ content: "An error has occured" });

      const args: any[] = [];

      for (let option of interaction.options.data) {
        if (option.type === ApplicationCommandOptionType.Subcommand) {
          if (option.name) args.push(option.name);
          option.options?.forEach((x) => {
            if (x.value) args.push(x.value);
          });
        } else if (option.value) args.push(option.value);
      }

      cmd.executeCommandInteraction?.(bot, interaction, ...args);
    }
  }
}
