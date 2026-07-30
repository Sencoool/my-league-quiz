import { ChampionEntity, DailyChallengeResponse, LeaderboardUserResponse } from './api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * Champions change very rarely (~every 2-3 months per new champion release).
 * Cache for 7 days (604800s). Use `tags: ['champions']` to revalidate manually if needed.
 */
export async function getServerChampions(): Promise<ChampionEntity[]> {
  try {
    const res = await fetch(`${API_URL}/champions`, {
      next: { revalidate: 604800, tags: ['champions'] } // 7 days
    });
    if (!res.ok) throw new Error('Failed to fetch champions');
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error('Error fetching champions on server:', error);
    return [];
  }
}

/**
 * Daily challenges reset once per day.
 * Cache for 1 hour (3600s) — ensures freshness without hitting Lambda every request.
 */
export async function getServerChallenges(): Promise<DailyChallengeResponse[]> {
  try {
    const res = await fetch(`${API_URL}/daily-challenges`, {
      next: { revalidate: 3600, tags: ['daily-challenges'] } // 1 hour
    });
    if (!res.ok) throw new Error('Failed to fetch daily challenges');
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error('Error fetching daily challenges on server:', error);
    return [];
  }
}

/**
 * Leaderboard changes frequently as players score points.
 * Cache for 5 minutes (300s) — fresh enough for UX, light on Lambda invocations.
 */
export async function getServerLeaderboard(): Promise<LeaderboardUserResponse[]> {
  try {
    const res = await fetch(`${API_URL}/users/leaderboard?page=1`, {
      next: { revalidate: 300, tags: ['leaderboard'] } // 5 minutes
    });
    if (!res.ok) throw new Error('Failed to fetch leaderboard');
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error('Error fetching leaderboard on server:', error);
    return [];
  }
}
