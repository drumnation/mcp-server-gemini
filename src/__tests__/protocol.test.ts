import { ProtocolManager, validateRequest, createInitializeResult } from '../protocol.js';

describe('ProtocolManager', () => {
  let protocol: ProtocolManager;

  beforeEach(() => {
    protocol = new ProtocolManager();
  });

  describe('initialization state', () => {
    it('should start in uninitialized state', () => {
      expect(protocol.isInitialized()).toBe(false);
    });

    it('should be able to mark as initialized', () => {
      protocol.markAsInitialized();
      expect(protocol.isInitialized()).toBe(true);
    });
  });

  describe('shutdown state', () => {
    it('should start not in shutdown state', () => {
      expect(protocol.isShutdownRequested()).toBe(false);
    });

    it('should be able to request shutdown', () => {
      protocol.requestShutdown();
      expect(protocol.isShutdownRequested()).toBe(true);
    });
  });

  describe('validateState', () => {
    it('should allow initialize method when not initialized', () => {
      expect(() => protocol.validateState('initialize')).not.toThrow();
    });

    it('should throw for other methods when not initialized', () => {
      expect(() => protocol.validateState('generate')).toThrow('Server not initialized');
    });

    it('should allow methods when initialized', () => {
      protocol.markAsInitialized();
      expect(() => protocol.validateState('generate')).not.toThrow();
    });

    it('should throw for non-exit methods when shutdown requested', () => {
      protocol.markAsInitialized();
      protocol.requestShutdown();
      expect(() => protocol.validateState('generate')).toThrow('Server is shutting down');
      expect(() => protocol.validateState('exit')).not.toThrow();
    });
  });
});

describe('validateRequest', () => {
  it('should validate request with required params', () => {
    const request = {
      params: {
        prompt: 'test'
      }
    };
    expect(validateRequest(request)).toBe(true);
  });

  it('should validate request with custom required params', () => {
    const request = {
      params: {
        configuration: {}
      }
    };
    expect(validateRequest(request, ['configuration'])).toBe(true);
  });

  it('should fail for missing params', () => {
    const request = {
      params: {}
    };
    expect(validateRequest(request)).toBe(false);
  });

  it('should fail for missing params object', () => {
    const request = {};
    expect(validateRequest(request)).toBe(false);
  });
});

describe('createInitializeResult', () => {
  it('should create valid initialize result', () => {
    const result = createInitializeResult();
    expect(result.protocolVersion).toBeDefined();
    expect(result.serverInfo).toBeDefined();
    expect(result.serverInfo.name).toBe('gemini-mcp');
    expect(result.capabilities).toBeDefined();
  });
}); 