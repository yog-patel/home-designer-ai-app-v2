import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and key from environment
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔧 Supabase Init:');
console.log('URL:', supabaseUrl?.substring(0, 30) + '...');
console.log('Key:', supabaseKey ? 'Set ✓' : 'Missing ✗');

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase credentials. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Export storage bucket name and folder structure
export const BUCKETS = {
  ROOM_IMAGES: 'room-images',
};

// Storage folder structure
export const STORAGE_PATHS = {
  DESIGNS: 'designs',
};

// Test connection (runs once on app init)
export const testSupabaseConnection = async () => {
  try {
    console.log('🧪 Testing Supabase connection...');
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.warn('⚠️ Auth session error (expected):', error.message);
    } else {
      console.log('✅ Supabase connection OK');
    }
  } catch (error: any) {
    console.error('❌ Supabase connection failed:', error.message);
  }
};
