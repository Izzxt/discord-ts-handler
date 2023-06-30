import { Client, Collection, GatewayIntentBits, GuildEmoji, Partials, ReactionEmoji } from "discord.js";
import { Command } from "./Loaders/Command";
import { CommandHandler } from "./Loaders/CommandHandler/CommandHandler";
import { IClient, IEvent } from "./Types";

export class Bot extends Client implements IClient {
    public commandHandler: CommandHandler;
    public command: Collection<string, Command>;
    public buttons: Collection<string, Command>;
    public reactions: Collection<string | null, Command>;
    public event: Collection<string, IEvent>;
    public commands: any[] = [];

    public constructor() {
        super({
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.MessageContent],
            partials: [Partials.Message, Partials.Reaction, Partials.Channel],
        });

        this.command = new Collection();
        this.buttons = new Collection();
        this.reactions = new Collection();
        this.event = new Collection();

        this.commandHandler = new CommandHandler();
        this.commandHandler.load(this);
    }
}
