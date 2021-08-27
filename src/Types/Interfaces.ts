import { CommandHandler } from "../Loaders/CommandHandler/CommandHandler";
import { ClientEvents } from "discord.js";

export interface IClient {
    commandHandler: CommandHandler
}

export interface IEvent {
    name: keyof ClientEvents
}

export interface ICommand {
    data: {}
}