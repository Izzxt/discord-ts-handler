import { GuildMember, InteractionResponse, Message, Role, ThreadMember, User } from "discord.js";

export type Response = InteractionResponse<boolean> | Message<boolean> | undefined | void;

export type RoleSelection = {
  category: string | undefined;
  role:
  | string
  | GuildMember
  | Role
  | User
  | Message<boolean>
  | ThreadMember<boolean>;
};