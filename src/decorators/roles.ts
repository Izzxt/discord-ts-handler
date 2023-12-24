import { CommandInteraction, Guild, GuildMemberRoleManager, PermissionsBitField } from "discord.js";
import { prisma } from "prisma/client";
import { Bot } from "src/client";
import { GUILDID } from "src/config";
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

export function RoleKey(keys: string[]) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const roleSetting = await prisma.role_settings.findMany();
      const [bot, interaction] = args as [Bot, InteractionType];
      const { member } = interaction;
      const isHas = (member?.roles as GuildMemberRoleManager).cache.some((r) =>
        roleSetting.some((role) => {
          if (role.role_id === r.id) return keys.includes(role.key);
        })
      );
      if (!isHas)
        return await interaction.reply({
          content: "You don't have permissions to use this interaction.",
          ephemeral: true,
        });
      return await original.apply(this, args);
    };
  };
}
