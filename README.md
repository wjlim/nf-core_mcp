# nf-core MCP Server

An MCP server for managing and navigating nf-core pipeline repositories.

## Features

- List local nf-core repositories (rnaseq, sarek, modules)
- Access pipeline configurations and workflows
- Search through pipeline files
- Explore pipeline modules

## Installation

### NPM Version

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Start the server
npm start
```

### Docker Version

```bash
# Build the Docker image
docker build -t nf-core-mcp .

# Run the container
docker run -it --rm \
  -v /c/Users/wonjun.lim.AD/OneDrive/문서/GitHub:/app/workspace \
  nf-core-mcp
```

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

Add the following to your `claude_desktop_config.json`:

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
        "/c/Users/wonjun.lim.AD/OneDrive/문서/GitHub:/app/workspace",
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