# LogiDog - Shipment Management System

## Overview
LogiDog is a comprehensive shipment management system designed to provide real-time visibility into shipment statuses with advanced risk assessment and delay detection capabilities.

## Features

### 🚨 At-Risk Shipment Detection
- **Real-time risk assessment** using advanced algorithms
- **SLA monitoring** with automatic deadline tracking
- **Status progression analysis** through shipping pipeline
- **Priority-based risk calculation** for critical shipments

### 🔍 Advanced Filtering & Search
- **Global search** across shipment IDs, types, and locations
- **Multi-criteria filtering** by status, risk level, and type
- **Real-time sorting** by priority, risk, or date
- **Responsive design** for all device types

### 📊 Comprehensive Dashboard
- **Visual risk indicators** with color-coded status badges
- **Priority emojis** for quick scanning (🔴 High, 🟡 Medium, 🟢 Low)
- **SLA countdown** showing days until deadline
- **Statistics overview** with total, at-risk, and overdue counts

## Quick Start

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/your-org/logidog-frontend.git
cd logidog-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. Access the Dashboard
Open your browser and navigate to `http://localhost:5173/dashboard`

## System Architecture

### Frontend Components
- **Dashboard.jsx** - Main dashboard interface
- **Risk Assessment** - JavaScript utility for delay detection
- **Responsive Design** - Mobile-first SCSS styling

### Data Structure
The system uses a normalized database structure with the following key entities:

```javascript
const shipment = {
    id: 'SHP-001',                    // Unique identifier
    createdDate: '2025-01-15T08:00:00Z', // Order creation date
    type: 'consumer goods',           // Shipment type
    slaDays: 5,                       // SLA in days
    status: 'CUSTOMS_HOLD',           // Current status
    riskLevel: 'AtRisk',              // Risk assessment
    expectedDelivery: '2025-01-20T12:00:00Z', // ETA
    lastUpdate: '2025-01-20T10:30:00Z',      // Last update
    delayReason: 'Documentation issues'       // Delay reason
};
```

### Risk Assessment Logic
The system uses a weighted algorithm to determine shipment risk:

1. **SLA Risk (35%)** - Time until delivery deadline
2. **Status Risk (25%)** - Current shipment status
3. **Progression Risk (20%)** - Progress through pipeline
4. **Priority Risk (15%)** - Shipment priority level
5. **Delay Reason Risk (5%)** - Existing delay factors

## API Documentation

### Base URL
```
Production: https://api.logidog.com/v1
Development: https://dev-api.logidog.com/v1
```

### Key Endpoints

#### Get All Shipments
```http
GET /shipments?status=AtRisk&limit=10
```

#### Get Risk Assessment
```http
GET /shipments/{id}/risk
```

#### Real-time Updates
```javascript
// WebSocket connection
const ws = new WebSocket('wss://api.logidog.com/v1/ws/shipments')

// Server-Sent Events
const eventSource = new EventSource('/v1/shipments/events')
```

## Risk Assessment Function

### Core Function
```javascript
import { isShipmentAtRisk, getDetailedRiskAssessment } from './utils/risk-assessment.js'

// Check if shipment is at risk
const isAtRisk = isShipmentAtRisk(shipmentData)

// Get detailed risk breakdown
const riskDetails = getDetailedRiskAssessment(shipmentData)
```

### Example Usage
```javascript
// Test the risk assessment function
import { testRiskAssessment } from './utils/risk-assessment.js'

// Run tests in browser console
testRiskAssessment()
```

### Test Cases
The system includes 4 test scenarios:

1. **High-Risk Shipment** (SHP-001) - Customs hold with documentation issues
2. **Medium-Risk Shipment** (SHP-002) - Weather delays in transit
3. **Low-Risk Shipment** (SHP-003) - Normal warehouse status
4. **Critical Shipment** (SHP-004) - Overdue medical equipment

## Database Schema

### Core Tables
- **shipments** - Main shipment information
- **shipment_statuses** - Status tracking history
- **risk_assessments** - Risk calculations and factors
- **delay_reasons** - Delay tracking and categorization
- **vendors** - Supplier information

### Views
- **dashboard_shipments** - Denormalized data for dashboard
- **at_risk_shipments** - High-risk shipments only
- **dashboard_summary** - Statistical overview

### Stored Procedures
- **AssessShipmentRisk** - Automated risk calculation

## Sample Data

The system includes 15 sample shipments covering various scenarios:

