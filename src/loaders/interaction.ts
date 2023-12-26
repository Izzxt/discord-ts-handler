import {
  AnySelectMenuInteraction,
  ButtonInteraction,
  CacheType,
  CommandInteraction,
  Message,
  ModalMessageModalSubmitInteraction,
  ModalSubmitInteraction,
} from "discord.js";
import { InteractionOptions } from "../types";
import { Bot } from "src/client";

export type InteractionType = CommandInteraction<CacheType> | ButtonInteraction<CacheType> | AnySelectMenuInteraction<CacheType> | ModalSubmitInteraction<CacheType> | ModalMessageModalSubmitInteraction<CacheType>;

export interface Interaction {
  executeMessageReactionAdd?(bot: Bot, ...args: any[]): Promise<Message<boolean> | undefined>;
}

export abstract class Interaction {
  public interactionOpt: InteractionOptions;

  constructor(option?: InteractionOptions) {
    this.interactionOpt = {
      data: option?.data,
      buttonIds: option?.buttonIds,
      reactionIds: option?.reactionIds,
      menuIds: option?.menuIds,
      modalIds: option?.modalIds,
      permissions: option?.permissions,
    };
  }
}
