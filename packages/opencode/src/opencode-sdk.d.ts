declare module "@opencode-ai/sdk" {
  export interface OpencodeClientConfig {
    baseUrl?: string;
    headers?: Record<string, string>;
  }

  export interface OpencodeClient {
    session: {
      create: (options: { body: object }) => Promise<{ id: string }>;
      prompt: (options: {
        sessionID: string;
        body: { parts: Array<{ type: string; text: string }> };
      }) => Promise<void>;
      messages: (options: { sessionID: string }) => Promise<{ messages: unknown[] }>;
    };
  }

  export function createOpencodeClient(config?: OpencodeClientConfig): OpencodeClient;
}
