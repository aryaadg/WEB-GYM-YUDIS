import { NextResponse } from 'next/server';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const dokuClientId = process.env.DOKU_CLIENT_ID;
  const dokuEnv = process.env.DOKU_ENVIRONMENT;

  return NextResponse.json({
    env_status: {
      NEXT_PUBLIC_SUPABASE_URL: supabaseUrl
        ? `✅ SET (${supabaseUrl.substring(0, 30)}...)`
        : '❌ MISSING',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseKey
        ? `✅ SET (${supabaseKey.length} chars)`
        : '❌ MISSING',
      SUPABASE_SERVICE_ROLE_KEY: serviceRole
        ? `✅ SET (${serviceRole.length} chars)`
        : '❌ MISSING',
      DOKU_CLIENT_ID: dokuClientId
        ? `✅ SET (${dokuClientId})`
        : '❌ MISSING',
      DOKU_ENVIRONMENT: dokuEnv
        ? `✅ SET (${dokuEnv})`
        : '❌ MISSING',
    },
    timestamp: new Date().toISOString(),
    node_env: process.env.NODE_ENV,
  });
}
