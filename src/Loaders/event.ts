import { IEvent } from "../Types";
import { Client } from "discord.js";

export abstract class Event {
    public _name: IEvent;

    constructor(e: IEvent) {
        this._name = { name: e.name }
    }

    public abstract run(client: Client, ...args: any[]): Promise<void>
}