import { ButtonInteraction, CacheType, CommandInteraction } from "discord.js";
import { Bot } from "src/client";
import { RoleKey } from "src/decorators/roles";
import { Interaction } from "src/loaders/interaction";
import { Response } from "src/types/types";

export default class DeleteRoom extends Interaction {
  constructor() {
    super({
      buttonIds: ["delete-btn"],
    });
  }

  @RoleKey(["management-role", "developer-role"])
  async executeButtonInteraction(bot: Bot, interaction: ButtonInteraction<CacheType> | CommandInteraction<CacheType>, buttonId: string): Promise<Response> {
    if (buttonId === "delete-btn") {
      await interaction.channel?.delete();
    }
  }
}