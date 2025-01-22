# Installation Guide

## Prerequisites

- Node.js >= 18.0.0
- npm, pnpm, or yarn package manager
- Google API key for Gemini

## Global Installation

You can install `mcp-server-gemini` globally to run it from anywhere on your system:

```bash
# Using npm
npm install -g mcp-server-gemini

# Using pnpm
pnpm add -g mcp-server-gemini

# Using yarn
yarn global add mcp-server-gemini
```

## Usage

Once installed globally, you can run the server using:

```bash
mcp-server-gemini --api-key YOUR_API_KEY
```

### Command Line Options

- `--api-key`, `-k`: Your Google API key (required)
- `--port`, `-p`: Port to run the server on (default: 3005)
- `--help`, `-h`: Show help message

### Examples

```bash
# Run with default settings
mcp-server-gemini --api-key YOUR_API_KEY

# Run on a custom port
mcp-server-gemini --api-key YOUR_API_KEY --port 3000

# Show help
mcp-server-gemini --help
```

## Local Development Installation

If you want to develop or contribute to the project:

1. Clone the repository:
```bash
git clone https://github.com/aliargun/mcp-server-gemini.git
cd mcp-server-gemini
```

2. Install dependencies:
```bash
pnpm install
```

3. Start in development mode:
```bash
pnpm dev --api-key YOUR_API_KEY
```

## Environment Variables

You can also set the API key using an environment variable:

```bash
export GEMINI_API_KEY=your_api_key
mcp-server-gemini
```

## Troubleshooting

If you encounter any issues:

1. Make sure you're using Node.js 18 or higher:
```bash
node --version
```

2. Check if the package is installed globally:
```bash
npm list -g mcp-server-gemini
```

3. Verify your API key is valid

For more detailed troubleshooting, see [troubleshooting.md](./troubleshooting.md). 