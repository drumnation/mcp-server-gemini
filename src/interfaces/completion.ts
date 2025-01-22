import { MCPRequest, MCPResponse } from '../types/protocols.js';

export interface CompletionArgument {
  prompt: string;
  temperature?: number;
  maxTokens?: number;
  stopSequences?: string[];
}

export interface Completion {
  content: string;
  metadata: {
    model: string;
    provider: string;
    temperature?: number;
    maxTokens?: number;
    stopSequences?: string[];
  };
}

export interface CompletionRequest extends MCPRequest {
  method: 'completion/complete';
  params: {
    argument: CompletionArgument;
  };
}

export interface CompletionResult extends MCPResponse {
  result: {
    completion: Completion;
  };
}