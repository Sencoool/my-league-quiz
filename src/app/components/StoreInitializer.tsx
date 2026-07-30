'use client';

import { useRef } from 'react';
import { useGameStore } from '../store/useGameStore';
import { ChampionEntity, DailyChallengeResponse } from '../utils/api';

export default function StoreInitializer({ 
  champions, 
  challenges 
}: { 
  champions: ChampionEntity[], 
  challenges: DailyChallengeResponse[] 
}) {
  const initialized = useRef(false);
  
  if (!initialized.current) {
    const classicChallenge = challenges.find(c => c.mode === 'CLASSIC') || null;
    const jigsawChallenge = challenges.find(c => c.mode === 'JIGSAW') || null;
    const traitsChallenge = challenges.find(c => c.mode === 'TRAITS') || null;
    const matcherChallenge = challenges.find(c => c.mode === 'MATCHER') || null;
    
    useGameStore.setState({
      championsList: champions,
      classicChallenge,
      jigsawChallenge,
      traitsChallenge,
      matcherChallenge,
      activeChallenge: useGameStore.getState().activeChallenge || classicChallenge,
      isLoadingData: false, // Mark as loaded immediately
    });
    
    initialized.current = true;
  }
  
  return null;
}
