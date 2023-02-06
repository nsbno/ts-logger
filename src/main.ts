import { isLocalhost, isProduction } from "./environment-utils";

type LogArgs = {
  /** The log message you want logged */
  message: string;
  /** Any serializable data, like an object or list
   *
   * Will be stringified and logged as JSON through JSON.stringify.
   */
  data?: any;
};
type InternalLogArgs = LogArgs & {
  /** The different log levels allowed */
  logLevel: "debug" | "info" | "warn" | "error";
};
type CreateLogClientArgs = {
  /** The source you want to have logged. You can think of it as the app name */
  source: string;
  /** Override the environment label */
  environment?: string;
  /** The URL you want to log to
   *
   * Defaults to what Vy uses internally.
   * If you're not using this for a Vy related service,
   * you probably want to set this.
   */
  url?: string;
};

class LogClient {
  private static instance: LogClient;
  private source: string;
  private environment?: string;
  private url: string;

  private constructor({
    source,
    environment,
    url = "/web-services/web-logger",
  }: CreateLogClientArgs) {
    this.source = source;
    this.environment = environment ?? this.getLogEnvironment();
    this.url = url;
  }

  /** Gets an instance of the logger for you to use. */
  public static getLogger(args: CreateLogClientArgs) {
    if (!LogClient.instance) {
      LogClient.instance = new LogClient(args);
    }
    return LogClient.instance;
  }
  /** Logs a debug level log message */
  public debug(logArgs: LogArgs | string) {
    this.log({
      ...this.coerceLogArgs(logArgs),
      logLevel: "debug",
    });
  }
  /** Logs an info level log message */
  public info(logArgs: LogArgs | string) {
    this.log({
      ...this.coerceLogArgs(logArgs),
      logLevel: "info",
    });
  }
  /** Logs a warning level log message */
  public warn(logArgs: LogArgs | string) {
    this.log({
      ...this.coerceLogArgs(logArgs),
      logLevel: "warn",
    });
  }
  /** Logs an error level log message */
  public error(logArgs: LogArgs | string) {
    this.log({
      ...this.coerceLogArgs(logArgs),
      logLevel: "error",
    });
  }

  /** Turns an optional string argument into a well-formed LogArgs argument */
  private coerceLogArgs(logArgs: LogArgs | string): LogArgs {
    if (typeof logArgs === "string") {
      return { message: logArgs };
    }
    return logArgs;
  }

  /** Internal logging utility for shared logic */
  private log({ message, data, logLevel }: InternalLogArgs) {
    if (isLocalhost() && !this.environment) {
      console[logLevel]("[ts-logger]: ", { message, data });
      return;
    }

    return fetch(this.url, {
      method: "POST",
      body: JSON.stringify({
        message,
        data,
        level: logLevel,
        source: this.source,
        environment: this.environment,
      }),
    });
  }
  /** Determines the log environment based on the current location */
  private getLogEnvironment() {
    if (isProduction()) {
      return "prod";
    }
    if (isLocalhost()) {
      return undefined;
    }
    return window.location.hostname.split(".")[0];
  }
}

export const getLogger = LogClient.getLogger;
