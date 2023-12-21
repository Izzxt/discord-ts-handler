import { ButtonInteraction, CacheType, CommandInteraction, ContextMenuCommandInteraction, InteractionResponse, Message, MessageContextMenuCommandInteraction, UserContextMenuCommandInteraction } from "discord.js";
import { Response } from "src/types/types";
import { Bot } from "../client";
import { InteractionOptions } from "../types";

export interface Interaction {
    executeMessageReactionAdd?(bot: Bot, ...args: any[]): Promise<Message<boolean> | undefined>;
    executeButtonInteraction?(bot: Bot, interaction: CommandInteraction<CacheType> | ButtonInteraction<CacheType>, buttonId: string): Promise<Response>;
    executeCommandInteraction?(bot: Bot, interaction: CommandInteraction<CacheType> | ButtonInteraction<CacheType>, ...args: any[]): Promise<Response>;
    executeContextMenuInteraction?(bot: Bot, interaction: ContextMenuCommandInteraction<CacheType> | UserContextMenuCommandInteraction<CacheType> | MessageContextMenuCommandInteraction<CacheType>, ...args: any[]): Promise<Response>;
}

export abstract class Interaction {
    public interactionOpt: InteractionOptions;

    constructor(option: InteractionOptions) {
        this.interactionOpt = {
            data: option.data,
            buttonIds: option.buttonIds,
            reactions: option.reactions,
            contextName: option.contextName,
        };
    }
}
