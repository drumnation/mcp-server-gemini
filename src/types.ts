import { MCPRequest, MCPResponse } from './types/protocols.js';

// Existing interfaces...

export interface ProgressParams {
  progressToken: string | number;
  progress: number;
  total?: number;
}

export interface NotificationMessage {
  jsonrpc: '2.0';
  method: string;
  params?: any;
}

export interface ErrorNotification extends NotificationMessage {
  method: 'notifications/error';
  params: {
    code: number;
    message: string;
    data?: any;
  };
}

export interface ProgressNotification extends NotificationMessage {
  method: 'notifications/progress';
  params: ProgressParams;
}

export interface ShutdownRequest extends MCPRequest {
  method: 'shutdown';
}

export interface ExitNotification {
  method: 'exit';
}
