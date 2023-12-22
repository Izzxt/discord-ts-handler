import { Client, Collection, GatewayIntentBits, GuildEmoji, Partials, ReactionEmoji } from "discord.js";
import { Interaction } from "./loaders/interaction";
import { InteractionHandler } from "./loaders/interactions/handler";
import { IClient, IEvent } from "./types";

export const ERROR_MESSAGE = "An error has occured, please report bot administrator";

export class Bot extends Client implements IClient {
    public interactionHandler: InteractionHandler;
    public interaction: Collection<string, Interaction>;
    public buttons: Collection<string, Interaction>;
    public menus: Collection<string, Interaction>;
    public modals: Collection<string, Interaction>;
    public reactions: Collection<string | null, Interaction>;
    public event: Collection<string, IEvent>;
    public interactions: any[] = [];

    public constructor() {
        super({
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.MessageContent],
            partials: [Partials.Message, Partials.Reaction, Partials.Channel],
        });

        this.interaction = new Collection();
        this.buttons = new Collection();
        this.menus = new Collection();
        this.modals = new Collection();
        this.reactions = new Collection();
        this.event = new Collection();

        this.interactionHandler = new InteractionHandler();
        this.interactionHandler.load(this);
    }
}
