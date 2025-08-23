# ![marker](public/markers/img1.png)

A modern navigation app to help devotees find and navigate to Ganapati pandals during the festival. Built with Next.js, Supabase, and Leaflet.js.

## 🚀 Features

- **Interactive Map**: View all Ganapati pandals on an interactive OpenStreetMap
- **Location-based Search**: Find pandals near your current location
- **Detailed Information**: View pandal details, timings, contact info, and special features
- **Navigation**: Get directions to any pandal using Google Maps
- **Admin Panel**: Password-protected admin interface for adding new pandals
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Festival Theme**: Beautiful saffron and red themed UI celebrating Ganapati
- **Free Database**: Uses Supabase PostgreSQL with generous free tier

## 🛠 Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Maps**: Leaflet.js with OpenStreetMap
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel (Frontend) + Supabase (Backend)

## ⚡ Quick Start (5 Minutes)

### Prerequisites
- Node.js 18+ installed
- Free Supabase account

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd MapMyGanapati
npm install
```

### 2. Setup Supabase (Free Database)

**Create Project:**
1. Go to [supabase.com](https://supabase.com) → "New Project"
2. Name: `map-my-ganapati`
3. Generate strong password
4. Choose region → "Create project"

**Get Credentials:**
1. Go to Settings → API
2. Copy Project URL and Anon Key

**Create Database:**
1. Go to SQL Editor
2. Paste and run this:

```sql
CREATE TABLE pandals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  contact TEXT,
  website TEXT,
  timings TEXT NOT NULL,
  special_features TEXT[],
  image_url TEXT,
  rating NUMERIC(2,1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX idx_pandals_location ON pandals (latitude, longitude);
CREATE INDEX idx_pandals_name ON pandals (name);
CREATE INDEX idx_pandals_rating ON pandals (rating DESC);

-- Enable Row Level Security
ALTER TABLE pandals ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON pandals
  FOR SELECT USING (true);

-- Create policy to allow public insert (for demo purposes)
CREATE POLICY "Allow public insert" ON pandals
  FOR INSERT WITH CHECK (true);
```

### 3. Configure Environment

```bash
# Copy example file
cp env.example .env.local

# Edit .env.local with your Supabase credentials:
# NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Setup Database & Run

```bash
# Test database connection
npm run setup-db

# Add sample pandal data
npm run seed

# Start development server
npm run dev
```

**🎉 Open http://localhost:3000 - Your app is ready!**

## 🔧 Demo Mode (No Database Setup)

For immediate testing without database setup:

### Option 1: Create Local Environment File
Create `.env.local` with:
```bash
# Demo mode - uses fallback data instead of database
NEXT_PUBLIC_SUPABASE_URL=demo-mode
NEXT_PUBLIC_SUPABASE_ANON_KEY=demo-mode
```

### Option 2: Use Debug Panel
1. Open `http://localhost:3000`
2. Look for "🐛 Debug Panel" in top-right corner
3. Click "Test Data Loading" to load 8 Pune pandals
4. Check browser console (F12) for detailed logs

## 🛡️ Admin Panel

### Access Information
- **Admin Panel URL:** `http://localhost:3000/admin`
- **Default Password:** `ganapati2024`

### Features
- **Security**: Password-protected access with session management
- **Location Capture**: GPS coordinates with current location button
- **Pandal Management**: Add new pandals with complete information
- **Real-time Updates**: New pandals appear immediately on main map
- **Mobile Support**: Responsive design for mobile devices

### Usage
1. Go to `http://localhost:3000/admin`
2. Enter password: `ganapati2024`
3. Fill in pandal details and capture location
4. Click "Add Pandal to Database"
5. Return to main map to see new pandal

### Configuration
Add to `.env.local` for custom admin password:
```bash
NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password_here
```

## 🗺️ Sample Data

The app includes sample data for famous Ganapati pandals:

**Mumbai Pandals:**
- **Lalbaugcha Raja** - The most famous pandal in Mumbai
- **Ganesh Galli Mumbaicha Raja** - Historic pandal with traditional celebrations
- **GSB Seva Mandal King Circle** - Known for creative thematic decorations
- **Khetwadi Cha Ganraj** - Features one of the tallest Ganapati idols

**Pune Pandals:**
- **Shri Kasba Ganpati** - First among Pune's Manache Ganpati
- **Dagdusheth Halwai Ganpati** - Most famous Pune pandal
- **Tambdi Jogeshwari Ganpati** - Historic pandal
- **Tulshibaug Ganpati** - Traditional celebrations

## 🌐 Deployment (Free Hosting)

### Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Then redeploy: vercel --prod
```

Your app will be live at `https://your-app.vercel.app`

### Cost Breakdown
- **Frontend**: Vercel (generous free tier)
- **Database**: Supabase (500MB database, 2GB bandwidth free)
- **Maps**: OpenStreetMap (completely free)
- **Total Cost**: $0/month for reasonable usage

## 📱 Usage

1. **Allow Location Access**: Click "Find Nearby Pandals" to enable location services
2. **Explore Pandals**: View pandal markers on the map (🐘 icons)
3. **Get Details**: Click on any marker to see pandal information
4. **Navigate**: Use the "Get Directions" button to open navigation in Google Maps
5. **Admin Access**: Use `/admin` route to add new pandals

## 🔧 Development

### Project Structure
```
src/
├── app/                 # Next.js app router
│   ├── admin/          # Admin panel
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Main page
├── components/          # React components
│   ├── Map.tsx         # Main map component
│   ├── Header.tsx      # App header
│   └── ...
├── lib/                # Utilities and services
│   ├── supabase.ts     # Database client
│   ├── pandalService.ts # Data operations
│   └── ...
├── types/              # TypeScript definitions
└── ...
```

### Key Components
- `Map.tsx`: Main map component with Leaflet
- `Header.tsx`: App header with location controls
- `SimpleLocationButton.tsx`: Geolocation functionality
- `pandalService.ts`: Supabase data operations
- `CrowdSummary.tsx`: Pandal information display

### Data Structure
```typescript
interface PandalLocation {
  id: string
  name: string
  description: string
  address: string
  latitude: number
  longitude: number
  contact?: string
  website?: string
  timings: string
  special_features?: string[]
  image_url?: string
  rating?: number
  created_at: Date
  updated_at: Date
}
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run seed` - Add sample pandal data
- `npm run setup-db` - Test database connection
- `npm run fetch-google` - Fetch data from Google Places API

## 🐛 Troubleshooting

### Common Issues

**Map not loading:**
- Check if Leaflet CSS is properly imported
- Verify browser console for JavaScript errors

**Location not working:**
- Ensure HTTPS in production for geolocation API
- Allow location permissions in browser
- Check GPS/location services are enabled

**Database errors:**
- Verify environment variables in `.env.local`
- Check Supabase policies and connection
- Use `npm run setup-db` to test connection

**Admin panel issues:**
- Default password is `ganapati2024`
- Check if custom password is set in environment
- Clear browser cache and try again

**Build errors:**
- Check Node.js version (requires 18+)
- Verify all dependencies are installed
- Check TypeScript configuration

### Development Tips
- Use browser DevTools to debug location permissions
- Check Supabase dashboard for database activity
- Use Vercel deployment logs for production debugging
- Test database connection with `npm run setup-db`
- Check browser console for detailed error messages

### Demo Mode Testing
If using demo mode, you should see:
- 8 Pune Ganapati Pandals loaded
- Map centered on Pune (18.52, 73.86)
- Orange elephant markers (🐘) for each pandal
- Console messages starting with `📝 Using fallback data`

## 🔐 Security

For production use:
- Restrict Supabase Row Level Security policies
- Add authentication for admin features
- Use environment variables for all configuration
- Enable HTTPS everywhere
- Use strong admin passwords
- Implement proper session management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Add your changes with proper testing
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Submit a pull request

### Development Guidelines
- Follow TypeScript best practices
- Add proper error handling
- Test on both desktop and mobile
- Maintain responsive design
- Document new features

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- OpenStreetMap for map data
- Leaflet.js for mapping functionality
- Supabase for backend services
- Vercel for hosting
- All the Ganapati mandals and devotees who make this festival special

---

**Ganpati Bappa Morya! 🙏**

Built with ❤️ for the Ganapati festival community.
