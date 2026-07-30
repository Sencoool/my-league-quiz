import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

const VALID_TAGS = ['champions', 'daily-challenges', 'leaderboard'] as const;
type ValidTag = typeof VALID_TAGS[number];

/**
 * On-Demand Cache Revalidation endpoint.
 *
 * Usage:
 *   POST /api/revalidate?tag=daily-challenges&secret=YOUR_SECRET
 *   POST /api/revalidate?tag=champions&secret=YOUR_SECRET
 *   POST /api/revalidate?tag=leaderboard&secret=YOUR_SECRET
 *
 * Call this from your NestJS Lambda (e.g. after creating a new Daily Challenge)
 * to immediately invalidate the Next.js cache without redeploying.
 *
 * Set REVALIDATE_SECRET in your Next.js environment variables.
 */
export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const tag = searchParams.get('tag') as ValidTag | null;

  // Validate secret
  const expectedSecret = process.env.REVALIDATE_SECRET;
  if (!expectedSecret) {
    return NextResponse.json(
      { error: 'REVALIDATE_SECRET env var not set on server' },
      { status: 500 }
    );
  }
  if (secret !== expectedSecret) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  // Validate tag
  if (!tag || !VALID_TAGS.includes(tag)) {
    return NextResponse.json(
      { error: `Invalid tag. Valid options: ${VALID_TAGS.join(', ')}` },
      { status: 400 }
    );
  }

  revalidateTag(tag);

  return NextResponse.json({
    revalidated: true,
    tag,
    timestamp: new Date().toISOString(),
  });
}
