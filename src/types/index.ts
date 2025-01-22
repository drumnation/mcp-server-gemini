export * from './protocols.js';
export * from './server.js';

export interface ConnectionState {
  connectedAt: Date;
  lastMessageAt: Date;
  initialized: boolean;
  activeRequests: Set<string | number>;
  ip: string;
}

export interface MCPRequest {
  jsonrpc: '2.0';
  id: string | number;
  method: string;
  params?: any;
}

export interface MCPResponse {
  jsonrpc: '2.0';
  id: string | number;
  result?: any;
  error?: {
    code: number;
    message: string;
  };
}

export interface NotificationMessage {
  jsonrpc: '2.0';
  method: string;
  params: any;
}

export interface GenerateRequest extends MCPRequest {
  params: {
    prompt: string;
    temperature?: number;
    maxTokens?: number;
  };
}

export interface GenerateResponse extends MCPResponse {
  result: {
    type: 'completion';
    content: string;
    metadata: {
      model: string;
      provider: string;
      temperature?: number;
      maxTokens?: number;
    };
  };
}