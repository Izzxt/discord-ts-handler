import { Client, Interaction, InteractionResponse } from "discord.js";
import { glob } from "glob";
import { Bot } from "../../client";
import { classInjection } from "src/common/constants/constants";

export class EventHandler {
  public _bot: Client;

  constructor(bot: Bot) {
    this._bot = bot;
  }

  public async init() {
    const events = glob.sync("./src/events/**/*{.ts,.js}");

    for (const file of events) {
      const Event = await require(file).default;
      const ev = new Event();
      this._bot.on(ev._name.name, ev.execute.bind(null, this._bot));
    }
  }
}

export async function classInjectionInstance<T extends Interaction>(
  bot: Bot,
  interaction: T,
  metadataKey?: string
): Promise<InteractionResponse<boolean> | undefined> {
  for (const [name, Instance] of classInjection.entries()) {
    const has = classInjection.has(name);
    if (!has) continue;
    const instance = new Instance();
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
        }
      }
    }
  }
  return;
}
