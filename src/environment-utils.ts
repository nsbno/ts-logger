/** Checks whether or not we're developing locally */
export function isLocalhost() {
  const host = window.location.hostname;
  return host?.includes("local") || host?.includes("127.0.0.1");
}

/** Checks whether or not we're in a test environment */
export function isTest() {
  var host = window.location.hostname;
  return !!host && host.indexOf("test") >= 0;
}

/** Checks whether or not we're in a stage environment */
export function isStage() {
  var host = window.location.hostname;
  return !!host && (host.indexOf("test4") >= 0 || host.indexOf("stage") >= 0);
}

/** Checks whether or not we're in a production environment */
export function isProduction() {
  return !isLocalhost() && !isTest() && !isStage();
}
