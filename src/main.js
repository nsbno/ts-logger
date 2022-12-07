import { isLocalhost, isProduction } from "./environment-utils";
class LogClient {
    static instance;
    source;
    environment;
    constructor({ source, environment }) {
        this.source = source;
        this.environment = environment ?? this.getLogEnvironment();
    }
    /** Gets an instance of the logger for you to use. */
    static getLogger(args) {
        if (!LogClient.instance) {
            LogClient.instance = new LogClient(args);
        }
        return LogClient.instance;
    }
    /** Logs a debug level log message */
    debug(logArgs) {
        this.log({
            ...this.coerceLogArgs(logArgs),
            logLevel: "debug",
        });
    }
    /** Logs an info level log message */
    info(logArgs) {
        this.log({
            ...this.coerceLogArgs(logArgs),
            logLevel: "info",
        });
    }
    /** Logs a warning level log message */
    warn(logArgs) {
        this.log({
            ...this.coerceLogArgs(logArgs),
            logLevel: "warn",
        });
    }
    /** Logs an error level log message */
    error(logArgs) {
        this.log({
            ...this.coerceLogArgs(logArgs),
            logLevel: "error",
        });
    }
    /** Turns an optional string argument into a well-formed LogArgs argument */
    coerceLogArgs(logArgs) {
        if (typeof logArgs === "string") {
            return { message: logArgs };
        }
        return logArgs;
    }
    /** Internal logging utility for shared logic */
    log({ message, data, logLevel }) {
        if (isLocalhost() && !this.environment) {
            console[logLevel]("[ts-logger]: ", { message, data });
            return;
        }
        const loggerUrl = isProduction() || this.environment === "prod"
            ? "https://frontend-logger.cloud.vy.no/log"
            : "https://test.frontend-logger.cloud.vy.no/log";
        return fetch(loggerUrl, {
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
    getLogEnvironment() {
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
