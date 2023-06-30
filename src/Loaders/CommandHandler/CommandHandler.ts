import { Bot } from "../../Client";
import { readdirSync } from "fs";
import path from "path";
import { Command } from "../Command";

export class CommandHandler {
    public async load(bot: Bot) {
        const command = readdirSync("./src/Commands");

        for (const file of command) {
            const Command: any = await require(path.join(__dirname, "../../", `Commands/${file}`)).default;
            const cmd: Command = new Command();
            bot.command.set(cmd.cmdOpt.data.name, cmd);

            if (cmd.cmdOpt.buttonIds !== undefined) {
                for (const buttonId of cmd.cmdOpt.buttonIds) {
                    bot.buttons.set(buttonId, cmd);
                }
            }

            if (cmd.cmdOpt.reactions !== undefined) {
                for (const reaction of cmd.cmdOpt.reactions) {
                    bot.reactions.set(reaction, cmd);
                }
            }

            bot.commands.push(cmd.cmdOpt.data);
        }
    }
}
