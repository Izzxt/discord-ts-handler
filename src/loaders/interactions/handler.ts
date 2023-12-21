import { Bot } from "../../client";
import { readdirSync } from "fs";
import path from "path";
import { Interaction } from "../interaction";
import { glob } from "glob";

export class InteractionHandler {
    public async load(bot: Bot) {
        let interactions = glob.sync("./src/interactions/**/*{.ts,.js}");

        for (const file of interactions) {
            const Interaction: any = await require(file).default;
            const interaction: Interaction = new Interaction();
            bot.interaction.set(interaction.interactionOpt.data.name, interaction);

            if (interaction.interactionOpt.buttonIds !== undefined) {
                for (const buttonId of interaction.interactionOpt.buttonIds) {
                    bot.buttons.set(buttonId, interaction);
                }
            }

            if (interaction.interactionOpt.reactions !== undefined) {
                for (const reaction of interaction.interactionOpt.reactions) {
                    bot.reactions.set(reaction, interaction);
                }
            }

            bot.interactions.push(interaction.interactionOpt.data);
        }
    }
}
