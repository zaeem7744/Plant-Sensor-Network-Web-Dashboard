# Plant Sensor Network - Web Dashboard

Real-time monitoring dashboard for Plant Sensor Network built with React, TypeScript, and Vite.

## 🌟 Features

- **Real-time Sensor Monitoring**: Live updates every few seconds
- **Historical Charts**: Interactive graphs with configurable time ranges
- **Category Filtering**: Filter sensors by Environment, Gas, Soil, Temperature, Light
- **Status Indicators**: Visual online/offline status for each sensor
- **Persistent Values**: Last known readings displayed even when device offline
- **Statistics Dashboard**: 24-hour averages, min/max values, total measurements
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean interface with Tailwind CSS and shadcn/ui components

## 📋 Requirements

- Node.js 16 or higher
- npm or yarn
- Backend API server running (see backend repository at `D:\Projects\plant-sensor-backend`)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Backend URL

Create/edit `.env` file in project root:

```env
VITE_BACKEND_URL=http://YOUR_PC_IP:8000
```

**Important**: Replace `YOUR_PC_IP` with actual IP address of backend server.

**Examples**:
```env
# Local development (backend on same machine)
VITE_BACKEND_URL=http://localhost:8000

# LAN access (backend on different machine)
VITE_BACKEND_URL=http://192.168.1.100:8000
```

### 3. Start Development Server

```bash
npm run dev
```

**Dashboard opens at**: `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

Production files generated in `dist/` folder.

## 📱 Dashboard Pages

### 1. Overview (`/`)

**Features**:
- System statistics (total sensors, online/offline counts)
- Total measurements in database
- 24-hour average temperature and humidity
- Quick system health overview

### 2. Sensors (`/sensors`)

**Features**:
- Grid of sensor cards showing latest readings
- Green indicator: Device online (data within 10 seconds)
- Gray indicator: Device offline (no data for >10 seconds)
- Last known values always displayed (even when offline)
- Filter buttons: All, Environment, Gas, Soil, Temperature, Light
- "Last seen" timestamps for each sensor
- Click any sensor card to view details

**Sensors Displayed**:
- **MS8607**: Temperature, Humidity, Pressure
- **BH1750**: Light intensity
- **MLX90614**: IR object temperature
- **Soil Moisture**: Capacitive moisture sensor
- **Alcohol**: Alcohol concentration
- **CH4**: Methane
- **Soil EC+pH**: Electrical conductivity and pH
- **HCHO**: Formaldehyde
- **MultiGas**: H₂S, O₂, NH₃, CO, O₃

### 3. Sensor Detail (`/sensors/:sensorId`)

**Features**:
- Historical line charts for all sensor parameters
- Time range selector: 1h, 6h, 12h, 24h, 7d, 30d
- Statistics panel: Min, Max, Average, Data points
- Real-time updates (chart refreshes automatically)
- Multiple parameters per sensor (e.g., Temperature, Humidity, Pressure for MS8607)

## ⚙️ Configuration

### Change Backend URL

Edit `.env`:
```env
VITE_BACKEND_URL=http://NEW_IP:8000
```

Restart dev server after changes.

### Adjust Polling Interval

Edit `src/hooks/useSensorData.ts`:

```typescript
// Default: Fetch every 5 seconds
const { data, error, isLoading } = useSWR(
  '/api/sensors/current',
  fetcher,
  { refreshInterval: 5000 }  // Change to desired milliseconds
);
```

**Examples**:
- 2 seconds: `2000`
- 5 seconds: `5000` (default)
- 10 seconds: `10000`

## 🏗️ Project Structure

```
src/
├── components/
│   ├── SensorCard.tsx          # Individual sensor display card
│   ├── StatusBadge.tsx         # Online/offline indicator
│   ├── layout/
│   │   ├── AppLayout.tsx       # Main layout wrapper
│   │   └── AppSidebar.tsx      # Navigation sidebar
│   └── ui/                     # shadcn/ui components
├── hooks/
│   ├── useSensorData.ts        # Fetch current sensor data
│   ├── useSensorHistory.ts     # Fetch historical data
│   └── useOverview.ts          # Fetch system overview
├── lib/
│   ├── sensors.ts              # Sensor configuration
│   ├── api.ts                  # API client setup
│   └── utils.ts                # Utility functions
├── pages/
│   ├── Dashboard.tsx           # Overview page
│   ├── Sensors.tsx             # Sensor list page
│   ├── SensorDetail.tsx        # Individual sensor detail
│   └── NotFound.tsx            # 404 page
├── App.tsx                     # Main app component
└── main.tsx                    # Entry point
```

## 🧰 Troubleshooting

### Dashboard Shows "No Data"

**Possible Causes**:
1. Backend not running
2. Wrong backend URL in `.env`
3. CORS issues
4. Network connectivity

**Solutions**:
```bash
# 1. Check backend is running
curl http://YOUR_PC_IP:8000/api/sensors/current

