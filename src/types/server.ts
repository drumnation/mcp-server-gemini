export interface ServerInfo {
  name: string;
  version: string;
}

export interface ServerCapabilities {
  experimental: Record<string, any>;
  prompts: {
    listChanged: boolean;
  };
  resources: {
    subscribe: boolean;
    listChanged: boolean;
  };
  tools: {
    listChanged: boolean;
  };
  logging: Record<string, any>;
}

export interface InitializeResult {
  protocolVersion: string;
  serverInfo: ServerInfo;
  capabilities: ServerCapabilities;
}

export interface ProgressParams {
  progressToken: string | number;
  progress: number;
  total?: number;
} 