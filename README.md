# Nifty Options Trading Dashboard
*A comprehensive real-time trading interface for intraday NIFTY options analysis and automated execution*

## 🎯 Overview

The Nifty Options Trading Dashboard is a sophisticated React-based frontend application built for professional options traders. It provides real-time market data visualization, advanced technical analysis, options Greeks tracking, risk management tools, and integrated broker connectivity for seamless trading execution.

## 🚀 Key Features

### Real-Time Trading Interface
- **Live Price Feeds**: Real-time NIFTY spot price updates via WebSocket connections
- **Interactive Charts**: TradingView Lightweight Charts with multi-timeframe support (1m, 5m, 15m, 1h, 1d)
- **Technical Indicators**: Comprehensive suite including EMA (9/21/50/200), VWAP, RSI, Stochastic, CPR levels
- **Signal System**: Buy/Sell/Neutral signals with visual markers and risk-reward calculations

### Advanced Options Analytics
- **Greeks Calculator**: Real-time Delta, Gamma, Theta, Vega calculations with visual progress indicators
- **IV Analysis**: Implied Volatility tracking with IV Rank and historical comparisons
- **Strike Selection**: Multiple modes - Closest ATM, ITM+100, OTM-100, Manual, and Ticker input
- **Moneyness Tracking**: Real-time ITM/ATM/OTM status with percentage calculations

### Comprehensive Settings & Customization
- **Dashboard Configuration**: Customizable widget visibility and layout preferences
- **Indicator Settings**: Independent color, thickness, and style controls for each technical indicator
- **Risk Management**: Configurable budget limits, max loss percentages, and position sizing
- **Timeframe Synchronization**: Unified timeframe selection across all chart components

### Trading Tools & Analysis
- **Backtesting Engine**: Historical strategy testing with detailed performance metrics
- **ML Insights**: Machine learning-powered market regime analysis
- **Risk Widgets**: Visual risk-reward ratios and position sizing calculators
- **Pro Tips**: AI-generated trading insights and market commentary

### Broker Integration
- **Multi-Broker Support**: Zerodha and Dhan API integration ready
- **Secure Credential Management**: Encrypted API key storage and management
- **Order Execution**: Direct trade execution capabilities (when backend is connected)

## 🛠️ Technology Stack

### Frontend Core
- **React 18** with TypeScript for type safety
- **Vite** for fast development and optimized builds
- **Zustand** for lightweight state management
- **React Query (TanStack)** for server state and caching

### UI/UX Framework
- **Tailwind CSS** with custom design system tokens
- **shadcn/ui** components for consistent styling
- **Radix UI** primitives for accessibility
- **Lucide React** for iconography

### Charts & Visualization
- **TradingView Lightweight Charts** for high-performance charting
- **Recharts** for additional data visualization
- **Custom chart overlays** for technical indicators

### Data Management
- **Axios** for HTTP client with interceptors
- **WebSocket** integration for real-time data
- **React Hook Form** with Zod validation for forms

## 📁 Project Structure

```
src/
├── components/
│   ├── chart/                    # Chart-related components
│   │   ├── InteractiveChart.tsx     # Main chart component
│   │   ├── ChartControls.tsx       # Chart interaction controls
│   │   ├── ChartIndicators.tsx     # Technical indicators overlay
│   │   └── ModernTradingChart.tsx  # Enhanced chart with indicators
│   │
│   ├── dashboard/                # Dashboard widgets
│   │   ├── MarketInfoCard.tsx      # Market status and trends
│   │   ├── OptionParamsCard.tsx    # Option contract details
│   │   ├── GreeksCard.tsx          # Greeks display with loading states
│   │   ├── PriceAnalysisCard.tsx   # Price breakdown analysis
│   │   ├── ProTipCard.tsx          # AI-generated insights
│   │   ├── RiskWidget.tsx          # Risk management tools
│   │   └── SymbolSelector.tsx      # Instrument selection
│   │
│   ├── layout/                   # Layout components
│   │   ├── MainLayout.tsx          # Main application layout
│   │   ├── TopBar.tsx              # Navigation and controls
│   │   ├── Sidebar.tsx             # Navigation sidebar
│   │   └── MenuBar.tsx             # Menu navigation
│   │
│   ├── settings/                 # Settings panels
│   │   ├── SettingsDrawer.tsx      # Main settings container
│   │   ├── SettingsPanels.tsx      # Organized settings groups
│   │   ├── IndicatorSettings.tsx   # Independent indicator controls
│   │   ├── CompactToggleWidget.tsx # Inline color/style controls
│   │   └── BrokerIntegrationPanel.tsx # Broker configuration
│   │
│   └── ui/                       # Reusable UI components
│       ├── [shadcn components]     # Standard UI components
│       ├── loading-spinner.tsx     # Loading states
│       └── toast.tsx               # Notification system
│
├── hooks/                        # Custom React hooks
│   ├── useApi.ts                   # API integration with error handling
│   ├── useWebSocket.ts             # WebSocket management
│   └── use-toast.ts                # Toast notifications
│
├── store/                        # State management
│   ├── useTradingStore.ts          # Trading data and real-time updates
│   ├── useSettingsStore.ts         # User preferences and configuration
│   └── useChartStore.ts            # Chart state and multi-chart management
│
├── types/                        # TypeScript interfaces
│   ├── api.ts                      # API response types
│   └── settings.ts                 # Settings and configuration types
│
├── pages/                        # Application pages
│   ├── Dashboard.tsx               # Main trading dashboard
│   ├── Backtesting.tsx             # Strategy backtesting
│   ├── MLInsights.tsx              # ML analysis page
│   ├── Logs.tsx                    # System logs and activity
│   └── Settings.tsx                # Global settings
│
└── utils/                        # Utility functions
    ├── chartDataMapper.ts          # Chart data transformation
    └── [other utilities]
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+ or Bun runtime
- Modern web browser with WebSocket support

### Quick Start

```bash
# Clone the repository
git clone [repository-url]
cd nifty-options-dashboard

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun dev

