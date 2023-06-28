import { Bot } from "../Client";
import { ICommand } from "../Types";
import { CommandInteraction, Interaction, InteractionResponse } from "discord.js";

export abstract class Command {
    public cmdOpt: ICommand;

    constructor(option: ICommand) {
        this.cmdOpt = {
            data: option.data,
        };
    }

    public abstract run(bot: Bot, interaction: CommandInteraction, ...args: any[]): Promise<InteractionResponse<boolean> | undefined>;
}
