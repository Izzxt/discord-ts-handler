import { glob } from "glob";
import { Bot } from "../../client";
import { Interaction } from "../interaction";
import { classInjection } from "src/common/constants/constants";

export class InteractionHandler {
  public async load(bot: Bot) {
    let interactions = glob.sync("./src/interactions/**/*{.ts,.js}");

    for (const file of interactions) {
      const Interaction: any = await require(file).default;
      const interaction: Interaction = new Interaction();

      const inject = classInjection.get(interaction.constructor.name);
      if (inject === undefined) continue;

      if (interaction.interactionOpt.reactionIds !== undefined) {
        for (const reaction of interaction.interactionOpt.reactionIds) {
          bot.reactions.set(reaction, interaction);
        }
      }

      if (interaction.interactionOpt.data === undefined) continue;
      bot.interaction.set(interaction.interactionOpt.data.name, interaction);
      bot.interactions.push(interaction.interactionOpt.data);
    }
  }
}
