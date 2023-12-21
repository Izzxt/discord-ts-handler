import { Client, MessageMentions, User } from "discord.js";

export default class Utils {
  static getUserFromMention(client: Client, mention: string): Promise<User>[] {
    const matches = mention.match(new RegExp(MessageMentions.UsersPattern, "g"));

    if (!matches) return [];

    const match = matches.map((match) => client.users.fetch(match.slice(2, -1)));

    return [...match];
  }
}
