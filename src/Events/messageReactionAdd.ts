import { Client, Events, Interaction, MessageReaction, User, messageLink } from "discord.js";
import { Event } from "../Loaders/event";
import { Bot } from "src/Client";
import { logger } from "../Utils/logger";

export default class MessageReactionAdd extends Event {
  constructor() {
    super({ name: Events.MessageReactionAdd });
  }

  public async run(bot: Bot, reaction: MessageReaction, user: User): Promise<void> {
    if (user.bot) return;

    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (error) {
        logger.error("Something went wrong when fetching the message:", error);
        return;
      }
    }

    const emoji = bot.reactions.get(reaction.emoji.id || reaction.emoji.name);

    if (!emoji) return;

    if (emoji.cmdOpt.reactions === null || emoji.cmdOpt.reactions === undefined) return;

    if (emoji.cmdOpt.reactions.includes(reaction.emoji.name ?? "") || (reaction.emoji.id ?? "")) {
      emoji.executeMessageReactionAdd?.(bot, reaction, user);
    }
  }
}
