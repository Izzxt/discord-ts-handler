import { InteractionResponse, Message } from "discord.js";

export type Response = InteractionResponse<boolean> | Message<boolean> | undefined | void;
