import { Client } from "discord.js";
import { Response } from "src/types/types";
import { IEvent } from "../types";

export abstract class Event {
    public _name: IEvent;

    constructor(e: IEvent) {
        this._name = { name: e.name }
    }

    public abstract execute(client: Client, ...args: any[]): Promise<Response>
}