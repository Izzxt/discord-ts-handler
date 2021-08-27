import dotenv from "dotenv";
dotenv.config();

export function getEnv(key: string): string {
    const value = process.env[key];

    if (!value)
        throw new Error(`Environment ${key} not found!`);

    return value;
}

export const TOKEN: string = getEnv('TOKEN')
export const PREFIX: string = getEnv('PREFIX')
export const GUILDID: string = getEnv('GUILDID')
export const CLIENTID: string = getEnv('CLIENTID')