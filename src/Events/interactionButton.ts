import { Client, Interaction } from "discord.js";
import { Bot } from "../Client";
import { Event } from "../Loaders/event";

export default class InteractionButton extends Event {
  constructor() {
    super({ name: "interactionCreate" });
  }

  public async run(bot: Bot, interaction: Interaction): Promise<void> {
    if (interaction.isButton()) {
      const cmd = bot.buttons.get(interaction.customId);
      if (!cmd) return interaction.followUp({ content: "An error has occured" }).then();

      if (cmd.cmdOpt.buttonIds === undefined) return interaction.followUp({ content: "An error has occured" }).then();

      if (cmd.cmdOpt.buttonIds.includes(interaction.customId)) {
        cmd.executeButtonInteraction(bot, interaction, interaction.customId);
      }
    }
  }
}
