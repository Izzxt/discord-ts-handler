import { categories } from "@prisma/client";
import {
  APISelectMenuComponent,
  ActionRowBuilder,
  AnySelectMenuInteraction,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CacheType,
  ChannelType,
  Colors,
  CommandInteraction,
  EmbedBuilder,
  GuildMember,
  JSONEncodable,
  Message,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  ModalMessageModalSubmitInteraction,
  ModalSubmitInteraction,
  OverwriteResolvable,
  OverwriteType,
  PermissionFlagsBits,
  Role,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  TextInputBuilder,
  TextInputStyle,
  ThreadMember,
  User,
  channelMention,
  codeBlock,
  userMention,
} from "discord.js";
import { prisma } from "prisma/client";
import { Bot, ERROR_MESSAGE } from "src/client";
import { GUILDID } from "src/config";
import { RoleKey } from "src/decorators/roles";
import { Interaction } from "src/loaders/interaction";
import { Response, RoleSelection } from "src/types/types";

export default class SupportRoom extends Interaction {
  private _categorySelection: Map<string, RoleSelection> = new Map();
  private _category: Map<string, categories> = new Map();
  private _selectMenus: Array<StringSelectMenuOptionBuilder> = [];

  constructor() {
    super({
      buttonIds: ["create-btn"],
      menuIds: ["category-menu"],
      modalIds: ["ovs-support-modal"],
      data: new SlashCommandBuilder().setName("support-room").setDescription("Create support room for channel"),
    });
    this.loadCategories();
  }

  @RoleKey(["management-role", "developer-role"])
  async executeCommandInteraction(bot: Bot, interaction: CommandInteraction<CacheType>): Promise<Response> {
    this.loadCategories();
    this.loadSelectMenus();
    const embed = new EmbedBuilder()
      .setColor(Colors.White)
      .setTitle("OVS Hosting Support")
      .setDescription("Do you have any issues or inquiries? Request a room and our team will assist you shortly!")
      .setFooter({
        text: "Powered by OVS Hosting",
        iconURL: bot.user?.displayAvatarURL({ size: 1024 }),
      });

    await interaction.channel?.send({
      embeds: [embed],
      components: [this.menusActionRow(), this.createBtnActionRow()],
    });

    const sent = await interaction.reply({
      content: `Support ticket created.`,
      ephemeral: true,
    });
    setTimeout(async () => await sent.delete(), 3000);
    return;
  }

  async executeModalInteraction(
    bot: Bot,
    interaction: ModalSubmitInteraction<CacheType> | ModalMessageModalSubmitInteraction<CacheType>,
    modalId: string
  ): Promise<Response> {
    const selection = this._categorySelection.get(interaction.user.id);
    const caller = interaction.fields.getTextInputValue("caller");
    const email = interaction.fields.getTextInputValue("email");
    const serverId = interaction.fields.getTextInputValue("serverId");
    const issue = interaction.fields.getTextInputValue("issue");

    if (modalId === "ovs-support-modal") {
      await interaction.deferUpdate();
      const guild = bot.guilds.cache.get(GUILDID);

      const permissionOverwrites: OverwriteResolvable[] = [
        {
          id: bot.guilds.cache.get(GUILDID)!.roles.everyone,
          type: OverwriteType.Role,
          deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
        },
        {
          id: selection!.role,
          type: OverwriteType.Role,
          allow: [PermissionFlagsBits.ViewChannel],
        },
        {
          id: interaction.user.id,
          type: OverwriteType.Member,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
        },
      ];

      const room = await prisma.room_settings.findFirst({
        where: { key: "open-room" },
      });
      if (!room)
        return await interaction.reply({
          content: ERROR_MESSAGE,
          ephemeral: true,
        });
      const channel = await guild?.channels.create({
        type: ChannelType.GuildText,
        name: `room-${caller}`,
        parent: room?.id_,
        permissionOverwrites: [...permissionOverwrites],
      });

      await interaction.followUp({
        content: `Room created - ${channelMention(channel!.id)}`,
        ephemeral: true,
      });

      const embed = new EmbedBuilder()
        .setAuthor({
          name: "OVS Hosting Support Room",
        })
        .addFields([
          {
            name: "Caller :",
            value: codeBlock(caller),
          },
          {
            name: "Email :",
            value: codeBlock(email),
          },
          {
            name: "Server ID :",
            value: codeBlock(serverId || "Not provided"),
          },
          {
            name: "Issue :",
            value: codeBlock(issue),
          },
        ])
        .setFooter({
          text: "Powered by OVS Hosting",
          iconURL: bot.user?.displayAvatarURL({
            size: 1024,
          }),
        });

      const sent = await channel?.send({
        content: `Welcome ${userMention(
          interaction.user.id
        )} . Please state your problem here and ${selection?.category} will help you ASAP!`,
        embeds: [
          new EmbedBuilder()
            .setDescription("Support will be with you shortly. \n To close this room react with 🔒")
            .setColor("White"),
          embed,
        ],
        components: [this.closeBtnActionRow()],
      });
      await sent?.pin();

      const pinned = await sent?.channel.messages.fetch({ limit: 2 });
      await pinned?.first()?.delete();

      await interaction.message?.edit({
        components: [this.menusActionRow(), this.createBtnActionRow()],
      });

      this._categorySelection.delete(interaction.user.id);

      await prisma.rooms.create({
        data: { channel: { id: channel?.id }, user: { id: interaction.user.id } },
      });
    }

    return;
  }

