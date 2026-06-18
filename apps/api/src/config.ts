export type ApiConfig = {
  port: number;
};

const defaultPort = 3000;

export function readApiConfig(environment: NodeJS.ProcessEnv): ApiConfig {
  const portValue = environment.PORT;
  const port = portValue ? Number.parseInt(portValue, 10) : defaultPort;

  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535");
  }

  return { port };
}
