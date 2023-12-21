import { Bot } from "./client";
import { TOKEN } from "./config";
import { EventHandler } from "./loaders/events/handler";

const bot = new Bot();
const event = new EventHandler(bot)

bot.login(TOKEN)
event.init()