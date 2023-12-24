import {
  CommandInteraction,
  InteractionResponse,
  SlashCommandBuilder
} from "discord.js";
import { Bot } from "../client";
import { Interaction } from "../loaders/interaction";
import { codeBlock } from "@discordjs/builders";

export default class Test extends Interaction {
  constructor() {
    super({
      data: new SlashCommandBuilder()
        .setName("test")
        .setDescription("Test something"),
    });
  }

  public async executeCommandInteraction(
    bot: Bot,
    interaction: CommandInteraction,
    ...args: any[]
  ): Promise<InteractionResponse<boolean> | undefined> {
    let symbol = Symbol("Role")
    return interaction.reply({ content: codeBlock("json", `${JSON.stringify(symbol, null, 2)}`), ephemeral: true });
  }
}
