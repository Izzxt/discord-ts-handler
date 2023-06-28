import { Bot } from "../../Client"
import { readdirSync } from "fs";
import path from "path";

export class CommandHandler {

    public async load(bot: Bot) {
        const command = readdirSync('./src/Commands')

        command.forEach(async file => {
            const Command: any = await require(path.join(__dirname, '../../', `Commands/${file}`)).default
            const cmd = new Command()
            bot.command.set(cmd.cmdOpt.data.name, cmd)
            bot.commands.push(cmd.cmdOpt.data)
        })

        for (const file of command) {

        }
    }
}