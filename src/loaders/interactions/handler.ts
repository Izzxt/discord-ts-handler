import { glob } from "glob";
import { Bot } from "../../client";
import { Interaction } from "../interaction";

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

            if (interaction.interactionOpt.menuIds !== undefined) {
                for (const menuName of interaction.interactionOpt.menuIds) {
                    bot.menus.set(menuName, interaction);
                }
            }

            if (interaction.interactionOpt.reactionIds !== undefined) {
                for (const reaction of interaction.interactionOpt.reactionIds) {
                    bot.reactions.set(reaction, interaction);
                }
            }

            if (interaction.interactionOpt.modalIds !== undefined) {
                for (const reaction of interaction.interactionOpt.modalIds) {
                    bot.modals.set(reaction, interaction);
                }
            }

            bot.interactions.push(interaction.interactionOpt.data);
        }
    }
}
