import { MCPRequest, MCPResponse } from '../types/protocols.js';

export interface Prompt {
  name: string;
  description: string;
  template: string;
  parameters?: {
    name: string;
    type: string;
    description?: string;
    required?: boolean;
  }[];
}

export interface ListPromptsRequest extends MCPRequest {
  method: 'prompts/list';
}

export interface ListPromptsResult extends MCPResponse {
  result: {
    prompts: Prompt[];
  };
}

export interface GetPromptRequest extends MCPRequest {
  method: 'prompts/get';
  params: {
    name: string;
  };
}

export interface GetPromptResult extends MCPResponse {
  result: {
    prompt: Prompt;
  };
}

export interface PromptContent {
  type: 'text' | 'image' | 'resource';
  content: string;
  metadata?: Record<string, any>;
}

export interface GetPromptResponse extends MCPResponse {
  result: {
    description?: string;
    content: PromptContent[];
  };
}