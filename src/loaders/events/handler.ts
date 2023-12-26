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
