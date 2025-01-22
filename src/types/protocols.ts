export interface MCPMessage {
  jsonrpc: '2.0';
  id: string | number;
  method?: string;
  params?: any;
  result?: any;
  error?: MCPError;
}

export interface MCPRequest extends MCPMessage {
  method: string;
  params: any;
}

export interface MCPResponse extends MCPMessage {
  result?: any;
  error?: MCPError;
}

export interface MCPError {
  code: number;
  message: string;
  data?: any;
}

export interface GenerateRequest extends MCPRequest {
  params: {
    prompt: string;
    temperature?: number;
    maxTokens?: number;
    stopSequences?: string[];
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
      stopSequences?: string[];
    };
  };
}

export interface StreamRequest extends MCPRequest {
  params: {
    prompt: string;
    temperature?: number;
    maxTokens?: number;
    stopSequences?: string[];
    streamEvents?: boolean;
  };
}

export interface StreamResponse extends MCPResponse {
  result: {
    type: 'stream';
    content: string;
    done: boolean;
    metadata?: {
      timestamp: number;
      model: string;
      tokens?: number;
    };
  };
}

export interface CancelRequest extends MCPRequest {
  params: {
    requestId: string | number;
  };
}

export interface ConfigureRequest extends MCPRequest {
  params: {
    configuration: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
      stopSequences?: string[];
      timeout?: number;
    };
  };
}

export interface NotificationMessage {
  jsonrpc: '2.0';
  method: string;
  params: any;
}

export interface ErrorNotification extends NotificationMessage {
  method: 'notifications/error';
  params: {
    code: number;
    message: string;
    data?: any;
  };
}