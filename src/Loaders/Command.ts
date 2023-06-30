import { ButtonInteraction, CacheType, CommandInteraction, Interaction, InteractionResponse, Message } from "discord.js";
import { Bot } from "../Client";
import { ICommand } from "../Types";


export interface Command {
    executeMessageReactionAdd?(bot: Bot, ...args: any[]): Promise<Message<boolean> | undefined>;
}

export abstract class Command {
    public cmdOpt: ICommand;

    constructor(option: ICommand) {
        this.cmdOpt = {
            data: option.data,
            buttonIds: option.buttonIds,
            reactions: option.reactions
        };
    }

    public abstract run(bot: Bot, interaction: CommandInteraction<CacheType> | ButtonInteraction<CacheType>, ...args: any[]): Promise<InteractionResponse<boolean> | Message<boolean> | undefined>;

    public abstract executeButtonInteraction(bot: Bot, interaction: CommandInteraction<CacheType> | ButtonInteraction<CacheType>, buttonId: string): Promise<InteractionResponse<boolean> | undefined>;
}
