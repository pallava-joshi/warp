declare module "@opencode-ai/sdk" {
  export interface OpencodeClientConfig {
    baseUrl?: string;
    headers?: Record<string, string>;
  }

  export interface OpencodeClient {
    session: {
      create: (options: { body?: object }) => Promise<unknown>;
      prompt: (options: {
        path: { id: string };
        body: { parts: Array<{ type: string; text: string }> };
      }) => Promise<unknown>;
      messages: (options: { path: { id: string } }) => Promise<unknown>;
    };
    global: { health: () => Promise<unknown> };
  }

  export function createOpencodeClient(config?: OpencodeClientConfig): OpencodeClient;
}
