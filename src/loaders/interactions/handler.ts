import { glob } from "glob";
import { Bot } from "../../client";
import { Interaction } from "../interaction";
import { classInjection } from "src/common/constants/constants";
import {
  InteractionResponse,
  Interaction as DiscordInteraction,
} from "discord.js";
import { HandlerObject } from "./handlerObject";

export class InteractionHandler {
  public async load(bot: Bot) {
    let interactions = glob.sync("./src/interactions/**/*{.ts,.js}");

    for (const file of interactions) {
      const Interaction: any = await require(file).default;
      const interaction: Interaction = new Interaction();

      const inject = classInjection.get(interaction.constructor.name);
      if (inject === undefined) continue;

      if (interaction.interactionOpt.reactionIds !== undefined) {
        for (const reaction of interaction.interactionOpt.reactionIds) {
          bot._reactions.set(reaction, interaction);
        }
      }

      if (interaction.interactionOpt.data === undefined) continue;
      bot._interaction.set(interaction.interactionOpt.data.name, interaction);
      bot.interactions.push(interaction.interactionOpt.data);
    }
  }
}

export async function classInjectionInstance<T extends DiscordInteraction>(
  bot: Bot,
  interaction: T,
  metadataKey?: string,
  handlerObject?: HandlerObject
): Promise<InteractionResponse<boolean> | undefined> {
  for (const [name, Instance] of classInjection.entries()) {
    const has = classInjection.has(name);
    if (!has) continue;
    const instance = new Instance(handlerObject);
    const methods = Object.getOwnPropertyNames(Instance.prototype).filter(
      (method) => method !== "constructor"
    );

    for (const method of methods) {
      const key = Reflect.getMetadata(metadataKey, instance, method);
      if (typeof instance[method] === "function") {
        if ("customId" in interaction && key === interaction.customId) {
          await instance[method](bot, interaction);
        }
        if (interaction.isCommand() && key === interaction.commandName) {
          await instance[method](bot, interaction);
        } else if (interaction.isAutocomplete() && key === interaction.commandName) {
          await instance[method](bot, interaction);
        }
      }
    }
  }
  return;
}
