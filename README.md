# Nifty Options Trading Platform

A comprehensive frontend React application for intraday Nifty Options trading with real-time charts, advanced technical analysis, and portfolio management tools.

## 🚀 Technology Stack

- **Framework**: React 18+ with Vite
- **Language**: TypeScript
- **State Management**: Zustand + React Query (TanStack Query)
- **Charts**: TradingView Lightweight Charts™ (high-performance live charts)
- **UI Library**: TailwindCSS + shadcn/ui components
- **Forms**: React Hook Form + Zod validation
- **Routing**: React Router v6
- **Icons**: Lucide React

## ⚡ Key Features

### Real-time Trading Dashboard
- **Live Charts**: TradingView Lightweight Charts™ with real-time data
- **Multi-Chart Support**: Add/remove multiple charts for different symbols
- **Technical Indicators**: EMA (9/21/50/200), VWAP, RSI, Stochastic, CPR, Pivot Levels
- **Interactive Controls**: Zoom, pan, hover tooltips with OHLCV data
- **Signal Integration**: Live buy/sell signals with entry/exit markers
- **Risk Management**: Visual SL/TP markers and RR ratio display

### Advanced Settings & Configuration
- **Trading Parameters**: Customizable ATR period, ORB window, EMA periods
- **Indicator Controls**: Granular control over each indicator component
- **CPR Settings**: Individual toggles for Pivot, TC, BC, R1-R3, S1-S3
- **Risk Management**: Budget limits, max loss per trade, default quantities
- **Broker Integration**: API key management for Zerodha/Dhan (UI ready)

### Professional Analysis Tools
- **Technical Analysis**: RSI, MACD, Bollinger Bands, Moving Averages
- **Market Sentiment**: Put-Call Ratio, VIX analysis, Market Breadth
- **Volatility Analysis**: IV Surface, IV Rank, Volatility Smile
- **Strategy Builder**: 8 popular options strategies with payoff diagrams
- **Backtesting**: Historical strategy performance with equity curves

### Application Pages
- **Dashboard**: Main trading interface with live charts and widgets
- **Analysis**: Advanced technical and sentiment analysis tools
- **Calculator**: Options pricing, Greeks calculator, strategy analyzer
- **Backtesting**: Historical performance testing with detailed metrics
- **ML Insights**: AI-powered market regime classification
- **Signals**: Live signal feed with history and filters
- **Profile**: User preferences and account management
- **Settings**: Comprehensive configuration for all app features

## 📊 Data Format Standards

All chart and market data follows standardized field names:

### Candle Data Format
```typescript
{
  time: string | number,  // Unix timestamp or ISO8601
  open: number,
  high: number,
  low: number,
  close: number,
  volume?: number
}
```

### Price Data Format
```typescript
{
  symbol: string,
  close: number,        // Current price (standardized from lastPrice)
  time: string,         // Timestamp (standardized from timestamp)
  change?: number,
  changePercent?: number
}
```

### Indicator Data Format
```typescript
{
  ema: {
    9: Array<{time: string|number, value: number}>,
    21: Array<{time: string|number, value: number}>,
    50: Array<{time: string|number, value: number}>,
    200: Array<{time: string|number, value: number}>
  },
  vwap: Array<{time: string|number, value: number}>,
  rsi: Array<{time: string|number, value: number}>,
  // ... other indicators with full history arrays
}
```

## 🛠 Setup & Installation

```bash
# Clone the repository
git clone <repository-url>
cd nifty-options-trading-platform

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Configuration

### Environment Variables
```env
VITE_API_BASE_URL=http://localhost:8000  # Backend API URL
VITE_WS_URL=ws://localhost:8000          # WebSocket URL
```

### API Integration
The frontend expects the following backend endpoints:

#### REST Endpoints
- `GET /api/price/current?symbol=string`
- `GET /api/candles?symbol=string&tf=1m|5m|15m|1d&start=ISO&end=ISO`
- `GET /api/levels/daily?symbol=string`
- `GET /api/indicators?symbol=string`
- `GET /api/signal/current?symbol=string`
- `GET /api/greeks?optionSymbol=string`
- `POST /api/backtest`
- `GET /api/ml/insight?symbol=string`
- `GET /api/logs/recent?limit=100`
- `POST /api/user/settings`
- `POST /api/broker/keys`
- `POST /api/trade/execute`

#### WebSocket Channels
- `/ws/price` - Real-time price updates
- `/ws/signal` - Live signal notifications
- `/ws/logs` - Streaming log messages

### Chart Parameters
Users can configure technical analysis parameters:
- **ATR Period**: 1-50 (default: 14)
- **ORB Window**: 5-60 minutes (default: 15)
- **EMA Periods**: Customizable periods (default: 9, 21, 50, 200)
- **RSI Period**: 2-50 (default: 14)
- **Stochastic %K/%D**: Configurable periods
- **Volume Threshold**: 100-500% of average

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Theme**: System preference detection with manual toggle
- **Modern Layout**: Clean, professional TradingView-inspired interface
- **Real-time Updates**: Live data feeds with connection status indicators
- **Interactive Charts**: Zoom, pan, hover tooltips, crosshair
- **Customizable Widgets**: Configurable refresh rates and display options
- **Error Handling**: Toast notifications with retry mechanisms

## 📱 Mobile Support

- Responsive chart layouts
- Touch-friendly controls
- Collapsible sidebar navigation
- Optimized performance for mobile devices

## 🔒 Security Features

- Secure API key storage (UI only - encryption handled by backend)
- Input validation with Zod schemas
- CORS protection ready
- Rate limiting awareness in UI

## 📈 Performance

- **Lightweight Charts**: TradingView's high-performance charting library
- **React Query**: Intelligent caching and background updates
- **Code Splitting**: Lazy-loaded routes and components
- **Optimized Rendering**: Memoized computations and minimal re-renders
- **Bundle Optimization**: Tree-shaking and modern JS output

## 🧪 Testing & Development

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format

# Development mode with mock data
npm run dev:mock
```

## 🚀 Deployment

The application builds to static files and can be deployed to:
- Vercel, Netlify, or similar static hosting
- CDN with custom domain support
- Self-hosted with nginx/Apache

```bash
npm run build
# Output: dist/ folder ready for deployment
```

## 🔌 Backend Integration

This frontend is designed to work with a FastAPI backend that provides:
- Real-time market data integration (Finnhub, Alpha Vantage)
- Technical indicator calculations
- Options Greeks computation
- Signal generation algorithms
- Broker API integrations
- User data persistence

## 📋 Implementation Status

**Frontend Completion**: ~100%
- ✅ All UI components implemented
- ✅ TradingView Lightweight Charts integrated
- ✅ Complete settings and configuration
- ✅ All application pages functional
- ✅ Responsive design with mobile support
- ✅ Standardized data format throughout

**Remaining**: Backend API connections and real-time data streams

## 🤝 Contributing

1. Follow TypeScript strict mode
2. Use semantic tokens from design system
3. Maintain responsive design patterns
4. Add proper error handling
5. Update documentation for new features

## 📄 License

This project is proprietary software for internal use.

## 🆘 Support

For technical issues or feature requests, please refer to the project documentation or contact the development team.
