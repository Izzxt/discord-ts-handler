import { ClientEvents } from "discord.js";
import { InteractionHandler } from "../loaders/interactions/handler";

export interface IClient {
    interactionHandler: InteractionHandler;
}

export interface IEvent {
    name: keyof ClientEvents;
}

export interface InteractionOptions {
    data: any;
    buttonIds?: string[] | undefined;
    reactions?: string[] | undefined;
    contextName?: string;
}
