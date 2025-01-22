import { GenerativeModel, GenerateContentResult } from '@google/generative-ai';
import { 
  GenerateRequest, 
  GenerateResponse, 
  MCPRequest, 
  MCPResponse,
  StreamRequest,
  StreamResponse,
  CancelRequest,
  ConfigureRequest,
  MCPError
} from './types/protocols.js';
import { createInitializeResult, ERROR_CODES, validateRequest, ProtocolManager } from './protocol.js';
import EventEmitter from 'events';

export class MCPHandlers extends EventEmitter {
  private activeRequests: Map<string | number, AbortController>;

  constructor(
    private model: GenerativeModel, 
    private protocol: ProtocolManager,
    private debug: boolean = false
  ) {
    super();
    this.activeRequests = new Map();
  }

  private log(...args: unknown[]): void {
    if (this.debug) {
      console.log('[MCP Debug]', ...args);
    }
  }

  async handleInitialize(request: MCPRequest): Promise<MCPResponse> {
    this.log('Initializing with params:', request.params);
    return {
      jsonrpc: '2.0',
      id: request.id,
      result: createInitializeResult()
    };
  }

  async handleGenerate(request: GenerateRequest): Promise<GenerateResponse> {
    this.log('Handling generate request:', request.params);
    
    if (!validateRequest(request)) {
      throw this.createError(ERROR_CODES.INVALID_PARAMS, 'Invalid or missing parameters');
    }

    const abortController = new AbortController();
    this.activeRequests.set(request.id, abortController);

    try {
      const result = await this.model.generateContent(request.params.prompt);
      const response = await result.response;
      this.activeRequests.delete(request.id);

      return {
        jsonrpc: '2.0',
        id: request.id,
        result: {
          type: 'completion',
          content: response.text(),
          metadata: {
            model: 'gemini-pro',
            provider: 'google',
            temperature: request.params.temperature,
            maxTokens: request.params.maxTokens,
            stopSequences: request.params.stopSequences,
          }
        }
      };
    } catch (error) {
      this.log('Generation error:', error);
      this.activeRequests.delete(request.id);
      throw error;
    }
  }

  async handleStream(request: StreamRequest): Promise<void> {
    this.log('Handling stream request:', request.params);
    
    if (!validateRequest(request)) {
      throw this.createError(ERROR_CODES.INVALID_PARAMS, 'Invalid or missing parameters');
    }

    const abortController = new AbortController();
    this.activeRequests.set(request.id, abortController);

    try {
      const result = await this.model.generateContentStream(request.params.prompt);

      // Handle the stream chunks
      for await (const chunk of result.stream) {
        const response: StreamResponse = {
          jsonrpc: '2.0',
          id: request.id,
          result: {
            type: 'stream',
            content: chunk.text(),
            done: false,
            metadata: {
              timestamp: Date.now(),
              model: 'gemini-pro'
            }
          }
        };
        this.emit('response', response);
      }

      // Send final chunk
      const finalResponse: StreamResponse = {
        jsonrpc: '2.0',
        id: request.id,
        result: {
          type: 'stream',
          content: '',
          done: true,
          metadata: {
            timestamp: Date.now(),
            model: 'gemini-pro'
          }
        }
      };
      this.emit('response', finalResponse);

    } catch (error) {
      this.log('Stream error:', error);
      throw error;
    } finally {
      this.activeRequests.delete(request.id);
    }
  }

  async handleCancel(request: CancelRequest): Promise<MCPResponse> {
    this.log('Handling cancel request:', request.params);
    
    if (!validateRequest(request, ['requestId'])) {
      throw this.createError(ERROR_CODES.INVALID_PARAMS, 'Missing requestId parameter');
    }

    const requestId = request.params.requestId;
    const abortController = this.activeRequests.get(requestId);

    if (abortController) {
      abortController.abort();
      this.activeRequests.delete(requestId);
      return {
        jsonrpc: '2.0',
        id: request.id,
        result: { cancelled: true }
      };
    }

    throw this.createError(ERROR_CODES.INVALID_REQUEST, 'Request not found or already completed');
  }

  async handleConfigure(request: ConfigureRequest): Promise<MCPResponse> {
    this.log('Handling configure request:', request.params);
    
    if (!validateRequest(request, ['configuration'])) {
      throw this.createError(ERROR_CODES.INVALID_PARAMS, 'Missing configuration parameter');
    }

    // Update configuration
    const config = request.params.configuration;
    
    return {
      jsonrpc: '2.0',
      id: request.id,
      result: { configured: true }
    };
  }

  async handleRequest(request: MCPRequest): Promise<MCPResponse> {
    this.log('Handling request:', request.method);

    try {
      switch (request.method) {
        case 'initialize':
          return await this.handleInitialize(request);

        case 'generate':
          return await this.handleGenerate(request as GenerateRequest);

        case 'stream':
          await this.handleStream(request as StreamRequest);
          return { jsonrpc: '2.0', id: request.id, result: { started: true } };

        case 'cancel':
          return await this.handleCancel(request as CancelRequest);

        case 'configure':
          return await this.handleConfigure(request as ConfigureRequest);

        default:
          throw new Error(`Method not found: ${request.method}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Method not found')) {
          throw this.createError(ERROR_CODES.METHOD_NOT_FOUND, error.message);
        }
        if (error.message.includes('Invalid or missing')) {
          throw this.createError(ERROR_CODES.INVALID_PARAMS, error.message);
        }
      }
      throw this.createError(ERROR_CODES.INTERNAL_ERROR, 'Internal server error');
    }
  }

  cancelRequest(requestId: string | number): void {
    const abortController = this.activeRequests.get(requestId);
    if (abortController) {
      abortController.abort();
      this.activeRequests.delete(requestId);
    }
  }

  private createError(code: number, message: string): MCPError {
    return {
      code,
      message
    };
  }
}