# Open browser to http://localhost:5173
```

### Environment Configuration

Create a `.env.local` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000

# Default Settings
VITE_DEFAULT_SYMBOL=NIFTY
VITE_DEFAULT_TIMEFRAME=5m

# Optional: Theme preference
VITE_THEME=system
```

## 🔗 API Integration

### REST Endpoints

The application expects the following backend endpoints:

```typescript
// Price Data
GET /api/price/current?symbol=NIFTY
GET /api/candles?symbol=NIFTY&tf=5m&start=ISO&end=ISO

// Technical Levels
GET /api/levels/daily?symbol=NIFTY
GET /api/levels/weekly?symbol=NIFTY
GET /api/levels/monthly?symbol=NIFTY

// Indicators & Signals
GET /api/indicators?symbol=NIFTY
GET /api/signal/current?symbol=NIFTY

// Options & Greeks
GET /api/greeks?optionSymbol=NIFTY24DEC21000CE

// Backtesting
POST /api/backtest
Body: { symbol, from, to, timeframe, paramsOverride? }

// ML Insights
GET /api/ml/insight?symbol=NIFTY

// Logs & Activity
GET /api/logs/recent?limit=100

// User Settings
GET /api/user/settings
POST /api/user/settings

// Broker Integration
POST /api/broker/keys
POST /api/trade/execute
```

### WebSocket Channels

```typescript
// Real-time price updates
/ws/price → { type: "price", data: PriceData }

// Trading signals
/ws/signal → { type: "signal", data: SignalData }

// System logs
/ws/logs → { type: "log", data: LogData }
```

## 🎨 Design System

### Color Tokens

The application uses a semantic color system defined in `src/index.css`:

```css
:root {
  /* Trading Colors */
  --bull-green: 142 76% 36%;     /* Bullish movements */
  --bear-red: 0 84% 60%;         /* Bearish movements */
  --neutral-yellow: 48 96% 53%;  /* Neutral signals */
  
  /* UI Colors */
  --primary: 221 83% 53%;        /* Primary brand color */
  --secondary: 210 40% 98%;      /* Secondary elements */
  --muted: 210 40% 96%;          /* Muted backgrounds */
  --accent: 210 40% 94%;         /* Accent highlights */
  
  /* State Colors */
  --success: 142 76% 36%;        /* Success states */
  --warning: 48 96% 53%;         /* Warning states */
  --destructive: 0 84% 60%;      /* Error states */
}
```

### Component Variants

Each UI component supports multiple variants for different contexts:

```typescript
// Button variants
<Button variant="default | destructive | outline | secondary | ghost | link" />

// Badge variants  
<Badge variant="default | secondary | destructive | outline" />

// Card styling
<Card className="trading-card" /> // Special trading context styling
```

## 🔧 Advanced Features

### Independent Indicator Controls

Each technical indicator has independent configuration:

- **Color Selection**: Custom color picker for each indicator line
- **Line Thickness**: Multiple thickness options (1px to 5px)
- **Line Style**: Solid, dashed, dotted, and symbol overlays
- **Visibility Toggle**: Show/hide individual indicators

### Multi-Chart Support

The dashboard supports multiple chart instances:

```typescript
// Add additional charts for comparison
const { addChart, removeChart } = useChartStore();

// Each chart maintains independent timeframe
<InteractiveChart chart={chart} onRemove={() => removeChart(chart.id)} />
```

### Real-Time Synchronization

All components automatically sync with the selected timeframe:

```typescript
// Timeframe changes propagate to all chart widgets
const { selectedTimeframe, setSelectedTimeframe } = useTradingStore();
```

### Error Handling & Toast Notifications

Comprehensive error handling with user-friendly notifications:

```typescript
// Automatic toast notifications for API errors
import { toast } from "@/hooks/use-toast";

// Success notification
toast({
  title: "Success",
  description: "Settings saved successfully",
});

// Error notification
toast({
  title: "Error",
  description: "Failed to load data",
  variant: "destructive",
});
```

### Loading States

