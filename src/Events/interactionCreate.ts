import { Event } from "../Loaders/event";
import { Interaction } from "discord.js";
import { Bot } from "../Client";

export default class InteractionCreate extends Event {

    constructor() {
        super({ name: 'interactionCreate' })
    }

    public async run(bot: Bot, interaction: Interaction): Promise<void> {
        if (interaction.isCommand()) {
            const cmd = bot.command.get(interaction.commandName)

            if (!cmd) return interaction.followUp({ content: 'An error has occured' }).then()

            const args: any[] = []

            for (let option of interaction.options.data) {
                if (option.type === "SUB_COMMAND") {
                    if (option.name) args.push(option.name);
                    option.options?.forEach((x) => {
                        if (x.value) args.push(x.value);
                    });
                } else if (option.value) args.push(option.value);
            }

            cmd.run(bot, interaction, ...args)
        }
    }

}