# 2. Verify .env file
cat .env

# 3. Check browser console (F12) for errors

# 4. Restart dev server
npm run dev
```

### Sensors Show Offline

- Check if ESP32 has sent data within last 10 seconds
- Verify backend online threshold setting (default: 10 seconds)
- Last known values still display even when offline (this is expected)

### Charts Not Loading

**Error: "Failed to fetch history"**
- Backend endpoint `/api/sensors/history` not responding
- Wrong sensor name passed to API
- Check browser console for detailed error message

### Build Errors

**Type errors**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Environment variable not available**:
- Must restart dev server after changing `.env`
- Use `VITE_` prefix for all environment variables

### Port Already in Use

**Error: "Port 5173 is already in use"**

Change port in `vite.config.ts`:
```typescript
export default defineConfig({
  server: {
    port: 3000  // Use different port
  }
})
```

## 📦 Build and Deploy

### Development Build

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

Output in `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

### Deploy to Static Hosting

**Options**:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

**Important**: Update `.env` with production backend URL before building.

## 🔌 API Integration

### SWR Data Fetching

Dashboard uses [SWR](https://swr.vercel.app/) for efficient data fetching with automatic revalidation and error retry.

### API Endpoints Used

| Endpoint | Hook | Refresh Interval |
|----------|------|------------------|
| `/api/sensors/current` | `useSensorData()` | 5 seconds |
| `/api/sensors/history` | `useSensorHistory()` | 10 seconds |
| `/api/overview` | `useOverview()` | 10 seconds |

## 📊 Data Display Logic

### Online/Offline Status

- **Green badge**: Backend reports `online: true` (data within 10 seconds)
- **Gray badge**: Backend reports `online: false` (data older than 10 seconds)

**Important**: Status badge reflects real-time connection, but **last values always display** for UX consistency.

### Last Seen Timestamps

Human-readable format using `date-fns`:
- "just now" (< 5 seconds)
- "5 seconds ago"
- "2 minutes ago"
- "1 hour ago"
- "2 days ago"

## 🔗 Related Components

This dashboard works with:
- **ESP32-S3 Firmware**: `D:\Projects\Plant Monitoring Sensor Network\Firmware\Plant Sensor Network\`
- **FastAPI Backend**: `D:\Projects\plant-sensor-backend\`

See main project documentation at `D:\Projects\Plant Monitoring Sensor Network\Delivery Documents\` for complete system setup.

## 📝 Technologies Used

- **React 18**: UI framework
- **TypeScript**: Type-safe JavaScript
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality UI components
- **SWR**: Data fetching and caching
- **Recharts**: Charting library
- **React Router**: Client-side routing
- **Lucide React**: Icon library
- **date-fns**: Date formatting

## 📜 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## 🙏 Acknowledgments

Built with modern React ecosystem tools for optimal performance and developer experience.

---

**Dashboard Version**: 1.0  
**Last Updated**: February 2026  
**Framework**: React 18 + Vite  
**Language**: TypeScript  
**UI**: Tailwind CSS + shadcn/ui
