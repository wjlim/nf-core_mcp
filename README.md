# nf-core MCP Server

An MCP server for managing and navigating nf-core pipeline repositories.

<a href="https://glama.ai/mcp/servers/@wjlim/nf-core_mcp">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@wjlim/nf-core_mcp/badge" alt="nf-core Server MCP server" />
</a>

## Features

- List local nf-core repositories (rnaseq, sarek, modules, tools)
- Access pipeline configurations and workflows
- Search through pipeline files
- Explore pipeline modules

## Installation

### NPM Version

```bash

cd nf-core_mcp
npm install

# Build TypeScript
npm run build

# Start the server
npm start
```

### Docker Version

```bash
# Build the Docker image
cd nf-core_mcp
docker build -t nf-core-mcp .
# Run the container
docker run -i --rm \
  -v "/path/to/your/workspace:/app/workspace" \
  nf-core-mcp
```

## Adding nf-core Repositories

To add new nf-core pipeline repositories to the workspace:

1. **Clone the repositories**:
   ```bash
   # Navigate to your workspace directory (example for Windows)
   cd /path/to/your/workspace

   # Clone desired nf-core repositories
   git clone https://github.com/nf-core/rnaseq.git
   git clone https://github.com/nf-core/sarek.git
   git clone https://github.com/nf-core/modules.git
   # Add any other nf-core pipeline you want to manage
   ```

2. **Directory Structure**:
   Your workspace should look like this:
   ```
   workspace/
   ├── rnaseq/
   ├── sarek/
   ├── modules/
   └── your-new-pipeline/
   ```

3. **Verify Installation**:
   After starting the MCP server, use the `list-pipelines` command to verify that your new pipelines are detected:
   ```
   list-pipelines
   ```

Note: The MCP server will automatically detect and manage any nf-core pipeline repositories in your workspace directory.

## Available Tools

1. `list-pipelines`
   - Lists all nf-core pipelines in the workspace
   - Shows configuration file status
   - No parameters required

2. `get-pipeline-modules`
   - Gets module information from a pipeline
   - Parameters:
     - `pipeline`: Pipeline name (rnaseq, sarek, or modules)

3. `search-pipelines`
   - Searches through pipeline files
   - Parameters:
     - `query`: Search query
     - `pipeline` (optional): Specific pipeline to search

## Available Resources

1. `pipeline-config`
   - Gets pipeline configuration
   - URI format: `pipeline://{name}/config`
   - Parameters:
     - `name`: Pipeline name (rnaseq, sarek, or modules)

2. `pipeline-workflow`
   - Gets pipeline workflow
   - URI format: `pipeline://{name}/workflow`
   - Parameters:
     - `name`: Pipeline name (rnaseq, sarek, or modules)

## Usage with Cursor IDE

### Using NPX (Recommended)

Add the following to your `mcp.json`:

```json
{
  "mcpServers": {
    "nf-core": {
      "command": "npx",
      "args": ["-y", "nf-core-mcp"]
    }
  }
}
```

### Using Docker

Add the following to your `mcp.json`:

```json
{
  "mcpServers": {
    "nf-core": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-v",
        "/path/to/your/workspace:/app/workspace",
        "nf-core-mcp"
      ]
    }
  }
}
```

## Example Usage

Using the MCP server in Cursor:

```
# List available pipelines
list-pipelines

# Get modules from rnaseq pipeline
get-pipeline-modules pipeline=rnaseq

# Search in all pipelines
search-pipelines query="fastqc"

# Search in specific pipeline
search-pipelines query="fastqc" pipeline=rnaseq

# Access pipeline configuration
pipeline://rnaseq/config

# Access workflow
pipeline://rnaseq/workflow
```

## Running the Server

### Using NPM

```bash
# If installed globally
nf-core-mcp

# If installed locally
npx nf-core-mcp

# Using npx without installation
npx -y nf-core-mcp
```

### Using Docker

```bash
docker run -it --rm \
  -v /path/to/your/workspace:/app/workspace \
  nf-core-mcp
```

## Development

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run in development mode
npm run dev

# Run tests
npm test

# Run linter
npm run lint
```

## License

MIT