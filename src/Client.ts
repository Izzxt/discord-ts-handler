import { Client, Collection, GatewayIntentBits } from "discord.js";
import { Command } from "./Loaders/Command";
import { CommandHandler } from "./Loaders/CommandHandler/CommandHandler";
import { IClient, IEvent } from "./Types";

export class Bot extends Client implements IClient {
    public commandHandler: CommandHandler
    public command: Collection<string, Command>
    public event: Collection<string, IEvent>
    public commands: any[] = []

    public constructor() {
        super({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

        this.command = new Collection()
        this.event = new Collection()

        this.commandHandler = new CommandHandler();
        this.commandHandler.load(this)
    }


}