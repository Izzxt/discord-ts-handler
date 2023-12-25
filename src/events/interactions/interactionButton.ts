import { Events, Interaction } from "discord.js";
import { Response } from "src/types/types";
import { logger } from "src/utils/logger";
import { Bot, ERROR_MESSAGE } from "../../client";
import { Event } from "../../loaders/event";
import { MY_DECORATOR_METADATA } from "src/interactions/test";

export const classWithDecorator: any[] = [];

export function Inject(constructor: Function) {
  classWithDecorator.push(constructor);
}

export function ButtonId(key?: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(MY_DECORATOR_METADATA, key, target, propertyKey);
  };
}

export default class InteractionButton extends Event {
  constructor() {
    super({ name: Events.InteractionCreate });
  }

  public async execute(bot: Bot, interaction: Interaction): Promise<Response> {
    if (interaction.isButton()) {
      const cmd = bot.buttons.get(interaction.customId);
      if (!cmd) return await interaction.reply({ content: ERROR_MESSAGE, ephemeral: true });

      if (cmd.interactionOpt.buttonIds === undefined)
        return await interaction.reply({ content: ERROR_MESSAGE, ephemeral: true });

      if (cmd.interactionOpt.buttonIds.includes(interaction.customId)) {
        try {
          classWithDecorator.forEach((x) => {
            const instance = new x();
            const methods = Object.getOwnPropertyNames(x.prototype).filter((method) => method !== "constructor");

            methods.forEach(async (method) => {
              if (typeof instance[method] === "function") {
                const key = Reflect.getMetadata(MY_DECORATOR_METADATA, instance, method);
                if (key === interaction.customId) {
                  await instance[method](bot, interaction);
                }
              }
            });
          });
          // await cmd.executeButtonInteraction?.(bot, interaction, interaction.customId);
        } catch (error) {
          if (error instanceof Error) {
            logger.error(error);
          }
        }
      }
    }
  }
}
