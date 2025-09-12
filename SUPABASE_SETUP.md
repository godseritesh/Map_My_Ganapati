# Supabase Database Setup Guide

## Step 1: Create the Mandals Table

In your Supabase dashboard, go to the **SQL Editor** and run this SQL:

```sql
-- Create the mandals table
CREATE TABLE mandals (
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
CREATE INDEX idx_mandals_location ON mandals (latitude, longitude);
CREATE INDEX idx_mandals_name ON mandals (name);
CREATE INDEX idx_mandals_rating ON mandals (rating DESC);

-- Enable Row Level Security
ALTER TABLE mandals ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY \"Allow public read access\" ON mandals
  FOR SELECT USING (true);

-- Create policy to allow public insert (for demo purposes)
CREATE POLICY \"Allow public insert\" ON mandals
  FOR INSERT WITH CHECK (true);

-- Create policy to allow public update (for admin purposes)
CREATE POLICY \"Allow public update\" ON mandals
  FOR UPDATE USING (true);
```

## Step 2: Insert Sample Data

Run this SQL to add some sample Ganpati mandals:

```sql
-- Insert sample mandal data for Pune
INSERT INTO mandals (name, description, address, latitude, longitude, contact, timings, special_features, rating) VALUES
(
  'Dagdusheth Halwai Ganpati',
  'One of the most famous Ganpati mandals in Pune, known for its rich history and beautiful decorations.',
  'Dagdusheth Halwai Ganpati Trust, Budhwar Peth, Pune',
  18.5158,
  73.8567,
  '+91-20-2445-2969',
  '5:00 AM - 11:00 PM',
  ARRAY['Historic Temple', 'Gold Decoration', 'Cultural Programs'],
  4.8
),
(
  'Kasba Ganpati',
  'The first Ganpati of Pune, established in 1893. It is considered the presiding deity of the city.',
  'Kasba Peth, Pune',
  18.5138,
  73.8610,
  '+91-20-2445-3098',
  '4:30 AM - 11:30 PM',
  ARRAY['First Ganpati of Pune', 'Traditional Celebrations', 'Historic Significance'],
  4.9
),
(
  'Tambdi Jogeshwari Ganpati',
  'Known for its magnificent decorations and the famous Dhol-Tasha performances.',
  'Tambdi Jogeshwari, Budhwar Peth, Pune',
  18.5164,
  73.8551,
  '+91-20-2445-7821',
  '5:30 AM - 11:00 PM',
  ARRAY['Dhol-Tasha', 'Elaborate Decorations', 'Cultural Events'],
  4.7
),
(
  'Guruji Talim Ganpati',
  'Famous for its simple yet elegant celebrations and community participation.',
  'Guruji Talim, Pune',
  18.5201,
  73.8567,
  '+91-20-2445-9876',
  '6:00 AM - 10:30 PM',
  ARRAY['Community Participation', 'Simple Celebrations', 'Local Favorite'],
  4.5
),
(
  'Tulshibaug Ganpati',
  'One of the Manache Ganpati (revered Ganpatis) of Pune with beautiful floral decorations.',
  'Tulshibaug, Pune',
  18.5178,
  73.8523,
  '+91-20-2445-3456',
  '5:00 AM - 11:00 PM',
  ARRAY['Floral Decorations', 'Manache Ganpati', 'Traditional Music'],
  4.6
);
```

## Step 3: Verify the Setup

After running the SQL, you can verify your setup by:

1. **Check the table in Supabase**:
   - Go to **Table Editor** in your Supabase dashboard
   - You should see the `mandals` table with sample data

2. **Test the connection from your app**:
   ```bash
   npm run setup-db
   ```

## Security Notes

- The policies above allow public read/write for demo purposes
- In production, you should restrict write access to authenticated users only
- Consider adding more specific RLS policies based on your requirements

## Troubleshooting

If you encounter issues:

1. **Check your environment variables** in `.env.local`
2. **Verify your Supabase URL and key** are correct
3. **Ensure the table exists** in your Supabase dashboard
4. **Check network connectivity** to Supabase