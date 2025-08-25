import { supabase } from '../src/lib/supabase';
import fs from 'fs';

// Replace with your Adima portal data source (API endpoint or local file)
const ADIMA_DATA_PATH = './adima_data.json';

async function importAdimaPandals() {
  // Read Adima data from file (or fetch from API)
  const rawData = fs.readFileSync(ADIMA_DATA_PATH, 'utf-8');
  const pandals = JSON.parse(rawData);

  for (const pandal of pandals) {
    const { data, error } = await supabase
      .from('pandals')
      .insert([
        {
          name: pandal.name,
          description: pandal.description,
          address: pandal.address,
          latitude: pandal.latitude,
          longitude: pandal.longitude,
          contact: pandal.contact,
          timings: pandal.timings,
          special_features: pandal.special_features,
          rating: pandal.rating,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);
    if (error) {
      console.error('Error inserting pandal:', error.message);
    } else {
      console.log('Inserted pandal:', pandal.name);
    }
  }
}

importAdimaPandals();
