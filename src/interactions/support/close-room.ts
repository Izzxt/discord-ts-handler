import { roleMention, userMention } from "@discordjs/builders";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CacheType,
  ChannelType,
  CommandInteraction,
  EmbedBuilder,
  Message,
  bold,
  codeBlock,
  italic,
} from "discord.js";
import { prisma } from "prisma/client";
import { Bot, ERROR_MESSAGE } from "src/client";
import { Interaction } from "src/loaders/interaction";
import { Response } from "src/types/types";
import discordTranscript from "discord-html-transcripts";
import { GUILDID } from "src/config";

export default class CloseRoom extends Interaction {
  private _sent: Map<string, Message | undefined> = new Map();

  constructor() {
    super({
      buttonIds: ["close-btn", "confirm-btn", "cancel-btn"],
    });
  }

  async executeButtonInteraction(
    bot: Bot,
    interaction: CommandInteraction<CacheType> | ButtonInteraction<CacheType>,
    buttonId: string
  ): Promise<Response> {
    const guild = bot.guilds.cache.get(GUILDID);
    const channel = interaction.channel;
    if (buttonId === "close-btn") {
      this._sent.set(
        interaction.user.id,
        await interaction.reply({
          content: "Are you sure you would like to close this room?",
          components: [this.closeBtnActionRow()],
          fetchReply: true,
        })
      );
    }

    const room = await prisma.room_settings.findFirst({
      where: { key: "close-room" },
    });
    if (buttonId === "confirm-btn") {
      await this._sent.get(interaction.user.id)?.delete();
      const channelRoom = await prisma.rooms.findFirst({
        where: { channel: { id: interaction.channelId } },
      });
      if (channel?.type === ChannelType.GuildText) {
        if (!room)
          return await interaction.reply({
            content: ERROR_MESSAGE,
            ephemeral: true,
          });
        channel?.setParent(room.id_);
        const closeEmbed = new EmbedBuilder()
          .setColor("Yellow")
          .setDescription(`Room closed by ${userMention(interaction.user.id)}`);

        const controlEmbed = new EmbedBuilder()
          .setColor(0x2f3136)
          .setDescription(codeBlock("Support team room controls") + `\nOnly ${roleMention('1188299162048020510')} can perform this actions.`)

        await channel.send({
          embeds: [closeEmbed],
        });

        await channel.send({
          embeds: [controlEmbed],
          components: [this.confirmationBtnActionRow()],
        });

        const c = guild?.channels.resolve(channelRoom!.channel.id);
        if (c?.type === ChannelType.GuildText) {
          const attachments = await discordTranscript.createTranscript(c);
          await bot.users.resolve(channelRoom!.user.id)?.send({
            content: `Your support room has been closed by ${userMention(
              interaction.user.id
            )}`,
            files: [attachments],
          });

          const resolve = bot.channels.resolve(channelRoom!.channel.id);

          if (resolve?.type === ChannelType.GuildText) {
            const attachment = await discordTranscript.createTranscript(c, {
              filename: `transcripts-closed-${resolve?.name}.html`,
              poweredBy: false,
            });

            const embed = new EmbedBuilder()
              .setColor("Yellow")
              .setDescription("Transcript Saving");

            const sent = await channel.send({ embeds: [embed] });

            await sent.edit({
              embeds: [
                EmbedBuilder.from(embed)
                  .setColor("Green")
                  .setDescription("Transcript saved"),
              ],
            });

            const target = bot.users.cache.get(channelRoom!.user.id);

            await prisma.rooms.deleteMany({
              where: { channel: { id: interaction.channelId } },
            });

            const content = `Dear ${userMention(
              target!.id
            )}, Your support ${italic(
              channel.name
            )} has been closed and marked as ${bold(
              "Solved"
            )} ✅. Your transcript is as below. \n Thank you for contacting our support team.`;

            try {
              await target?.send({
                content,
                files: [attachment],
                embeds: [
                  new EmbedBuilder()
                    .setColor("Green")
                    .setAuthor({ name: target.tag })
                    .addFields([
                      {
                        name: "Ticket Owner",
                        value: userMention(target.id),
                        inline: true,
                      },
                      {
                        name: "Ticket Name",
                        value: resolve.name,
                        inline: true,
                      },
                    ]),
                ],
              });
            } catch {
              await channel.send({
                embeds: [
                  new EmbedBuilder()
                    .setColor("Red")
                    .setDescription("Cannot send direct messages to this user"),
                ],
              });
            }
          }
        }
      }
    }

    if (buttonId === "cancel-btn") {
      await this._sent.get(interaction.user.id)?.delete();
    }

    return;
  }

  private closeBtnActionRow(): ActionRowBuilder<ButtonBuilder> {
    const confirmBtn = new ButtonBuilder()
      .setCustomId("confirm-btn")
      .setLabel("Confirm")
      .setStyle(ButtonStyle.Danger);
    const cancelBtn = new ButtonBuilder()
      .setCustomId("cancel-btn")
      .setLabel("Cancel")
      .setStyle(ButtonStyle.Secondary);
    return new ActionRowBuilder<ButtonBuilder>().addComponents(
      confirmBtn,
      cancelBtn
    );
  }

  private confirmationBtnActionRow(): ActionRowBuilder<ButtonBuilder> {
    const transcriptBtn = new ButtonBuilder()
      .setCustomId("transcript-btn")
      .setLabel("Save Transcript")
      .setEmoji("📜")
      .setStyle(ButtonStyle.Secondary);
    const openBtn = new ButtonBuilder()
      .setCustomId("open-btn")
      .setLabel("Open")
      .setEmoji("🔓")
      .setStyle(ButtonStyle.Secondary);
    const deleteBtn = new ButtonBuilder()
      .setCustomId("delete-btn")
      .setLabel("Delete")
      .setEmoji("⛔")
      .setStyle(ButtonStyle.Danger);
    return new ActionRowBuilder<ButtonBuilder>().addComponents(
      transcriptBtn,
      openBtn,
      deleteBtn
    );
  }
}
