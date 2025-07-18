import { NextRequest, NextResponse } from "next/server";
import type { AppConfig } from "@/lib/types/app";
import { getAppConfigDirect } from "@/lib/services/app-config.service";

export async function GET(
  request: NextRequest
): Promise<NextResponse<AppConfig>> {
  console.log('🚀 API app-config called');
  console.log('🚀 NODE_ENV:', process.env.NODE_ENV);
  console.log('🚀 Request URL:', request.url);
  console.log('🚀 Request headers:', Object.fromEntries(request.headers.entries()));
  
  try {
    const appConfig = await getAppConfigDirect();
    return NextResponse.json(appConfig, {
      headers: {
        "Cache-Control": process.env.NODE_ENV === 'development'
          ? "no-cache, no-store, must-revalidate"
          : "public, max-age=1800, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error('❌ API app-config error:', error);
    // Hata durumunda varsayılan değerler döndür
    return NextResponse.json(await getAppConfigDirect(), {
      headers: {
        "Cache-Control": process.env.NODE_ENV === 'development'
          ? "no-cache, no-store, must-revalidate"
          : "public, max-age=300",
      },
    });
  }
}
