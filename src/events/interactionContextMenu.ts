import { Events, Interaction } from "discord.js";
import { Response } from "src/types/types";
import { Bot } from "../client";
import { Event } from "../loaders/event";

export default class InteractionContextMenu extends Event {
  constructor() {
    super({ name: Events.InteractionCreate });
  }

  public async execute(bot: Bot, interaction: Interaction): Promise<Response> {
    const interact = bot.contexts.entries();
    for (let [key, value] of interact) {
      if (interaction.isContextMenuCommand()) {
        if (key === value.interactionOpt.contextName) {
          value.executeContextMenuInteraction?.(bot, interaction);
        }
      }
      if (interaction.isUserContextMenuCommand()) {
        if (key === value.interactionOpt.contextName) {
          value.executeContextMenuInteraction?.(bot, interaction);
        }
      }
      if (interaction.isMessageContextMenuCommand()) {
        if (key === value.interactionOpt.contextName) {
          value.executeContextMenuInteraction?.(bot, interaction);
        }
      }
    }
  }
}
