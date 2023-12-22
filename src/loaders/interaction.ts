import { AnySelectMenuInteraction, ButtonInteraction, CacheType, CommandInteraction, Message, ModalMessageModalSubmitInteraction, ModalSubmitInteraction } from "discord.js";
import { Response } from "src/types/types";
import { Bot } from "../client";
import { InteractionOptions } from "../types";

export interface Interaction {
    executeMessageReactionAdd?(bot: Bot, ...args: any[]): Promise<Message<boolean> | undefined>;
    executeButtonInteraction?(bot: Bot, interaction: CommandInteraction<CacheType> | ButtonInteraction<CacheType>, buttonId: string): Promise<Response>;
    executeCommandInteraction?(bot: Bot, interaction: CommandInteraction<CacheType> | ButtonInteraction<CacheType>, ...args: any[]): Promise<Response>;
    executeSelectMenuInteraction?(bot: Bot, interaction: AnySelectMenuInteraction<CacheType>, ...args: any[]): Promise<Response>;
    executeModalInteraction?(bot: Bot, interaction: ModalSubmitInteraction<CacheType> | ModalMessageModalSubmitInteraction<CacheType>, ...args: any[]): Promise<Response>;
}

export abstract class Interaction {
    public interactionOpt: InteractionOptions;

    constructor(option: InteractionOptions) {
        this.interactionOpt = {
            data: option.data,
            buttonIds: option.buttonIds,
            reactionIds: option.reactionIds,
            menuIds: option.menuIds,
            modalIds: option.modalIds,
        };
    }
}
