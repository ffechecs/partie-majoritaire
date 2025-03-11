import { Logestic } from "logestic";
import chalk from "chalk";
import { LogesticOptions } from "logestic";

const getDateTimeString = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

const defaultOptions: LogesticOptions = {
  showLevel: true,
};

const logger = new Logestic({
  ...defaultOptions,
})
  .use(["time", "method", "path", "duration"])
  .format({
    onSuccess({ time, method, path, duration }) {
      const dateTime = chalk.gray(getDateTimeString(time!!));
      const methodPath = chalk.cyan(`${method} ${path}`);

      const durationInMs = Number(duration) / 1000;

      return `${dateTime} ${methodPath} ${durationInMs}ms`;
    },
    onFailure({ request, datetime, error, code }) {
      console.log(error);
      console.log(code);
      const dateTime = getDateTimeString(datetime!!);
      return chalk.red(`${dateTime} ${request.method} ${request.url}`);
    },
  });

export { logger };
