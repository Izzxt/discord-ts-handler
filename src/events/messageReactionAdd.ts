import { Client, Events, Interaction, InteractionResponse, MessageReaction, User, messageLink } from "discord.js";
import { Event } from "../loaders/event";
import { Bot } from "src/client";
import { logger } from "../utils/logger";
import { Response } from "src/types/types";

export default class MessageReactionAdd extends Event {
  constructor() {
    super({ name: Events.MessageReactionAdd });
  }

  public async execute(bot: Bot, reaction: MessageReaction, user: User): Promise<Response> {
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

    if (emoji.interactionOpt.reactions === null || emoji.interactionOpt.reactions === undefined) return;

    if (emoji.interactionOpt.reactions.includes(reaction.emoji.name ?? "") || (reaction.emoji.id ?? "")) {
      emoji.executeMessageReactionAdd?.(bot, reaction, user);
    }
  }
}
