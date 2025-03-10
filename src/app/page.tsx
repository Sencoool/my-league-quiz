'use client'

import axios from "axios"
import {useEffect, useState } from "react"

export default function Home() {
  const [champions, setChampions] = useState([]);
  const [search, setSearch] = useState('');
  const [randomChampion, setRandomChampion] = useState<any>([]);

  const searchChampion = (e: any) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    // ดึงข้อมูล champion จาก API
    async function getChampions() {
      const res = await axios.get("https://ddragon.leagueoflegends.com/cdn/15.5.1/data/en_US/champion.json");
      const championsArray:any = Object.values(res.data.data); // แปลง object เป็น array
      setChampions(championsArray);
      const index = Math.floor(Math.random() * championsArray.length);
      setRandomChampion(championsArray[index]);
      
    }
    getChampions();
    setSearch('');
  }, []);

  return (
    <>
      <main className="flex flex-col items-center justify-center min-h-screen py-2 container mx-auto">
        <div className="container mx-auto items-center justify-center flex flex-col border-2 border-blue-500 p-4 rounded-lg w-1/3">
          <h1 className="text-3xl font-bold mb-10">League Champions Guessing</h1>
          <h1>Answer is : {randomChampion.name} </h1>
          <input
            type="text"
            placeholder="Typee your champion name"
            className="bg-white text-black p-2 rounded-lg"
            onChange={(e) => setSearch(e.target.value)}
          />
           <div>
            {champions.length > 0 ? (
              <div>
                {champions.filter((champion: any) => { // filter champion name
                  return search === "" ? champion : champion.name.toLowerCase().includes(search.toLowerCase());
                }).map((champion: any) => (
                  <div key={champion.id}>
                    <h2>{champion.name}</h2>
                    <img
                      src={`https://ddragon.leagueoflegends.com/cdn/15.5.1/img/champion/${champion.id}.png`}
                      alt={champion.name}
                      />
                  </div>
                ))}
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
