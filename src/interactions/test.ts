import { codeBlock } from "@discordjs/builders";
import {
  SlashCommandBuilder,
  SlashCommandRoleOption,
  CommandInteraction,
  InteractionResponse,
  SlashCommandStringOption,
  AutocompleteInteraction,
} from "discord.js";
import { Bot } from "src/client";
import {
  Inject,
  Command,
  RoleKey,
  AutoCompleteId,
} from "src/common/decorators/decorators";
import { Interaction } from "src/loaders/interaction";

@Inject
export default class Test extends Interaction {
  constructor() {
    super({
      data: new SlashCommandBuilder()
        .setName("test")
        .setDescription("Test something")
        .addStringOption(
          new SlashCommandStringOption()
            .setName("string")
            .setDescription("String to test")
            .setAutocomplete(true)
        )
    });
  }

  @AutoCompleteId("test")
  async autoComplete(bot: Bot, interaction: AutocompleteInteraction) {
    await interaction.respond([
      {
        name: "test-1",
        value: "test",
      },
      {
        name: "test2-2",
        value: "test2",
      },
    ]);
  }

  @Command("test")
  @RoleKey(["management-role", "developer-role"])
  public async executeCommandInteraction(
    bot: Bot,
    interaction: CommandInteraction
  ): Promise<InteractionResponse<boolean> | undefined> {
    const role = interaction.options.get("role");
    const string = interaction.options.get("string");
    await interaction.reply({
      body: {
        embeds: [
          {
            title: "Test",
            fields: [
              {
                name: "Role",
                value: codeBlock(JSON.stringify(role, null, 2)) ?? "No role",
              },
              {
                name: "String",
                value:
                  codeBlock(JSON.stringify(string, null, 2)) ?? "No string",
              },
            ],
          },
        ],
      },
      ephemeral: true,
    });

    return;
  }
}
