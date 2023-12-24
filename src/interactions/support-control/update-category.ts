import { categories } from "@prisma/client";
import {
  APISelectMenuComponent,
  ActionRowBuilder,
  AnySelectMenuInteraction,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CacheType,
  JSONEncodable,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  ModalMessageModalSubmitInteraction,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { prisma } from "prisma/client";
import { Bot } from "src/client";
import { RoleKey } from "src/decorators/roles";
import { Interaction, InteractionType } from "src/loaders/interaction";
import { Response, RoleSelection } from "src/types/types";

export default class UpdateCategory extends Interaction {
  private _selection: Map<string, RoleSelection> = new Map();
  private _categories: Map<string, categories> = new Map();
  private _selectMenus: Array<StringSelectMenuOptionBuilder> = [];

  constructor() {
    super({
      buttonIds: ["update-category-create-btn", "update-category-edit-btn", "update-category-delete-btn"],
      modalIds: ["category-modal-create", "category-modal-update"],
      menuIds: ["update-category-menu"],
      data: new SlashCommandBuilder().setName("update-category").setDescription("Update ticket category."),
    });
    this.loadCategories();
  }

  @RoleKey(["management-role", "developer-role"])
  async executeCommandInteraction(bot: Bot, interaction: InteractionType, ...args: any[]) {
    await interaction.reply({
      components: [await this.menusActionRow(), this.btnActionRow()],
      ephemeral: true,
    });
    return;
  }

  async executeButtonInteraction(bot: Bot, interaction: ButtonInteraction<CacheType>, buttonId: string) {
    if (buttonId === "update-category-create-btn") {
      const modal = new ModalBuilder().setCustomId("category-modal-create");
      const keyInput = new TextInputBuilder()
        .setLabel("Specify a key for your category.")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);
      const roleInput = new TextInputBuilder()
        .setLabel("Specify a role for your category.")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);
      const nameInput = new TextInputBuilder()
        .setLabel("Specify a name for your category.")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);
      const descriptionInput = new TextInputBuilder()
        .setLabel("Specify a description for your category.")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);
      modal.setTitle("Create Category");
      keyInput.setCustomId("update-category-modal-create-key");
      roleInput.setCustomId("update-category-modal-create-role");
      nameInput.setCustomId("update-category-modal-create-name");
      descriptionInput.setCustomId("update-category-modal-create-description");
      const keyActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(keyInput);
      const roleActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(roleInput);
      const nameActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(nameInput);
      const issueActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(descriptionInput);
      modal.addComponents(keyActionRow, roleActionRow, nameActionRow, issueActionRow);
      await interaction.showModal(modal);
    }

    if (buttonId === "update-category-edit-btn") {
      const modal = new ModalBuilder().setCustomId("category-modal-update").setTitle("Update Category");
      const keyInput = new TextInputBuilder()
        .setLabel("Specify a key for your category.")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);
      const roleInput = new TextInputBuilder()
        .setLabel("Specify a role for your category.")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);
      const nameInput = new TextInputBuilder()
        .setLabel("Specify a name for your category.")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);
      const descriptionInput = new TextInputBuilder()
        .setLabel("Specify a description for your category.")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const selection = this._selection.get(interaction.user.id);
      const category = await prisma.categories.findFirst({
        where: { key: selection?.category },
      });

      if (!category)
        return await interaction.reply({
          content: "You must select a category first!",
          ephemeral: true,
        });
      keyInput.setCustomId("update-category-modal-update-key");
      keyInput.setValue(category?.key);
      roleInput.setCustomId("update-category-modal-update-role");
      roleInput.setValue(category?.role);
      nameInput.setCustomId("update-category-modal-update-name");
      nameInput.setValue(category?.name);
      descriptionInput.setCustomId("update-category-modal-update-description");
      descriptionInput.setValue(category?.description);

      const keyActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(keyInput);
      const roleActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(roleInput);
      const nameActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(nameInput);
      const issueActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(descriptionInput);
      modal.addComponents(keyActionRow, roleActionRow, nameActionRow, issueActionRow);
      await interaction.showModal(modal);
      return;
    }

    if (buttonId === "update-category-delete-btn") {
      await interaction.deferUpdate();
      const selection = this._selection.get(interaction.user.id);
      const category = await prisma.categories.findFirst({
        where: { key: selection?.category },
      });
      if (!category)
        return await interaction.reply({
          content: "Category not found!",
          ephemeral: true,
        });

      await prisma.categories.delete({
        where: { id: category.id },
      });

      this._categories.delete(category.key);
      this._selection.delete(interaction.user.id);

      this.loadSelectMenus();
      await interaction.editReply({
        content: "Category deleted!",
        components: [await this.menusActionRow(), this.btnActionRow()],
      });
    }
  }

  async executeModalInteraction(bot: Bot, interaction: ModalMessageModalSubmitInteraction<CacheType>, modalId: string) {
    if (modalId === "category-modal-create") {
      await interaction.deferUpdate();
      const key = interaction.fields.getTextInputValue("update-category-modal-create-key");
      const role = interaction.fields.getTextInputValue("update-category-modal-create-role");
      const name = interaction.fields.getTextInputValue("update-category-modal-create-name");
      const description = interaction.fields.getTextInputValue("update-category-modal-create-description");

      const category = await prisma.categories.findFirst({
        where: { key: key },
      });

      if (category) {
        return await interaction.reply({
          content: "Category already exists!",
          ephemeral: true,
        });
      }

      const created = await prisma.categories.create({
        data: { key: key, role: role, name: name, description: description },
      });
      this._categories.set(created.key, {
        key: created.key,
        role: created.role,
        name: created.name,
        description: created.description,
        id: created.id,
      });

      this._selection.delete(interaction.user.id);
      this.loadSelectMenus();
      return await interaction.editReply({
        content: "Category created!",
        components: [await this.menusActionRow(), this.btnActionRow()],
      });
    }

    if (modalId === "category-modal-update") {
      await interaction.deferUpdate();
      const key = interaction.fields.getTextInputValue("update-category-modal-update-key");
      const role = interaction.fields.getTextInputValue("update-category-modal-update-role");
      const name = interaction.fields.getTextInputValue("update-category-modal-update-name");
      const description = interaction.fields.getTextInputValue("update-category-modal-update-description");

      const category = await prisma.categories.findFirst({
        where: { key: key },
      });

      if (!category)
        return await interaction.reply({
          content: "Category not found!",
          ephemeral: true,
        });

      const updated = await prisma.categories.update({
        where: { id: category?.id },
        data: { role: role, name: name, description: description },
      });

      this._categories.set(key, {
        key: updated.key,
        role: updated.role,
        name: updated.name,
        description: updated.description,
        id: updated.id,
      });

      this._selection.delete(interaction.user.id);
      this.loadSelectMenus();
      await interaction.editReply({
        content: "Category updated!",
        components: [await this.menusActionRow(), this.btnActionRow()],
      });
      return
    }
  }

  async executeSelectMenuInteraction(
    bot: Bot,
    interaction: AnySelectMenuInteraction<CacheType>,
    menuId: string
  ): Promise<Response> {
    if (menuId === "update-category-menu") {
      await interaction.deferUpdate();
      const category = interaction.values[0];
      console.log(category)

      const selection = await prisma.categories.findFirst({
        where: { key: category },
      });
      if (!selection)
        return await interaction.reply({
          content: "Category not found!",
          ephemeral: true,
        });
      this._selection.set(interaction.user.id, { category: selection.key, role: selection.role });
    }
    return;
  }

  private btnActionRow(): ActionRowBuilder<ButtonBuilder> {
    const createBtn = new ButtonBuilder()
      .setCustomId("update-category-create-btn")
      .setLabel("Create")
      .setEmoji("🆕")
      .setStyle(ButtonStyle.Primary);
    const editBtn = new ButtonBuilder()
      .setCustomId("update-category-edit-btn")
      .setLabel("Edit")
      .setEmoji("✏️")
      .setStyle(ButtonStyle.Secondary);
    const deleteBtn = new ButtonBuilder()
      .setCustomId("update-category-delete-btn")
      .setLabel("Delete")
      .setEmoji("⛔")
      .setStyle(ButtonStyle.Danger);
    return new ActionRowBuilder<ButtonBuilder>().addComponents(createBtn, editBtn, deleteBtn);
  }

  private async menusActionRow(component?: APISelectMenuComponent | JSONEncodable<APISelectMenuComponent>) {
    await this.loadSelectMenus();
    const categoryMenus = new StringSelectMenuBuilder()
      .setCustomId("update-category-menu")
      .setPlaceholder("Choose your category!")
      .setMinValues(1)
      .setMaxValues(1)
      .addOptions(...this._selectMenus);
    return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(categoryMenus);
  }

  private loadCategories() {
    prisma.categories.findMany().then((categories) => {
      categories.forEach((category) => {
        this._categories.set(category.key, {
          description: category.description,
          name: category.name,
          role: category.role,
          key: category.key,
          id: category.id,
        });
      });
    });
  }

  private async loadSelectMenus() {
    this.unloadSelectMenus();
    const category = this._categories.entries();
    for (const [key, value] of category) {
      this._selectMenus.push(
        new StringSelectMenuOptionBuilder().setLabel(value.name).setValue(key).setDescription(value.description)
      );
    }
  }

  private unloadSelectMenus() {
    this._selectMenus = [];
  }
}
