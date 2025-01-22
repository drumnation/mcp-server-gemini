export * from './completion.js';
export * from './resources.js';
export * from './prompts.js';

import { CompletionArgument, Completion } from './completion.js';
import { Resource, ResourceContent } from './resources.js';
import { Prompt } from './prompts.js';

export interface BaseProvider {
  initialize(): Promise<void>;
  shutdown(): Promise<void>;
}

export interface CompletionProvider extends BaseProvider {
  complete(argument: CompletionArgument): Promise<Completion>;
}

export interface ResourceProvider extends BaseProvider {
  listResources(type?: string): Promise<Resource[]>;
  readResource(uri: string): Promise<ResourceContent>;
}

export interface PromptProvider extends BaseProvider {
  listPrompts(): Promise<Prompt[]>;
  getPrompt(name: string): Promise<Prompt>;
}