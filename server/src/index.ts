import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createUIResource } from "@mcp-ui/server";

// NOTE: Had to migrate from the old Server class to McpServer because Server is deprecated now.
// McpServer has a nicer API anyway as it uses registerTool() instead of manual setRequestHandler calls.
// Also changed package.json to "type": "module" since we're using import/export with verbatimModuleSyntax enabled.

// Initialize the MCP server with basic info
const server = new McpServer(
  {
    name: "mcpui-ts-demo-server-zoran",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {}, // we're exposing tools to the client
    },
  }
);

// Register our demo tool - this is way cleaner than the old schema-based approach
server.registerTool(
  "show-demo-ui",
  {
    description: "Displays a hello world UI card to the user",
    inputSchema: {}, // no params needed for this demo
  },
  async () => {
    // The HTML below is essentially our "frontend" - you can put any valid HTML/CSS/JS here
    const myHtmlParams = `
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        html, body {
          height: 100%;
          width: 100%;
          margin: 0;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 0;
          min-height: 100vh;
        }
        
        .dashboard {
          width: 100%;
          max-width: none;
          margin: 0 auto;
          padding: 40px;
          box-sizing: border-box;
          min-height: calc(100vh - 80px);
        }
        
        .header {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          margin-bottom: 30px;
        }
        
        .header h1 {
          color: #2d3748;
          font-size: 32px;
          margin-bottom: 10px;
        }
        
        .header p {
          color: #718096;
          font-size: 16px;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .stat-card {
          background: white;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
        }
        
        .stat-card h3 {
          color: #718096;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        
        .stat-card .value {
          color: #2d3748;
          font-size: 36px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        
        .stat-card .trend {
          color: #48bb78;
          font-size: 14px;
        }
        
        .stat-card .trend.down {
          color: #f56565;
        }
        
        .table-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .table-header {
          padding: 25px;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .table-header h2 {
          color: #2d3748;
          font-size: 20px;
          margin-bottom: 5px;
        }
        
        .table-header .subtitle {
          color: #718096;
          font-size: 14px;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
        }
        
        thead {
          background: #f7fafc;
        }
        
        th {
          padding: 15px 25px;
          text-align: left;
          color: #4a5568;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        tbody tr {
          border-top: 1px solid #e2e8f0;
          transition: background-color 0.2s;
        }
        
        tbody tr:hover {
          background-color: #f7fafc;
        }
        
        td {
          padding: 20px 25px;
          color: #2d3748;
          font-size: 14px;
        }
        
        .status {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .status.active {
          background: #c6f6d5;
          color: #22543d;
        }
        
        .status.pending {
          background: #feebc8;
          color: #7c2d12;
        }
        
        .status.inactive {
          background: #fed7d7;
          color: #742a2a;
        }
        
        .actions {
          display: flex;
          gap: 10px;
        }
        
        button {
          padding: 8px 16px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          transition: background 0.2s;
        }
        
        button:hover {
          background: #5568d3;
        }
        
        button.secondary {
          background: #e2e8f0;
          color: #4a5568;
        }
        
        button.secondary:hover {
          background: #cbd5e0;
        }
      </style>
      
      <div class="dashboard">
        <div class="header">
          <h1>ZORANS MCP UI Server Dashboard</h1>
          <p>Real-time monitoring and analytics for your TypeScript MCP server</p>
        </div>
        
        <div class="stats-grid">
          <div class="stat-card">
            <h3>Total Requests</h3>
            <div class="value">24,583</div>
            <div class="trend">↑ 12.5% from last week</div>
          </div>
          
          <div class="stat-card">
            <h3>Active Users</h3>
            <div class="value">1,429</div>
            <div class="trend">↑ 8.3% from last week</div>
          </div>
          
          <div class="stat-card">
            <h3>Response Time</h3>
            <div class="value">124ms</div>
            <div class="trend down">↓ 3.2% slower</div>
          </div>
          
          <div class="stat-card">
            <h3>Success Rate</h3>
            <div class="value">99.2%</div>
            <div class="trend">↑ 0.5% improvement</div>
          </div>
        </div>
        
        <div class="table-container">
          <div class="table-header">
            <h2>Recent Activity</h2>
            <div class="subtitle">Latest server operations and their status</div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Operation</th>
                <th>User</th>
                <th>Status</th>
                <th>Duration</th>
                <th>Timestamp</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>show-demo-ui</td>
                <td>john.doe@example.com</td>
                <td><span class="status active">Active</span></td>
                <td>142ms</td>
                <td>2 minutes ago</td>
                <td class="actions">
                  <button>View</button>
                  <button class="secondary">Details</button>
                </td>
              </tr>
              <tr>
                <td>data-export</td>
                <td>jane.smith@example.com</td>
                <td><span class="status active">Active</span></td>
                <td>89ms</td>
                <td>5 minutes ago</td>
                <td class="actions">
                  <button>View</button>
                  <button class="secondary">Details</button>
                </td>
              </tr>
              <tr>
                <td>report-generation</td>
                <td>mike.wilson@example.com</td>
                <td><span class="status pending">Pending</span></td>
                <td>256ms</td>
                <td>8 minutes ago</td>
                <td class="actions">
                  <button>View</button>
                  <button class="secondary">Details</button>
                </td>
              </tr>
              <tr>
                <td>authentication</td>
                <td>sarah.jones@example.com</td>
                <td><span class="status active">Active</span></td>
                <td>67ms</td>
                <td>12 minutes ago</td>
                <td class="actions">
                  <button>View</button>
                  <button class="secondary">Details</button>
                </td>
              </tr>
              <tr>
                <td>file-upload</td>
                <td>alex.brown@example.com</td>
                <td><span class="status inactive">Inactive</span></td>
                <td>1.2s</td>
                <td>15 minutes ago</td>
                <td class="actions">
                  <button>View</button>
                  <button class="secondary">Details</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Use the MCP-UI helper to wrap our HTML in the proper resource format
    const resource = createUIResource({
      uri: "ui://demo/hello-world", // unique identifier for this UI resource
      content: {
        type: "rawHtml",
        htmlString: myHtmlParams,
      },
      encoding: "text",
    });

    // Send back both a text message and the UI resource
    // The 'as any' cast is needed because mcp-ui extends the base SDK types in a way that TS doesn't love
    return {
      content: [
        {
          type: "text",
          text: "Here is the requested UI:",
        },
        resource as any 
      ],
    };
  }
);

// Register GL Navigation stock data tool
server.registerTool(
  "get-gl-stocks",
  {
    description: "Retrieves and displays stock market data for GL Navigation (Japan)",
    inputSchema: {}, // no params needed
  },
  async () => {
    // Simulated stock data for GL Navigation
    // In a real implementation, you'd fetch this from a stock API
    const stockData = {
      company: "GL Navigation",
      ticker: "9934.T", // Tokyo Stock Exchange ticker
      exchange: "Tokyo Stock Exchange",
      currentPrice: 2850,
      currency: "JPY",
      change: +45,
      changePercent: +1.6,
      volume: 125000,
      marketCap: "42.5B JPY",
      high52Week: 3200,
      low52Week: 2100,
      lastUpdated: new Date().toLocaleString('en-US', { timeZone: 'Asia/Tokyo' })
    };

    const htmlContent = `
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        html, body {
          height: 100%;
          width: 100%;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
          padding: 0;
          min-height: 100vh;
        }
        
        .stock-dashboard {
          width: 100%;
          max-width: none;
          margin: 0 auto;
          padding: 40px;
          box-sizing: border-box;
          min-height: calc(100vh - 80px);
        }
        
        .company-header {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          margin-bottom: 30px;
        }
        
        .company-name {
          font-size: 32px;
          color: #1e293b;
          margin-bottom: 5px;
        }
        
        .ticker {
          font-size: 16px;
          color: #64748b;
          font-weight: 600;
        }
        
        .price-section {
          background: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          margin-bottom: 30px;
          text-align: center;
        }
        
        .current-price {
          font-size: 64px;
          font-weight: bold;
          color: #1e293b;
          margin-bottom: 10px;
        }
        
        .currency {
          font-size: 24px;
          color: #64748b;
          margin-left: 10px;
        }
        
        .price-change {
          font-size: 24px;
          font-weight: 600;
          margin-top: 10px;
        }
        
        .price-change.positive {
          color: #16a34a;
        }
        
        .price-change.negative {
          color: #dc2626;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .stat-card {
          background: white;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .stat-label {
          font-size: 14px;
          color: #64748b;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 10px;
        }
        
        .stat-value {
          font-size: 28px;
          color: #1e293b;
          font-weight: bold;
        }
        
        .chart-placeholder {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          text-align: center;
          margin-bottom: 20px;
          position: relative;
        }
        
        .chart-title {
          font-size: 20px;
          color: #1e293b;
          margin-bottom: 20px;
          text-align: left;
        }
        
        .chart-placeholder canvas {
          max-width: 100%;
          height: 300px;
          cursor: crosshair;
        }
        
        .tooltip {
          position: absolute;
          background: rgba(30, 41, 59, 0.95);
          color: white;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 14px;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.2s;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          z-index: 1000;
        }
        
        .tooltip.visible {
          opacity: 1;
        }
        
        .tooltip-date {
          font-weight: 600;
          margin-bottom: 4px;
        }
        
        .tooltip-price {
          font-size: 16px;
          color: #60a5fa;
        }
        
        .last-updated {
          text-align: center;
          color: white;
          font-size: 14px;
          margin-top: 20px;
          opacity: 0.9;
        }
        
        .info-banner {
          background: rgba(255, 255, 255, 0.95);
          border-left: 4px solid #3b82f6;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        
        .info-banner p {
          color: #475569;
          line-height: 1.6;
        }
      </style>
      
      <div class="stock-dashboard">
        <div class="company-header">
          <div class="company-name">${stockData.company}</div>
          <div class="ticker">${stockData.ticker} • ${stockData.exchange}</div>
        </div>
        
        <div class="info-banner">
          <p>GL Navigation Co., Ltd. is a Japanese logistics and supply chain management company specializing in maritime and freight forwarding services.</p>
        </div>
        
        <div class="price-section">
          <div class="current-price">
            ¥${stockData.currentPrice.toLocaleString()}
            <span class="currency">${stockData.currency}</span>
          </div>
          <div class="price-change ${stockData.change >= 0 ? 'positive' : 'negative'}">
            ${stockData.change >= 0 ? '▲' : '▼'} ¥${Math.abs(stockData.change)} (${stockData.changePercent >= 0 ? '+' : ''}${stockData.changePercent}%)
          </div>
        </div>
        
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">Trading Volume</div>
            <div class="stat-value">${stockData.volume.toLocaleString()}</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-label">Market Cap</div>
            <div class="stat-value">${stockData.marketCap}</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-label">52-Week High</div>
            <div class="stat-value">¥${stockData.high52Week.toLocaleString()}</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-label">52-Week Low</div>
            <div class="stat-value">¥${stockData.low52Week.toLocaleString()}</div>
          </div>
        </div>
        
        <div class="chart-placeholder">
          <div class="chart-title">Price History (Last 30 Days)</div>
          <canvas id="stockChart"></canvas>
          <div id="tooltip" class="tooltip">
            <div class="tooltip-date"></div>
            <div class="tooltip-price"></div>
          </div>
        </div>
        
        <div class="last-updated">
          Last updated: ${stockData.lastUpdated} (JST)
        </div>
      </div>
      
      <script>
        // Wait for DOM to be ready
        window.addEventListener('load', function() {
          const canvas = document.getElementById('stockChart');
          if (!canvas) return;
          
          const ctx = canvas.getContext('2d');
          const tooltip = document.getElementById('tooltip');
          const tooltipDate = tooltip.querySelector('.tooltip-date');
          const tooltipPrice = tooltip.querySelector('.tooltip-price');
          
          // Set canvas size based on parent container
          const container = canvas.parentElement;
          canvas.width = container.clientWidth - 60; // subtract padding
          canvas.height = 300;
          
          // Generate mock price data with dates
          const days = 30;
          const basePrice = ${stockData.currentPrice};
          const prices = [];
          const dates = [];
          const today = new Date();
          
          for (let i = 0; i < days; i++) {
            const variation = (Math.random() - 0.5) * 200;
            prices.push(basePrice + variation);
            
            const date = new Date(today);
            date.setDate(date.getDate() - (days - 1 - i));
            dates.push(date);
          }
          
          // Chart dimensions
          const padding = 40;
          const width = canvas.width - padding * 2;
          const height = canvas.height - padding * 2;
          const maxPrice = Math.max(...prices);
          const minPrice = Math.min(...prices);
          const priceRange = maxPrice - minPrice;
          
          // Store data points for interaction
          const dataPoints = prices.map((price, i) => ({
            x: padding + (i / (days - 1)) * width,
            y: padding + height - ((price - minPrice) / priceRange) * height,
            price: price,
            date: dates[i]
          }));
          
          function drawChart(highlightIndex = -1) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw background grid
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 0.5;
            for (let i = 0; i <= 5; i++) {
              const y = padding + (height / 5) * i;
              ctx.beginPath();
              ctx.moveTo(padding, y);
              ctx.lineTo(canvas.width - padding, y);
              ctx.stroke();
            }
            
            // Draw price line
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 3;
            ctx.beginPath();
            
            dataPoints.forEach((point, i) => {
              if (i === 0) {
                ctx.moveTo(point.x, point.y);
              } else {
                ctx.lineTo(point.x, point.y);
              }
            });
            
            ctx.stroke();
            
            // Draw area under line
            ctx.lineTo(canvas.width - padding, canvas.height - padding);
            ctx.lineTo(padding, canvas.height - padding);
            ctx.closePath();
            ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
            ctx.fill();
            
            // Draw highlight point
            if (highlightIndex >= 0 && highlightIndex < dataPoints.length) {
              const point = dataPoints[highlightIndex];
              
              // Draw vertical line
              ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
              ctx.lineWidth = 1;
              ctx.setLineDash([5, 5]);
              ctx.beginPath();
              ctx.moveTo(point.x, padding);
              ctx.lineTo(point.x, canvas.height - padding);
              ctx.stroke();
              ctx.setLineDash([]);
              
              // Draw point circle
              ctx.fillStyle = '#3b82f6';
              ctx.beginPath();
              ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
              ctx.fill();
              
              // Outer circle
              ctx.strokeStyle = 'white';
              ctx.lineWidth = 2;
              ctx.stroke();
            }
            
            // Draw axes
            ctx.strokeStyle = '#cbd5e0';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(padding, padding);
            ctx.lineTo(padding, canvas.height - padding);
            ctx.lineTo(canvas.width - padding, canvas.height - padding);
            ctx.stroke();
            
            // Labels
            ctx.fillStyle = '#64748b';
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText('¥' + Math.round(maxPrice).toLocaleString(), padding - 5, padding + 5);
            ctx.fillText('¥' + Math.round(minPrice).toLocaleString(), padding - 5, canvas.height - padding + 5);
            ctx.textAlign = 'center';
            ctx.fillText('30 days ago', padding + 30, canvas.height - 20);
            ctx.fillText('Today', canvas.width - padding - 30, canvas.height - 20);
          }
          
          // Initial draw
          drawChart();
          
          // Mouse interaction
          canvas.addEventListener('mousemove', function(e) {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            // Find closest data point
            let closestIndex = -1;
            let minDistance = Infinity;
            
            dataPoints.forEach((point, i) => {
              const distance = Math.abs(mouseX - point.x);
              if (distance < minDistance && distance < 20) {
                minDistance = distance;
                closestIndex = i;
              }
            });
            
            if (closestIndex >= 0) {
              const point = dataPoints[closestIndex];
              
              // Show tooltip
              tooltipDate.textContent = point.date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              });
              tooltipPrice.textContent = '¥' + Math.round(point.price).toLocaleString();
              
              tooltip.style.left = point.x + 'px';
              tooltip.style.top = (point.y - 60) + 'px';
              tooltip.classList.add('visible');
              
              // Redraw with highlight
              drawChart(closestIndex);
            } else {
              tooltip.classList.remove('visible');
              drawChart();
            }
          });
          
          canvas.addEventListener('mouseleave', function() {
            tooltip.classList.remove('visible');
            drawChart();
          });
        });
      </script>
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
          text: `GL Navigation (${stockData.ticker}) Stock Data:\nCurrent Price: ¥${stockData.currentPrice} ${stockData.currency}\nChange: ${stockData.change >= 0 ? '+' : ''}¥${stockData.change} (${stockData.changePercent >= 0 ? '+' : ''}${stockData.changePercent}%)\nVolume: ${stockData.volume.toLocaleString()}`,
        },
        resource as any
      ],
    };
  }
);

// Start everything up
async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // using console.error so it doesn't interfere with stdio protocol on stdout
  console.error("MCP Server running on stdio...");
}

run().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1); // added node types to tsconfig to make process global available
});
