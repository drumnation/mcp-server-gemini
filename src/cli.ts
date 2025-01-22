#!/usr/bin/env node

import { MCPServer } from './server.js';

const DEFAULT_PORT = 3005;

function parseArgs() {
  const args = process.argv.slice(2);
  const options: { port?: number; apiKey?: string } = {};

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--port':
      case '-p':
        options.port = parseInt(args[++i], 10);
        break;
      case '--api-key':
      case '-k':
        options.apiKey = args[++i];
        break;
    }
  }

  return options;
}

function showHelp() {
  console.log(`
MCP Server for Google Gemini API

Usage:
  mcp-server-gemini [options]

Options:
  --port, -p     Port to run the server on (default: 3005)
  --api-key, -k  Google API Key (required)
  --help, -h     Show this help message

Example:
  mcp-server-gemini --port 3005 --api-key YOUR_API_KEY
`);
}

async function main() {
  const options = parseArgs();

  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    showHelp();
    process.exit(0);
  }

  if (!options.apiKey) {
    console.error('Error: API key is required. Use --api-key or -k option.');
    showHelp();
    process.exit(1);
  }

  const port = options.port || DEFAULT_PORT;

  try {
    const server = new MCPServer(options.apiKey, port);
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\nShutting down server...');
      server.shutdown().then(() => process.exit(0));
    });

    process.on('SIGTERM', () => {
      console.log('\nShutting down server...');
      server.shutdown().then(() => process.exit(0));
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
}); 