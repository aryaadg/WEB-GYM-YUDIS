import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const dokuClientId = process.env.DOKU_CLIENT_ID;
  const dokuEnv = process.env.DOKU_ENVIRONMENT;

  // Test koneksi Supabase langsung dari server
  let supabaseStatus = 'Not tested';
  let supabaseError = null;
  let bookingsCount = null;

  if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder')) {
    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { count, error } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true });

      if (error) {
        supabaseStatus = 'QUERY_ERROR: ' + error.message;
        supabaseError = error.message;
      } else {
        supabaseStatus = 'CONNECTED - bookings rows: ' + count;
        bookingsCount = count;
      }
    } catch (e: unknown) {
      supabaseStatus = 'FETCH_FAILED: ' + (e instanceof Error ? e.message : String(e));
    }
  } else {
    supabaseStatus = 'URL_MISSING_OR_PLACEHOLDER';
  }

  return NextResponse.json({
    env_status: {
      NEXT_PUBLIC_SUPABASE_URL: supabaseUrl ? 'SET: ' + supabaseUrl : 'MISSING',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey ? 'SET (' + supabaseAnonKey.length + ' chars)' : 'MISSING',
      SUPABASE_SERVICE_ROLE_KEY: serviceRole
        ? 'SET (' + serviceRole.length + ' chars)' + (serviceRole.length < 100 ? ' WARNING: TOO SHORT!' : ' OK')
        : 'MISSING',
      DOKU_CLIENT_ID: dokuClientId ? 'SET: ' + dokuClientId : 'MISSING',
      DOKU_ENVIRONMENT: dokuEnv ? 'SET: ' + dokuEnv : 'MISSING',
    },
    supabase_connectivity: supabaseStatus,
    supabase_error: supabaseError,
    bookings_count: bookingsCount,
    timestamp: new Date().toISOString(),
    node_env: process.env.NODE_ENV,
  });
}
