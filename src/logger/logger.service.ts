import {Logger} from "tslog"
import {ILogger} from "./logger.interface";

export class LoggerService implements ILogger {

  public logger: Logger<unknown>

  constructor() {
    this.logger = new Logger<unknown>({})
  }

  log(...args: unknown[]) {
    this.logger.info(...args)
  }

  error(...args: unknown[]) {
    // можно отправить в sentry или rollbar
    this.logger.error(...args)
  }

  warn(...args: unknown[]) {
    this.logger.warn(...args)
  }

}
