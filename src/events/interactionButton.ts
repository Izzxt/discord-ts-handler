import { Events, Interaction } from "discord.js";
import { Response } from "src/types/types";
import { Bot } from "../client";
import { Event } from "../loaders/event";

export default class InteractionButton extends Event {
  constructor() {
    super({ name: Events.InteractionCreate });
  }

  public async execute(bot: Bot, interaction: Interaction): Promise<Response> {
    if (interaction.isButton()) {
      const cmd = bot.buttons.get(interaction.customId);
      if (!cmd) return await interaction.reply({ content: "An error has occured" });

      if (cmd.interactionOpt.buttonIds === undefined) return await interaction.reply({ content: "An error has occured" });

      if (cmd.interactionOpt.buttonIds.includes(interaction.customId)) {
        cmd.executeButtonInteraction?.(bot, interaction, interaction.customId);
      }
    }
  }
}
