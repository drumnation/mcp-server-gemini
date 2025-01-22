# Project Overview: Gemini MCP Server

## Description

The Gemini MCP Server is a lightweight server that implements the Model Context Protocol (MCP) to bridge Google's Gemini AI models with applications like Claude Desktop. This server allows Claude Desktop to interact with the Gemini API as a backend, enabling users to leverage Gemini's capabilities within the Claude environment.

## Key Features

- **MCP Protocol Support:** Implements the full Model Context Protocol, ensuring compatibility with MCP-compliant applications.
- **Real-time Streaming:** Supports real-time response streaming for a more interactive user experience.
- **Secure API Key Handling:**  Manages Gemini API keys securely through environment variables.
- **Configurable Parameters:** Allows customization of model parameters for generation requests.
- **TypeScript Implementation:** Built with TypeScript for robustness and maintainability.
- **Health Check Endpoint:** Provides a `/health` endpoint for monitoring server status.

## Architecture

The server is built using Node.js and WebSocket technology. It consists of the following key components:

1.  **WebSocket Server (`src/server.ts`):** Handles client connections, message routing, and manages the MCP protocol lifecycle.
2.  **Gemini API Integration (`src/index.ts`, `src/handlers.ts`):**  Utilizes the `@google/generative-ai` library to interact with the Gemini API for model initialization and content generation.
3.  **Message Handlers (`src/handlers.ts`):** Processes incoming MCP requests, including `initialize`, `generate`, `stream`, `cancel`, and `configure`, and sends responses back to the client.
4.  **Protocol Manager (`src/protocol.ts`):** Manages the MCP protocol state, versioning, and capabilities.
5.  **Error Handling:** Implements robust error handling and reporting, adhering to JSON-RPC error codes.

## Purpose

The primary purpose of this server is to enable users of Claude Desktop to access and utilize Google's Gemini AI models. By acting as an MCP server, it translates requests from Claude Desktop into Gemini API calls and streams responses back, effectively extending Claude's model capabilities.

This project is valuable for:

- Users who prefer the Claude Desktop interface but want to use Gemini models.
- Developers who want to integrate Gemini models into MCP-compatible applications.
- Experimenting with and comparing different AI models within a consistent environment.

## Technologies Used

- **Node.js:**  Runtime environment.
- **TypeScript:** Programming language.
- **ws:** WebSocket library for server implementation.
- **@google/generative-ai:**  Google Gemini API client library.
- **npm:** Package manager.
- **Jest:** Testing framework.

## Documentation

- **README.md:** (README.md: startLine: 1 endLine: 89) Provides a quick start guide, features overview, and setup instructions.
- **docs/claude-desktop-setup.md:** (docs/claude-desktop-setup.md: startLine: 1 endLine: 143)  Detailed guide for configuring Claude Desktop to use the Gemini MCP server.
- **docs/examples.md:** (docs/examples.md: startLine: 1 endLine: 171) Usage examples and advanced configuration options.
- **docs/implementation-notes.md:** (docs/implementation-notes.md: startLine: 1 endLine: 92) Technical implementation details and architecture overview.
- **docs/development-guide.md:** (docs/development-guide.md: startLine: 1 endLine: 119) Guide for developers who want to contribute to the project.
- **docs/troubleshooting.md:** (docs/troubleshooting.md: startLine: 1 endLine: 98) Common issues and solutions.
- **CONTRIBUTING.md:** (CONTRIBUTING.md: startLine: 1 endLine: 42) Contribution guidelines.

## Development Status

The Gemini MCP Server is currently functional and provides core MCP protocol support for interacting with Gemini models. It is actively maintained and open for community contributions. Further development may include:

- Expanding MCP functionality to support more features.
- Adding more configuration options for Gemini models.
- Improving documentation and examples.
- Enhancing error handling and logging.
