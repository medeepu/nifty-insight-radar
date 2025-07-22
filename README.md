# Nifty Options Trading Platform

A comprehensive, real-time options trading platform built for intraday Nifty options trading with advanced technical analysis, Greeks calculation, and risk management.

## 🚀 Features

### Real-time Trading Dashboard
- **Live Charts**: Candlestick charts with ApexCharts integration
- **Multiple Overlays**: CPR, Daily/Weekly/Monthly pivots, EMAs (9/21/50/200), VWAP
- **Signal System**: Real-time BUY/SELL/NEUTRAL signals with entry/exit points
- **Risk Management**: Visual SL/TP markers, Risk-Reward ratio display
- **Pro Tips**: AI-generated trading insights with confidence levels

### Market Analysis Cards
- **Market Info**: Current price, trend, CPR type, ORB status, NR7 flags
- **Option Parameters**: Strike, LTP, expiry, days to expiry, contract value
- **Greeks Display**: Delta, Gamma, Theta, Vega, IV, IV Rank with visual indicators
- **Price Analysis**: Intrinsic/Time value breakdown, IV premium analysis
- **Risk Widget**: Position sizing, budget utilization, P&L projections

### Advanced Settings
- **Strike Selection**: Closest ATM, ITM+100, OTM-100, Manual, Ticker modes
- **Greeks Configuration**: Risk-free rate, dividend yield, IV calculations
- **Technical Indicators**: RSI, Stochastic, ORB, Reversal patterns
- **Budget Management**: Max loss per trade, position sizing strategies
- **Broker Integration**: Zerodha/Dhan API support (UI ready)

### Additional Features
- **Backtesting**: Historical strategy testing with performance metrics
- **ML Insights**: Market regime detection and confidence scoring
- **Activity Logs**: Real-time system messages and trade history
- **WebSocket Integration**: Live price and signal updates

## 🛠 Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **State Management**: Zustand + React Query (TanStack Query)
- **UI Components**: shadcn/ui + Radix UI + Tailwind CSS
- **Charts**: ApexCharts (react-apexcharts)
- **Real-time**: WebSocket integration
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios with interceptors

## 📋 Prerequisites

- Node.js 18+ and npm
- Modern web browser with WebSocket support

## 🚀 Quick Start

### 1. Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd nifty-options-platform

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api
VITE_WS_URL=ws://localhost:8000/ws

# Optional: Mock data for development
VITE_USE_MOCK_DATA=true
```

### 3. Development Mode

```bash
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) to view the application.

## 🏗 Project Structure

```
src/
├── components/           # React components
│   ├── dashboard/       # Trading dashboard cards
│   ├── layout/          # Layout components (TopBar, etc.)
│   ├── settings/        # Settings drawer and panels
│   └── ui/              # shadcn/ui components
├── hooks/               # Custom React hooks
│   ├── useApi.ts        # React Query API hooks
│   └── useWebSocket.ts  # WebSocket connection hook
├── store/               # Zustand state management
│   ├── useSettingsStore.ts  # Settings state
│   └── useTradingStore.ts   # Trading data state
├── types/               # TypeScript interfaces
│   ├── api.ts           # API response types
│   └── settings.ts      # Settings configuration types
├── utils/               # Utility functions
├── pages/               # Route components
└── styles/              # Global styles and themes
```

## 🔌 API Integration

### Backend Requirements

The frontend expects a backend server with these endpoints:

#### REST Endpoints

```typescript
// Price Data
GET /api/price/current?symbol=NIFTY
GET /api/candles?symbol=NIFTY&tf=5m&start=2024-01-01&end=2024-01-02

// Levels & Indicators
GET /api/levels/daily?symbol=NIFTY
GET /api/levels/weekly?symbol=NIFTY
GET /api/levels/monthly?symbol=NIFTY
GET /api/indicators?symbol=NIFTY

// Trading Signals
GET /api/signal/current?symbol=NIFTY

// Option Data
GET /api/greeks?optionSymbol=NIFTY24DEC21000CE

// Backtesting
POST /api/backtest
Body: {
  symbol: "NIFTY",
  from: "2024-01-01",
  to: "2024-01-31",
  timeframe: "5m",
  paramsOverride: {}
}

// ML Insights
GET /api/ml/insight?symbol=NIFTY

// System
GET /api/logs/recent?limit=100
POST /api/user/settings
POST /api/broker/keys
POST /api/trade/execute
```

#### WebSocket Channels

```typescript
// Real-time price updates
/ws/price → { type: 'price', data: PriceData }

// Signal updates
/ws/signal → { type: 'signal', data: SignalData }

// System logs
/ws/logs → { type: 'log', data: LogEntry }
```

### Sample Response Formats

