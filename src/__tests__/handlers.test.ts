import { MCPHandlers } from '../handlers.js';
import { ProtocolManager } from '../protocol.js';
import { GenerativeModel } from '@google/generative-ai';
import { MCPRequest, GenerateRequest, StreamRequest, CancelRequest, ConfigureRequest, StreamResponse } from '../types/protocols.js';

jest.mock('@google/generative-ai', () => ({
  GenerativeModel: jest.fn().mockImplementation(() => ({
    generateContent: jest.fn(),
    generateContentStream: jest.fn()
  }))
}));

describe('MCPHandlers', () => {
  let handlers: MCPHandlers;
  let mockModel: jest.Mocked<GenerativeModel>;
  let protocol: ProtocolManager;

  beforeEach(() => {
    mockModel = new GenerativeModel('dummy-api-key', { model: 'gemini-pro' }) as jest.Mocked<GenerativeModel>;
    protocol = new ProtocolManager();
    handlers = new MCPHandlers(mockModel, protocol);
  });

  describe('handleInitialize', () => {
    it('should return a valid initialize response', async () => {
      const request: MCPRequest = {
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {}
      };

      const response = await handlers.handleInitialize(request);

      expect(response.jsonrpc).toBe('2.0');
      expect(response.id).toBe(1);
      expect(response.result).toBeDefined();
      expect(response.result.protocolVersion).toBeDefined();
      expect(response.result.serverInfo).toBeDefined();
      expect(response.result.capabilities).toBeDefined();
    });
  });

  describe('handleGenerate', () => {
    it('should handle generate request', async () => {
      const request: GenerateRequest = {
        jsonrpc: '2.0',
        id: 1,
        method: 'generate',
        params: {
          prompt: 'Test prompt'
        }
      };

      const mockResponse = {
        response: {
          text: () => 'Generated text'
        }
      };

      mockModel.generateContent.mockResolvedValue(mockResponse as any);

      const response = await handlers.handleGenerate(request);

      expect(response.jsonrpc).toBe('2.0');
      expect(response.id).toBe(1);
      expect(response.result.type).toBe('completion');
      expect(response.result.content).toBe('Generated text');
      expect(response.result.metadata.model).toBe('gemini-pro');
      expect(response.result.metadata.provider).toBe('google');
    });

    it('should throw error for invalid params', async () => {
      const request: GenerateRequest = {
        jsonrpc: '2.0',
        id: 1,
        method: 'generate',
        params: {} as any
      };

      await expect(handlers.handleGenerate(request)).rejects.toEqual({
        code: -32602,
        message: 'Invalid or missing parameters'
      });
    });
  });

  describe('handleStream', () => {
    it('should handle stream request', async () => {
      const request: StreamRequest = {
        jsonrpc: '2.0',
        id: 1,
        method: 'stream',
        params: {
          prompt: 'Test prompt'
        }
      };

      const mockChunks = [
        { text: () => 'Part 1' },
        { text: () => 'Part 2' }
      ];

      const mockStream = {
        stream: {
          async *[Symbol.asyncIterator]() {
            for (const chunk of mockChunks) {
              yield chunk;
            }
          }
        }
      };

      mockModel.generateContentStream.mockResolvedValue(mockStream as any);

      const responsePromise = handlers.handleStream(request);
      const responses: StreamResponse[] = [];

      handlers.on('response', (response: StreamResponse) => {
        responses.push(response);
      });

      await responsePromise;

      expect(responses).toHaveLength(3); // 2 chunks + final
      expect(responses[0].result.content).toBe('Part 1');
      expect(responses[0].result.done).toBe(false);
      expect(responses[1].result.content).toBe('Part 2');
      expect(responses[1].result.done).toBe(false);
      expect(responses[2].result.done).toBe(true);
    });

    it('should throw error for invalid params', async () => {
      const request: StreamRequest = {
        jsonrpc: '2.0',
        id: 1,
        method: 'stream',
        params: {} as any
      };

      await expect(handlers.handleStream(request)).rejects.toEqual({
        code: -32602,
        message: 'Invalid or missing parameters'
      });
    });
  });

  describe('handleCancel', () => {
    it('should cancel active request', async () => {
      const request: CancelRequest = {
        jsonrpc: '2.0',
        id: 1,
        method: 'cancel',
        params: {
          requestId: '123'
        }
      };

      // Set up an active request
      const abortController = new AbortController();
      (handlers as any).activeRequests.set('123', abortController);

      const response = await handlers.handleCancel(request);

      expect(response.result.cancelled).toBe(true);
      expect((handlers as any).activeRequests.has('123')).toBe(false);
    });

    it('should throw error for non-existent request', async () => {
      const request: CancelRequest = {
        jsonrpc: '2.0',
        id: 1,
        method: 'cancel',
        params: {
          requestId: 'non-existent'
        }
      };

      await expect(handlers.handleCancel(request)).rejects.toEqual({
        code: -32600,
        message: 'Request not found or already completed'
      });
    });
  });

  describe('handleConfigure', () => {
    it('should handle configure request', async () => {
      const request: ConfigureRequest = {
        jsonrpc: '2.0',
        id: 1,
        method: 'configure',
        params: {
          configuration: {
            temperature: 0.7
          }
        }
      };

      const response = await handlers.handleConfigure(request);

      expect(response.result.configured).toBe(true);
    });

    it('should throw error for invalid params', async () => {
      const request: ConfigureRequest = {
        jsonrpc: '2.0',
        id: 1,
        method: 'configure',
        params: {} as any
      };

      await expect(handlers.handleConfigure(request)).rejects.toEqual({
        code: -32602,
        message: 'Missing configuration parameter'
      });
    });
  });

  describe('handleRequest', () => {
    it('should route to correct handler', async () => {
      const request: MCPRequest = {
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {}
      };

      const response = await handlers.handleRequest(request);
      expect(response.result).toBeDefined();
    });

    it('should throw error for unknown method', async () => {
      const request: MCPRequest = {
        jsonrpc: '2.0',
        id: 1,
        method: 'unknown',
        params: {}
      };

      await expect(handlers.handleRequest(request)).rejects.toEqual({
        code: -32601,
        message: 'Method not found: unknown'
      });
    });
  });
}); 