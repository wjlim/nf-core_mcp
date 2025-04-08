#!/usr/bin/env node
import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import path from 'path';
import fs from 'fs/promises';
const server = new McpServer({
    name: "nf-core-mcp",
    version: "1.0.0"
});
// Tool to list all nf-core pipelines
server.tool("list-pipelines", {}, async () => {
    try {
        const pipelines = ['rnaseq', 'sarek', 'modules', 'tools'];
        const pipelineDetails = await Promise.all(pipelines.map(async (name) => {
            const configPath = path.join(process.cwd(), name, "nextflow.config");
            try {
                const config = await fs.readFile(configPath, 'utf-8');
                return {
                    name,
                    hasConfig: true,
                    configPath
                };
            }
            catch {
                return {
                    name,
                    hasConfig: false
                };
            }
        }));
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify(pipelineDetails, null, 2)
                }]
        };
    }
    catch (error) {
        return {
            content: [{
                    type: "text",
                    text: `Error listing pipelines: ${error}`
                }],
            isError: true
        };
    }
});
// Tool to get pipeline modules
server.tool("get-pipeline-modules", {
    pipeline: z.string()
}, async ({ pipeline }) => {
    try {
        const modulesPath = path.join(process.cwd(), pipeline, "modules.json");
        const modulesContent = await fs.readFile(modulesPath, 'utf-8');
        const modules = JSON.parse(modulesContent);
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify(modules, null, 2)
                }]
        };
    }
    catch (error) {
        return {
            content: [{
                    type: "text",
                    text: `Error getting pipeline modules: ${error}`
                }],
            isError: true
        };
    }
});
// Tool to search across pipeline files
server.tool("search-pipelines", {
    query: z.string(),
    pipeline: z.string().optional()
}, async ({ query, pipeline }) => {
    try {
        const searchPath = pipeline ? path.join(process.cwd(), pipeline) : process.cwd();
        const results = [];
        async function searchDir(dir) {
            const entries = await fs.readdir(dir, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                if (entry.isDirectory() && !entry.name.startsWith('.')) {
                    await searchDir(fullPath);
                }
                else if (entry.isFile() &&
                    (entry.name.endsWith('.nf') ||
                        entry.name.endsWith('.config') ||
                        entry.name.endsWith('.json'))) {
                    try {
                        const content = await fs.readFile(fullPath, 'utf-8');
                        if (content.includes(query)) {
                            results.push(fullPath);
                        }
                    }
                    catch (err) {
                        console.error(`Error reading ${fullPath}: ${err}`);
                    }
                }
            }
        }
        await searchDir(searchPath);
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify(results, null, 2)
                }]
        };
    }
    catch (error) {
        return {
            content: [{
                    type: "text",
                    text: `Error searching pipelines: ${error}`
                }],
            isError: true
        };
    }
});
// Resource to get pipeline configuration
server.resource("pipeline-config", new ResourceTemplate("pipeline://{name}/config", { list: undefined }), async (uri, params) => {
    try {
        const name = params.name;
        const configPath = path.join(process.cwd(), name, "nextflow.config");
        const config = await fs.readFile(configPath, 'utf-8');
        return {
            contents: [{
                    uri: uri.href,
                    text: config
                }]
        };
    }
    catch (error) {
        throw new Error(`Failed to read pipeline config: ${error}`);
    }
});
// Resource to get pipeline workflow
server.resource("pipeline-workflow", new ResourceTemplate("pipeline://{name}/workflow", { list: undefined }), async (uri, params) => {
    try {
        const name = params.name;
        const mainPath = path.join(process.cwd(), name, "main.nf");
        const workflow = await fs.readFile(mainPath, 'utf-8');
        return {
            contents: [{
                    uri: uri.href,
                    text: workflow
                }]
        };
    }
    catch (error) {
        throw new Error(`Failed to read pipeline workflow: ${error}`);
    }
});
// Start the server
const transport = new StdioServerTransport();
server.connect(transport);
