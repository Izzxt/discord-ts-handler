import { GuildMemberRoleManager } from "discord.js";
import { Bot } from "src/client";
import { InteractionType } from "src/loaders/interaction";
import { BUTTON_METADATA, COMMAND_METADATA, INJECT_METADATA, MODAL_METADATA, SELECT_MENU_METADATA, classInjection } from "../constants/constants";

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

export function Inject(constructor: Function) {
  classInjection.set(constructor.name, constructor);
  Reflect.defineMetadata(INJECT_METADATA, constructor.name, constructor);
}

export const buttonSet = new Set<string>();
export function ButtonId(key?: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    if (buttonSet.has(key as string)) {
      throw new Error(`ButtonId ${key} already exists`);
    }
    buttonSet.add(key as string);
    Reflect.defineMetadata(BUTTON_METADATA, key, target, propertyKey);
  };
}

export const modalSet = new Set<string>();
export function ModalId(key?: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    if (modalSet.has(key as string)) {
      throw new Error(`ModalId ${key} already exists`);
    }
    modalSet.add(key as string);
    Reflect.defineMetadata(MODAL_METADATA, key, target, propertyKey);
  };
}

export const selectMenuSet = new Set<string>();
export function SelectMenuId(key?: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    if (selectMenuSet.has(key as string)) {
      throw new Error(`SelectMenuId ${key} already exists`);
    }
    selectMenuSet.add(key as string);
    Reflect.defineMetadata(SELECT_MENU_METADATA, key, target, propertyKey);
  };
}

export const commandSet = new Set<string>();
export function Command(name: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    if (commandSet.has(name)) {
      throw new Error(`Command ${name} already exists`);
    }
    commandSet.add(name);
    Reflect.defineMetadata(COMMAND_METADATA, name, target, propertyKey);
  };
}