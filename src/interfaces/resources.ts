import { MCPRequest, MCPResponse } from '../types/protocols.js';

export interface Resource {
  uri: string;
  type: string;
  name: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

export interface ResourceTemplate {
  uriTemplate: string;
  name: string;
  description?: string;
  mimeType?: string;
}

export interface ResourceContent {
  content: string;
  metadata?: {
    mimeType?: string;
    encoding?: string;
    [key: string]: unknown;
  };
}

export interface ListResourcesRequest extends MCPRequest {
  method: 'resources/list';
  params: {
    type?: string;
  };
}

export interface ListResourcesResult extends MCPResponse {
  result: {
    resources: Resource[];
  };
}

export interface ReadResourceRequest extends MCPRequest {
  method: 'resources/read';
  params: {
    uri: string;
  };
}

export interface ReadResourceResult extends MCPResponse {
  result: {
    resource: Resource;
    content: ResourceContent;
  };
}