Consistent loading indicators across all components:

```typescript
import { LoadingSpinner, LoadingCard } from "@/components/ui/loading-spinner";

// Inline spinner
<LoadingSpinner size="md" />

// Card with loading message
<LoadingCard>Loading market data...</LoadingCard>
```

## 🧪 Testing & Quality

### Type Safety

Strict TypeScript configuration ensures type safety:

```bash
# Type checking
npm run type-check
bun run type-check
```

### Linting & Formatting

```bash
# Lint code
npm run lint
bun run lint

# Format code
npm run format
bun run format
```

### Build Optimization

```bash
# Production build
npm run build
bun run build

# Preview build locally
npm run preview
bun run preview
```

## 🚀 Deployment

### Static Build Deployment

The application builds to a static bundle suitable for any hosting provider:

```bash
# Build for production
npm run build

# Deploy dist/ folder to:
# - Vercel
# - Netlify  
# - AWS S3 + CloudFront
# - GitHub Pages
# - Any static hosting service
```

### Environment Variables for Production

```env
VITE_API_BASE_URL=https://your-api-domain.com
VITE_WS_URL=wss://your-websocket-domain.com
```

## 🔮 Recent Updates & Improvements

### Latest Enhancements (v2.0)

#### UI/UX Improvements
- ✅ **Compact Settings Layout**: Consolidated color, thickness, and style controls into single-line widgets
- ✅ **Independent Indicator Controls**: Each technical indicator now has separate configuration
- ✅ **Enhanced Timeframe Sync**: All chart components automatically sync with menu bar timeframe selection
- ✅ **Improved Loading States**: Consistent loading spinners and skeleton screens across all components

#### Feature Additions
- ✅ **Potential Entry Zone Visualization**: Added shaded areas on charts to highlight entry opportunities
- ✅ **Advanced Strike Selection**: Added ticker input support with TradingView and NSE format options
- ✅ **Expiry Date Selection**: Calendar picker for manual option expiry date selection
- ✅ **Broker Integration Separation**: Moved broker settings to dedicated tab for better organization

#### Technical Improvements
- ✅ **Toast Notification System**: Comprehensive error handling with user-friendly notifications
- ✅ **WebSocket Message Parsing**: Enhanced real-time data handling for price, signal, and log messages
- ✅ **API Error Handling**: Automatic retry logic and graceful degradation
- ✅ **TypeScript Enhancements**: Improved type safety across all components

#### Design System Updates
- ✅ **Semantic Color Tokens**: Consistent theming using HSL color variables
- ✅ **Component Variants**: Enhanced styling options for different contexts
- ✅ **Responsive Design**: Improved mobile and tablet experiences
- ✅ **Dark/Light Mode**: Complete theme support with smooth transitions

## 🛠️ Development Guidelines

### Code Organization

- **Component Structure**: Each component should be focused and reusable
- **State Management**: Use appropriate stores for different data types
- **Type Safety**: All props and data should be properly typed
- **Error Boundaries**: Implement proper error handling at component level

### Performance Best Practices

- **Memoization**: Use React.memo for expensive components
- **Virtual Scrolling**: Implement for large data lists
- **Lazy Loading**: Code split pages and heavy components
- **WebSocket Optimization**: Efficient message handling and reconnection logic

### Styling Guidelines

- **Design Tokens**: Always use semantic color variables
- **Component Variants**: Create reusable styling variants
- **Responsive Design**: Mobile-first approach with breakpoint helpers
- **Accessibility**: Ensure proper ARIA labels and keyboard navigation

## 📋 Roadmap

### Upcoming Features
- 🔄 **Enhanced ML Integration**: Advanced sentiment analysis and pattern recognition
- 🔄 **Mobile App**: React Native version for iOS and Android
- 🔄 **Advanced Backtesting**: Multi-strategy comparison and optimization
- 🔄 **Social Trading**: Community signals and strategy sharing

### Technical Debt
- 🔄 **Test Coverage**: Comprehensive unit and integration tests
- 🔄 **Performance Monitoring**: Real-time performance analytics
- 🔄 **Documentation**: Interactive component documentation
- 🔄 **Accessibility Audit**: WCAG 2.1 AA compliance

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes following the coding guidelines
4. Add tests for new functionality
5. Ensure all checks pass: `npm run lint && npm run type-check`
6. Submit a pull request with a clear description

### Commit Convention

Use conventional commits for better changelog generation:

```bash
feat: add new indicator settings panel
fix: resolve timeframe synchronization issue
docs: update API documentation
style: improve component styling consistency
refactor: optimize chart rendering performance
test: add unit tests for trading store
```

## 📄 License

This project is proprietary software. For licensing inquiries, please contact the repository owner.

## 🙏 Acknowledgments

- **TradingView** for the excellent Lightweight Charts library
- **shadcn/ui** for the beautiful component system
- **Radix UI** for accessibility-first primitives
- **Zustand** for simple and effective state management

---

**Happy Trading! 📈🚀**

*Built with ❤️ for professional options traders*