  async executeButtonInteraction(
    bot: Bot,
    interaction: ButtonInteraction<CacheType>,
    buttonId: string
  ): Promise<Response> {
    if (buttonId === "create-btn") {
      const room = await prisma.rooms.findFirst({
        where: { user: { id: interaction.user.id } },
      });
      const selection = this._categorySelection.get(interaction.user.id);
      if (!selection) {
        const sent = await interaction.reply({
          content: "Please choose your category first!",
          ephemeral: true,
        });
        setTimeout(async () => await sent.delete(), 3000);
        return;
      }
      if (room) {
        const sent = await interaction.reply({
          content: `Room excedeed - ${channelMention(room?.channel.id)}`,
          ephemeral: true,
        });
        setTimeout(async () => await sent.delete(), 3000);
        return;
      }

      const modal = new ModalBuilder()
        .setCustomId("ovs-support-modal")
        .setTitle(`OVS Hosting Support (${selection?.category})`);
      const callerInput = new TextInputBuilder()
        .setCustomId("caller")
        .setLabel("What's should we call you?")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);
      const emailInput = new TextInputBuilder()
        .setCustomId("email")
        .setLabel("What's your email?")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);
      const serverIdInput = new TextInputBuilder()
        .setCustomId("serverId")
        .setLabel("What's your server id? (optional)")
        .setStyle(TextInputStyle.Short)
        .setRequired(false);
      const issueInput = new TextInputBuilder()
        .setCustomId("issue")
        .setLabel("What's your issue?")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      const callerActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(callerInput);
      const emailActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(emailInput);
      const serverIdActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(serverIdInput);
      const issueActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(issueInput);

      modal.addComponents(callerActionRow, emailActionRow, serverIdActionRow, issueActionRow);

      await interaction.showModal(modal);
    }

    return;
  }

  async executeSelectMenuInteraction(
    bot: Bot,
    interaction: AnySelectMenuInteraction<CacheType>,
    menuId: string
  ): Promise<Response> {
    if (menuId === "category-menu") {
      await interaction.deferUpdate();
      const category = interaction.values[0];

      const select = this._category.get(category);
      this._categorySelection.set(interaction.user.id, {
        category: select?.description,
        role: select!.role,
      });
    }
    return;
  }

  private closeBtnActionRow(): ActionRowBuilder<ButtonBuilder> {
    const btn = new ButtonBuilder()
      .setCustomId("close-btn")
      .setLabel("Close")
      .setEmoji("🔐")
      .setStyle(ButtonStyle.Secondary);
    return new ActionRowBuilder<ButtonBuilder>().addComponents(btn);
  }

  private menusActionRow(
    component?: APISelectMenuComponent | JSONEncodable<APISelectMenuComponent>
  ): ActionRowBuilder<StringSelectMenuBuilder> {
    const categoryMenus = new StringSelectMenuBuilder()
      .setCustomId("category-menu")
      .setPlaceholder("Choose your category!")
      .setMinValues(1)
      .setMaxValues(1)
      .addOptions(...this._selectMenus);
    return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(categoryMenus);
  }

  private createBtnActionRow(disabled: boolean = false): ActionRowBuilder<ButtonBuilder> {
    const btn = new ButtonBuilder()
      .setCustomId("create-btn")
      .setLabel("Create room")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(disabled);
    return new ActionRowBuilder<ButtonBuilder>().addComponents(btn);
  }

  private loadCategories() {
    prisma.categories.findMany().then((categories) => {
      categories.forEach((category) => {
        this._category.set(category.key, {
          description: category.description,
          name: category.name,
          role: category.role,
          key: category.key,
          id: category.id,
        });
      });
    });
  }

  private loadSelectMenus() {
    this._selectMenus = [];
    this._category.forEach((category) => {
      this._selectMenus.push(
        new StringSelectMenuOptionBuilder()
          .setLabel(category.name)
          .setValue(category.key)
          .setDescription(category.description)
      );
    });
  }
}
