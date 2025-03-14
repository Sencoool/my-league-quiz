'use client'

import axios from "axios"
import { log } from "console";
import {useEffect, useState } from "react"

export default function Home() {
  const [champions, setChampions] = useState([]);
  const [search, setSearch] = useState([]);
  const [randomChampion, setRandomChampion] = useState<any>([]);

  // Search character
  const searchCharacter = (input: string) => {
    let data = champions.filter((champions: any) => 
      champions.name.toLowerCase().startsWith(input.toLowerCase()) // Start with make input filter more accurate
    );
    setSearch(data);
  };
  
  // Get champions
  useEffect(() => {
    async function getChampions() {
      const res = await axios.get(
        "https://ddragon.leagueoflegends.com/cdn/15.5.1/data/en_US/champion.json"
      );
      let championsArray: any = Object.values(res.data.data); // Change object to array of champions
      setChampions(championsArray);
  
      const index = Math.floor(Math.random() * championsArray.length); // Randomize champion
      setRandomChampion(championsArray[index]);
    }
    getChampions();
  }, []);
  

  return (
    <>
      <main className="flex flex-col items-center min-h-screen py-2 container mx-auto pt-[100px]">
        <div className="container mx-auto items-center flex flex-col border-2 border-blue-500 p-4 rounded-lg w-1/2">
          <h1 className="text-3xl font-bold mb-10">League Champions Guessing</h1>
          <h1>Answer is : {randomChampion.name} </h1>
          <input type="text" list="characters" name="search" id="search" className="bg-white text-black p-2 w-1/2 rounded-lg" placeholder="Type character name . . . ." onChange={e => searchCharacter(e.target.value)}/>
          <div className="relative w-1/2 max-h-[340px] overflow-y-scroll custom-scrollbar">
          {search.map((champion: any, index) => (
            <div className="flex items-center gap-4 p-2 border-b bg-neutral-800 border-[#ccc] hover:bg-rose-950 duration-300 cursor-pointer" key={index}>
              <img width={50} height={50} src={`https://ddragon.leagueoflegends.com/cdn/15.5.1/img/champion/${champion.id}.png`}  alt="" className="w-10 h-10 object-cover"/>
              {champion.name}
            </div>
          ))}
      </div>
           <div>
            {/* {champions.length > 0 ? (
              <div>
                {champions.filter((champion: any) => { // filter champion name
                  return search === "" ? champion : champion.name.toLowerCase().includes(search.toLowerCase());
                }).map((champion: any) => (
                  <div key={champion.id}>
                    <img
                      src={`https://ddragon.leagueoflegends.com/cdn/15.5.1/img/champion/${champion.id}.png`}
                      alt={champion.name}
                      />
                    {champion.name}
                  </div>
                ))}
              </div>
            ) : (
              <p>Loading...</p>
            )} */}
          </div>
        </div>
      </main>
    </>
  );
}
