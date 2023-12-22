import { ClientEvents, SlashCommandAttachmentOption, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, SlashCommandStringOption, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";
import { InteractionHandler } from "../loaders/interactions/handler";

export interface IClient {
    interactionHandler: InteractionHandler;
}

export interface IEvent {
    name: keyof ClientEvents;
}

export interface InteractionOptions {
    data?: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | SlashCommandSubcommandGroupBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> | undefined;
    buttonIds?: string[] | undefined;
    reactionIds?: string[] | undefined;
    menuIds?: string[] | undefined;
    modalIds?: string[] | undefined;
}
