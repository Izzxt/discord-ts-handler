import { Client, Collection, GatewayIntentBits, Partials } from "discord.js";
import { Interaction } from "./loaders/interaction";
import { InteractionHandler } from "./loaders/interactions/handler";
import { IClient, IEvent, Permission } from "./types";
import { HandlerObject } from "./loaders/interactions/handlerObject";

export const ERROR_MESSAGE =
  "An error has occured, please report bot administrator";

export class Bot extends Client implements IClient {
  public _interactionHandler: InteractionHandler;
  public _interaction: Collection<string, Interaction>;
  public _buttons: Collection<string, Interaction>;
  public _menus: Collection<string, Interaction>;
  public _modals: Collection<string, Interaction>;
  public _reactions: Collection<string | null, Interaction>;
  public _event: Collection<string, IEvent>;
  public permisions: Permission[] = [];
  public interactions: any[] = [];
  public _object: HandlerObject;

  public constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
      ],
      partials: [Partials.Message, Partials.Reaction, Partials.Channel],
    });

    this._interaction = new Collection();
    this._buttons = new Collection();
    this._menus = new Collection();
    this._modals = new Collection();
    this._reactions = new Collection();
    this._event = new Collection();

    this._object = new HandlerObject();

    this._interactionHandler = new InteractionHandler();
    this._interactionHandler.load(this);
  }
}
