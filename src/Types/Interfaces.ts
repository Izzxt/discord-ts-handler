import { Bot } from "src/Client";
import { CommandHandler } from "../Loaders/CommandHandler/CommandHandler";
import { ButtonInteraction, CacheType, ClientEvents, CommandInteraction, InteractionResponse, Message, SlashCommandBuilder } from "discord.js";

export interface IClient {
    commandHandler: CommandHandler;
}

export interface IEvent {
    name: keyof ClientEvents;
}

export interface ICommand {
    data: any;
    buttonIds?: string[] | undefined;
    reactions?: string[] | undefined;
}
