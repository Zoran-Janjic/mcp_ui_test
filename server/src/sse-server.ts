import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createUIResource } from "@mcp-ui/server";
import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Health check
app.get('/', (req: any, res: any) => {
  res.json({ 
    status: 'MCP Server is running', 
    version: '1.0.0',
    endpoints: {
      health: '/health',
      sse: '/sse'
    }
  });
});

app.get('/health', (req: any, res: any) => {
  res.json({ status: 'healthy' });
});

// Initialize the MCP server with your existing tools
const server = new McpServer(
  {
    name: "mcpui-ts-demo-server-zoran",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Copy your existing tool: show_demo_ui
server.registerTool(
  "show_demo_ui",
  {
    description: "Displays a hello world UI card to the user",
    inputSchema: {},
  },
  async () => {
    const myHtmlParams = `
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <div style="padding: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; color: white; font-family: sans-serif; text-align: center;">
        <h1 style="margin-bottom: 20px;">🚀 Zoran's MCP Server Dashboard</h1>
        <p style="margin-bottom: 30px; font-size: 18px;">Successfully connected via SSE! This server is deployed on Render.</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0;">
          <div style="background: rgba(255,255,255,0.2); padding: 20px; border-radius: 8px;">
            <h3>Total Requests</h3>
            <div style="font-size: 32px; font-weight: bold;">1,429</div>
          </div>
          <div style="background: rgba(255,255,255,0.2); padding: 20px; border-radius: 8px;">
            <h3>Active Users</h3>
            <div style="font-size: 32px; font-weight: bold;">127</div>
          </div>
        </div>
        <button onclick="alert('Hello from deployed MCP Server!')" style="padding: 12px 24px; background: white; color: #333; border: none; border-radius: 6px; cursor: pointer; font-size: 16px; margin-top: 20px;">Test Interaction</button>
      </div>
    `;

    const resource = createUIResource({
      uri: "ui://demo/hello-world",
      content: {
        type: "rawHtml",
        htmlString: myHtmlParams,
      },
      encoding: "text",
    });

    return {
      content: [
        {
          type: "text",
          text: "Here is the requested UI from deployed server:",
        },
        resource as any
      ],
    };
  }
);

// Copy your existing tool: get_gl_stocks
server.registerTool(
  "get_gl_stocks",
  {
    description: "Retrieves and displays stock market data for GL Navigation (Japan)",
    inputSchema: {},
  },
  async () => {
    const stockData = {
      company: "GL Navigation",
      ticker: "9934.T",
      currentPrice: 2850,
      change: +45,
      changePercent: +1.6,
      volume: 125000,
      lastUpdated: new Date().toLocaleString('en-US', { timeZone: 'Asia/Tokyo' })
    };

    const htmlContent = `
      <div style="padding: 30px; background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); border-radius: 12px; color: white; font-family: sans-serif;">
        <h1 style="color: white; margin-bottom: 20px;">${stockData.company}</h1>
        <div style="background: white; color: #333; padding: 30px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
          <div style="font-size: 48px; font-weight: bold; margin-bottom: 10px;">¥${stockData.currentPrice.toLocaleString()}</div>
          <div style="font-size: 18px; color: #16a34a;">▲ ¥${stockData.change} (+${stockData.changePercent}%)</div>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
          <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 6px; text-align: center;">
            <div style="font-size: 12px; margin-bottom: 5px;">VOLUME</div>
            <div style="font-size: 20px; font-weight: bold;">${stockData.volume.toLocaleString()}</div>
          </div>
        </div>
        <div style="margin-top: 20px; font-size: 12px; opacity: 0.8;">Last updated: ${stockData.lastUpdated}</div>
      </div>
    `;

    const resource = createUIResource({
      uri: "ui://stocks/gl-navigation",
      content: {
        type: "rawHtml",
        htmlString: htmlContent,
      },
      encoding: "text",
    });

    return {
      content: [
        {
          type: "text",
          text: `GL Navigation Stock: ¥${stockData.currentPrice} (${stockData.changePercent >= 0 ? '+' : ''}${stockData.changePercent}%)`,
        },
        resource as any
      ],
    };
  }
);

// SSE endpoint for MCP protocol
app.get('/sse', (req: any, res: any) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  // Send server info
  res.write(`data: ${JSON.stringify({
    jsonrpc: '2.0',
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {
        tools: {
          listChanged: true
        }
      },
      serverInfo: {
        name: 'mcpui-ts-demo-server-zoran',
        version: '1.0.0'
      }
    }
  })}\n\n`);

  // Keep connection alive
  const keepAlive = setInterval(() => {
    res.write(`data: ${JSON.stringify({ type: 'ping' })}\n\n`);
  }, 30000);

  req.on('close', () => {
    clearInterval(keepAlive);
    res.end();
  });
});

// Tools list endpoint
app.get('/tools', (req: any, res: any) => {
  res.json({
    tools: [
      {
        name: 'show_demo_ui',
        description: 'Displays a hello world UI card to the user',
        inputSchema: { type: 'object', properties: {} }
      },
      {
        name: 'get_gl_stocks',
        description: 'Retrieves and displays stock market data for GL Navigation (Japan)',
        inputSchema: { type: 'object', properties: {} }
      }
    ]
  });
});

// Tool execution endpoint
app.post('/tools/:toolName', async (req: any, res: any) => {
  try {
    const { toolName } = req.params;
    const params = req.body || {};

    console.log(`Executing tool: ${toolName}`);

    let result;
    
    if (toolName === 'show_demo_ui') {
      // Execute show_demo_ui tool directly
      const myHtmlParams = `
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <div style="padding: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; color: white; font-family: sans-serif; text-align: center;">
          <h1 style="margin-bottom: 20px;">🚀 Zoran's MCP Server Dashboard</h1>
          <p style="margin-bottom: 30px; font-size: 18px;">Successfully connected via SSE! This server is deployed on Render.</p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0;">
            <div style="background: rgba(255,255,255,0.2); padding: 20px; border-radius: 8px;">
              <h3>Total Requests</h3>
              <div style="font-size: 32px; font-weight: bold;">1,429</div>
            </div>
            <div style="background: rgba(255,255,255,0.2); padding: 20px; border-radius: 8px;">
              <h3>Active Users</h3>
              <div style="font-size: 32px; font-weight: bold;">127</div>
            </div>
          </div>
          <button onclick="alert('Hello from deployed MCP Server!')" style="padding: 12px 24px; background: white; color: #333; border: none; border-radius: 6px; cursor: pointer; font-size: 16px; margin-top: 20px;">Test Interaction</button>
        </div>
      `;
      const resource = createUIResource({
        uri: "ui://demo/hello-world",
        content: { type: "rawHtml", htmlString: myHtmlParams },
        encoding: "text",
      });
      result = { content: [{ type: "text", text: "Here is the requested UI:" }, resource] };
      
    } else if (toolName === 'get_gl_stocks') {
      // Execute get_gl_stocks tool directly
      const stockData = {
        company: "GL Navigation", ticker: "9934.T", currentPrice: 2850,
        change: +45, changePercent: +1.6, volume: 125000,
        lastUpdated: new Date().toLocaleString('en-US', { timeZone: 'Asia/Tokyo' })
      };
      const htmlContent = `
        <div style="padding: 30px; background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); border-radius: 12px; color: white; font-family: sans-serif;">
          <h1 style="color: white; margin-bottom: 20px;">${stockData.company}</h1>
          <div style="background: white; color: #333; padding: 30px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
            <div style="font-size: 48px; font-weight: bold; margin-bottom: 10px;">¥${stockData.currentPrice.toLocaleString()}</div>
            <div style="font-size: 18px; color: #16a34a;">▲ ¥${stockData.change} (+${stockData.changePercent}%)</div>
          </div>
        </div>
      `;
      const resource = createUIResource({
        uri: "ui://stocks/gl-navigation",
        content: { type: "rawHtml", htmlString: htmlContent },
        encoding: "text",
      });
      result = { content: [{ type: "text", text: `GL Navigation Stock: ¥${stockData.currentPrice}` }, resource] };
      
    } else {
      return res.status(404).json({ error: 'Tool not found' });
    }

    res.json({ success: true, result: result });
  } catch (error) {
    console.error('Error executing tool:', error);
    res.status(500).json({ error: 'Tool execution failed', details: error });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 MCP Server running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`📡 SSE endpoint: http://localhost:${PORT}/sse`);
  console.log(`🔧 Tools endpoint: http://localhost:${PORT}/tools`);
});