```typescript
// Price Response
{
  "symbol": "NIFTY",
  "lastPrice": 19845.30,
  "change": 125.40,
  "changePercent": 0.64,
  "timestamp": "2024-01-15T09:30:00Z"
}

// Signal Response
{
  "signal": "BUY",
  "scenario": "Bullish breakout above resistance",
  "entry": 19850,
  "sl": 19800,
  "tp": 19950,
  "rr": 2.0,
  "confidence": 78,
  "timestamp": "2024-01-15T09:31:00Z",
  "proTip": "Watch for volume confirmation on breakout"
}

// Greeks Response
{
  "delta": 0.542,
  "gamma": 0.0043,
  "theta": -12.45,
  "vega": 89.32,
  "rho": 45.12,
  "iv": 0.1834,
  "theoreticalPrice": 245.50,
  "intrinsicValue": 180.00,
  "timeValue": 65.50,
  "status": "ITM",
  "moneynessPercent": 5.2
}
```

## ⚙️ Configuration

### Trading Settings

The platform supports comprehensive configuration:

```typescript
// Core Trading Settings
- Strike Selection Mode (ATM/ITM/OTM/Manual/Ticker)
- Trade Direction (Auto/Buy/Sell)
- Risk-Reward Ratio
- Scenario Override

// Risk Management
- Max Budget
- Max Loss Per Trade (%)
- Position Sizing Strategy
- Stop Loss Type
- Daily/Weekly/Monthly Loss Limits

// Technical Analysis
- EMA Periods (9/21/50/200)
- RSI/Stochastic Parameters
- ORB Settings
- CPR & Pivot Levels
- Consolidation & Gap Thresholds

// Display Options
- Chart Theme & Overlays
- Dashboard Block Visibility
- Label Settings
- Color Schemes
```

### Broker Integration

```typescript
// Supported Brokers
- Zerodha (API Key + Secret + Token)
- Dhan (Client ID + Access Token)

// Trading Features
- Paper Trading Mode
- Auto Trade Execution
- Order Confirmation
- Real-time Position Updates
```

## 🎨 Theming & Customization

### Design System

The platform uses a professional dark trading theme:

```css
/* Trading Colors */
--bull-green: 142 76% 36%    /* Bullish signals */
--bear-red: 0 84% 60%        /* Bearish signals */  
--neutral-yellow: 45 93% 47% /* Neutral signals */
--primary: 195 100% 50%      /* Accent color */

/* Chart Colors */
--chart-grid: 220 12% 18%    /* Grid lines */
--chart-axis: 210 10% 40%    /* Axis labels */
```

### Component Variants

```typescript
// Signal Badges
.signal-badge-bull    // Green gradient with glow
.signal-badge-bear    // Red gradient with glow  
.signal-badge-neutral // Yellow gradient

// Cards
.trading-card        // Dark surface with subtle gradient
.metric-card         // Hover effects and borders
.chart-container     // Chart-specific styling
```

## 📊 Performance & Optimization

- **React Query Caching**: Smart caching for API responses
- **WebSocket Reconnection**: Auto-reconnect with exponential backoff
- **Memoized Components**: Optimized re-rendering
- **Virtualized Lists**: Performance for large datasets
- **Code Splitting**: Lazy loading for route components

## 🧪 Development

### Mock Data

For development without a backend:

```bash
# Enable mock data
VITE_USE_MOCK_DATA=true npm run dev
```

### Building

```bash
# Development build
npm run build:dev

# Production build  
npm run build

# Preview production build
npm run preview
```

### Linting & Formatting

```bash
# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

## 🚀 Deployment

### Static Deployment

```bash
npm run build
# Deploy the 'dist' folder to your hosting platform
```

### Environment Variables for Production

```env
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_WS_URL=wss://your-api-domain.com/ws
```

## 🔧 Troubleshooting

### Common Issues

1. **WebSocket Connection Failed**
   - Check if backend WebSocket server is running
   - Verify VITE_WS_URL in environment
   - Check browser console for connection errors

2. **API Endpoints Not Found**
   - Verify VITE_API_BASE_URL configuration
   - Check if backend server is running
   - Enable mock data for development

3. **Chart Not Loading**
   - Ensure ApexCharts dependencies are installed
   - Check browser console for JavaScript errors
   - Verify chart data format matches expected structure

4. **Settings Not Persisting**
   - Check localStorage availability
   - Verify settings store persistence configuration
   - Check for browser privacy settings blocking storage

### Debug Mode

Enable detailed logging:

```javascript
localStorage.setItem('debug', 'trading:*');
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript strict mode
- Follow React best practices
- Maintain design system consistency
- Add JSDoc comments for complex functions
- Write unit tests for utilities

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [ApexCharts](https://apexcharts.com/) - Chart visualization
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Radix UI](https://www.radix-ui.com/) - Headless UI primitives
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [React Query](https://tanstack.com/query/) - Data fetching
- [Zustand](https://zustand-demo.pmnd.rs/) - State management

## 📞 Support

For questions and support:
- Create an issue on GitHub
- Check the documentation
- Join our Discord community

---

**Built with ❤️ for traders, by traders.**