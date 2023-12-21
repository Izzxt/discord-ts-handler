import chalk from "chalk";
import pino from "pino";
import pretty from "pino-pretty";

const stream = pretty({
  colorize: true,
  customPrettifiers: {
    time: (timestamp) => `🕰 ${timestamp}`,
    hostname: (hostname) => chalk.green(hostname),
    pid: (pid) => chalk.red(pid),
    caller: (caller) => chalk.cyan(caller),
  },
  minimumLevel: "debug",
});
export const logger = pino(stream);
