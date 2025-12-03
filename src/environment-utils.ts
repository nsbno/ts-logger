/** Checks whether we're developing locally */
export function isLocalhost() {
  const host = typeof window !== "undefined" ? window.location.hostname : undefined
  return host?.includes("local") || host?.includes("127.0.0.1");
}

