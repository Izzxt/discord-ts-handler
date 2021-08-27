import { Bot } from "./Client";
import { TOKEN } from "./Config";
import { EventHandler } from "./Loaders/EventHandlers/EventHandler";

const bot = new Bot();
const event = new EventHandler(bot)

bot.login(TOKEN)
event.init()