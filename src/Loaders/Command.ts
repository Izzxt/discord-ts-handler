import { Bot } from "../Client";
import { ICommand } from "../Types";
import { Interaction } from "discord.js";

export abstract class Command {
    public cmdOpt: ICommand

    constructor(option: ICommand) {
        this.cmdOpt = {
            data: option.data
        }

    }

    public abstract run(bot: Bot, interaction: Interaction, ...args: any[]): Promise<void>
}