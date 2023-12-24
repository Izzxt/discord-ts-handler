import { ButtonInteraction, CacheType, ChannelType, CommandInteraction, EmbedBuilder, userMention } from "discord.js";
import { prisma } from "prisma/client";
import { Bot, ERROR_MESSAGE } from "src/client";
import { RoleKey } from "src/decorators/roles";
import { Interaction } from "src/loaders/interaction";
import { Response } from "src/types/types";

export default class ReopenRoom extends Interaction {
  constructor() {
    super({
      buttonIds: ["open-btn"],
    });
  }

  @RoleKey(["management-role", "developer-role"])
  async executeButtonInteraction(bot: Bot, interaction: ButtonInteraction<CacheType> | CommandInteraction<CacheType>, buttonId: string): Promise<Response> {
    const channel = interaction.channel;
    if (buttonId === "open-btn") {
      if (channel?.type === ChannelType.GuildText) {
        const reopenEmbed = new EmbedBuilder()
          .setColor('Yellow')
          .setDescription(`Room reopened by ${userMention(interaction.user.id)}`);

        const m = await interaction.channel?.messages.fetch({ limit: 2 })
        await m?.last()?.edit({ embeds: [reopenEmbed] });

        await m?.first()?.delete();

        const room = await prisma.room_settings.findFirst({ where: { key: "open-room" } });
        if (!room) return await interaction.reply({ content: ERROR_MESSAGE, ephemeral: true });
        await channel?.setParent(room.id_);

        await prisma.rooms.create({
          data: { channel: { id: channel?.id }, user: { id: interaction.user.id } },
        })
      }
    }
  }
}