- **Consumer Goods** (5 shipments) - Electronics, clothing, home goods
- **Light Industry** (5 shipments) - Machinery, automotive, semiconductor
- **Medical Equipment** (5 shipments) - Diagnostic tools, surgical instruments

### Risk Distribution
- **At Risk**: 6 shipments (40%)
- **Delayed**: 3 shipments (20%)
- **Safe**: 6 shipments (40%)

## Configuration

### Environment Variables
```bash
# API Configuration
VITE_API_BASE_URL=https://api.logidog.com/v1
VITE_WS_URL=wss://api.logidog.com/v1/ws

# Feature Flags
VITE_ENABLE_REAL_TIME=true
VITE_RISK_ASSESSMENT_INTERVAL=30000
```

### Risk Thresholds
```javascript
const RISK_THRESHOLDS = {
    SLA_URGENT: 1,        // Days until SLA expires
    SLA_WARNING: 3,       // Days until SLA warning
    STATUS_DELAY: 2,      // Days stuck in same status
    WEATHER_IMPACT: 0.8,  // Weather delay multiplier
    CUSTOMS_RISK: 0.9     // Customs delay risk
}
```

## Development

### Project Structure
```
src/
├── pages/
│   └── Dashboard.jsx          # Main dashboard
├── utils/
│   └── risk-assessment.js     # Risk calculation logic
├── data/
│   └── sample-shipments.json  # Sample data
├── services/                   # API services
└── store/                     # Redux state management
```

### Adding New Risk Factors
```javascript
// In risk-assessment.js
function calculateCustomRisk(shipment) {
    // Your custom risk logic
    return riskScore
}

// Add to main function
const customRisk = calculateCustomRisk(shipmentData)
const totalRiskScore = (
    slaRisk * 0.30 +           // Adjust weights
    statusRisk * 0.25 +
    progressionRisk * 0.20 +
    priorityRisk * 0.15 +
    delayReasonRisk * 0.05 +
    customRisk * 0.05          // New factor
)
```

## Testing

### Manual Testing
1. Open browser console
2. Run `testRiskAssessment()`
3. Review risk calculations for each test case

### Automated Testing
```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run risk assessment tests
npm run test:risk
```

## Deployment

### Production Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Docker Deployment
```bash
# Build Docker image
docker build -t logidog-frontend .

# Run container
docker run -p 80:80 logidog-frontend
```

## Monitoring & Analytics

### Key Metrics
- **Risk Detection Accuracy** - Percentage of correctly identified at-risk shipments
- **Response Time** - Time from risk detection to action
- **False Positives** - Incorrect risk assessments
- **SLA Compliance** - On-time delivery rate

### Logging
```javascript
// Risk assessment logs
console.log(`Risk Assessment for ${shipmentData.id}:`, {
    slaRisk: slaRisk.toFixed(3),
    statusRisk: statusRisk.toFixed(3),
    totalRiskScore: totalRiskScore.toFixed(3),
    isAtRisk: isAtRisk
})
```

## Troubleshooting

### Common Issues

#### Risk Assessment Not Working
- Check browser console for errors
- Verify shipment data structure
- Ensure all required fields are present

#### Dashboard Not Loading
- Check API connectivity
- Verify Redux store configuration
- Check network requests in DevTools

#### Real-time Updates Not Working
- Verify WebSocket connection
- Check SSE endpoint availability
- Ensure fallback HTTP polling is enabled

### Debug Mode
```javascript
// Enable debug logging
localStorage.setItem('logidog_debug', 'true')

// View detailed risk calculations
console.log('Debug mode enabled')
```

## Contributing

### Development Guidelines
1. Follow existing code structure
2. Add comprehensive error handling
3. Include unit tests for new features
4. Update documentation for API changes

### Code Style
- Use ES6+ features
- Follow React best practices
- Maintain consistent naming conventions
- Add JSDoc comments for functions

## Support

### Documentation
- **API Docs**: https://api.logidog.com/docs
- **SDK Documentation**: https://docs.logidog.com
- **Technical Specs**: See `DASHBOARD_SPECIFICATION.md`

### Contact
- **Technical Support**: support@logidog.com
- **API Support**: api-support@logidog.com
- **Bug Reports**: github.com/your-org/logidog-frontend/issues

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

### Version 1.0.0 (2025-01-20)
- Initial release
- Dashboard with risk assessment
- Real-time updates via WebSocket/SSE
- Comprehensive filtering and search
- 15 sample shipments with various risk scenarios

---

**LogiDog** - Making logistics smarter, one shipment at a time 🚚📦
