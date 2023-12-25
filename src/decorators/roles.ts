import { GuildMemberRoleManager } from "discord.js";
import { Bot } from "src/client";
import { InteractionType } from "src/loaders/interaction";

export function Role(roles: string[]) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const [bot, interaction] = args as [Bot, InteractionType];
      const { guild, member } = interaction;
      for (const r of roles) {
        const role = guild?.roles.cache.get(r);
        const isHas = (member?.roles as GuildMemberRoleManager).cache.has(role?.id as string);
        if (!isHas)
          return await interaction.reply({
            content: "You don't have permissions to use this interaction.",
            ephemeral: true,
          });
      }
      return await original.apply(this, args);
    };
  };
}
