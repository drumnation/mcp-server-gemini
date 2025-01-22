# Development Guide

## Environment Setup

1. Prerequisites
   - Node.js 18+
   - npm/yarn
   - TypeScript
   - Gemini API key

2. Installation
```bash
git clone https://github.com/aliargun/mcp-server-gemini.git
cd mcp-server-gemini
npm install
```

3. Configuration
```bash
# Set your Gemini API key
export GEMINI_API_KEY=your_api_key_here
```

## Development Workflow

1. Start Development Server
```bash
npm run dev
```

2. Build for Production
```bash
npm run build
```

3. Run Tests
```bash
npm test
```

## Project Structure

```
mcp-server-gemini/
├── src/
│   ├── __tests__/      # Test files
│   ├── interfaces/     # Interface definitions
│   ├── types/         # TypeScript type definitions
│   ├── cli.ts         # Command-line interface
│   ├── handlers.ts    # Request handlers
│   ├── protocol.ts    # Protocol implementation
│   └── server.ts      # WebSocket server implementation
├── docs/             # Documentation
└── dist/            # Compiled JavaScript (generated)
```

## Development Setup

1. Install dependencies:
```bash
pnpm install
```

2. Start in development mode:
```bash
pnpm dev --api-key YOUR_API_KEY
```

## Testing

Run the test suite:
```bash
pnpm test
```

Watch mode for development:
```bash
pnpm test:watch
```

## Type Checking

Check TypeScript types:
```bash
pnpm typecheck
```

## Code Style

Format code:
```bash
pnpm format
```

Lint code:
```bash
pnpm lint
```

Fix linting issues:
```bash
pnpm lint:fix
```

## Building

Build for production:
```bash
pnpm build
```

The compiled output will be in the `dist/` directory.

## CLI Development

The CLI is implemented in `src/cli.ts`. When developing new CLI features:

1. Add new command-line options in `parseArgs()`
2. Update the help message in `showHelp()`
3. Add option handling in `main()`
4. Test the changes:
```bash
pnpm dev --help
```

### Adding New CLI Options

Example of adding a new option:

```typescript
function parseArgs() {
  const args = process.argv.slice(2);
  const options: { port?: number; apiKey?: string; newOption?: string } = {};

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      // ... existing options ...
      case '--new-option':
        options.newOption = args[++i];
        break;
    }
  }

  return options;
}
```

## Release Process

1. Update version in package.json
2. Build the project:
```bash
pnpm build
```

3. Test the build:
```bash
pnpm start --api-key YOUR_API_KEY
```

4. Publish to npm:
```bash
npm publish
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run tests and type checking
6. Submit a pull request

For more details, see the [contribution guidelines](../CONTRIBUTING.md).

## Adding Features

1. Create new message handler:
```typescript
if (request.method === 'newMethod') {
  // Handle new method
}
```

2. Add capability:
```typescript
capabilities: {
  experimental: {
    newFeature: true
  }
}
```

## Testing

1. Unit Tests
```typescript
describe('Message Handler', () => {
  it('handles new method', () => {
    // Test implementation
  });
});
```

2. Integration Tests
```typescript
describe('WebSocket Server', () => {
  it('connects and processes messages', () => {
    // Test implementation
  });
});
```

## Debugging

1. Enable Debug Logging
```typescript
const DEBUG = true;
if (DEBUG) console.log('Debug:', message);
```

2. Use WebSocket Client
```bash
wscat -c ws://localhost:3005
```

## Best Practices

1. Code Style
   - Use TypeScript
   - Follow existing patterns
   - Document public APIs

2. Error Handling
   - Use type-safe errors
   - Provide meaningful messages
   - Log appropriately

3. Testing
   - Write unit tests
   - Add integration tests
   - Test error cases
