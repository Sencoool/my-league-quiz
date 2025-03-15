'use client'

import axios from "axios"
import {useEffect, useRef, useState } from "react"

export default function Home() {
  const [champions, setChampions] = useState([]);
  const [search, setSearch] = useState([]);
  const [answer, setAnswer] = useState<string[]>([]);
  const [randomChampion, setRandomChampion] = useState<any>([]);
  const inputRef = useRef<any>(null);

  // Search character
  const searchCharacter = (input: string) => {
    if(input !== ""){
      let data = champions.filter((champions: any) => 
        champions.name.toLowerCase().startsWith(input.toLowerCase()) // Start with make input filter more accurate
      );
      setSearch(data);
    } else {
      setSearch([]);
    }
  };

  const handleClick = (input: string) => {
    let data: string[] = [];

    data.push(input);
    setAnswer(data => [...data, input]);

    if(inputRef.current){
      inputRef.current.value = "";
      setChampions([...champions]);
    }

    setSearch([]);
  }
  
  // Get champions
  useEffect(() => {
    async function getChampions() {
      const res = await axios.get(
        "https://ddragon.leagueoflegends.com/cdn/15.5.1/data/en_US/champion.json"
      );
      let championsArray : any = Object.values(res.data.data); // Change object to array of champions
      setChampions(championsArray);
  
      const index = Math.floor(Math.random() * championsArray.length); // Randomize champion
      setRandomChampion(championsArray[index]);
    }

    getChampions();
  }, []);
  

  return (
    <>
      <main className="flex flex-col items-center min-h-screen py-2 container mx-auto pt-[100px]">
        {/* search box */}
        <div className="container mx-auto items-center flex flex-col border-2 border-blue-500 p-4 rounded-lg w-1/2">
          <h1 className="text-3xl font-bold mb-10">League Champions Guessing</h1>
          <h1>Answer is : {randomChampion.name} </h1>
          <input type="text" list="characters" name="search" id="search" className="bg-white text-black p-2 w-1/2 rounded-lg" placeholder="Type character name . . . ." onChange={e => searchCharacter(e.target.value)} ref={inputRef}/>
          <div className="relative w-1/2 max-h-[340px] overflow-y-scroll">
          {search.map((champion: any, index) => (
            <div className="flex items-center gap-4 p-2 border-b bg-neutral-800 border-[#ccc] hover:bg-rose-950 duration-300 cursor-pointer" key={index} onClick={e => handleClick(champion.id)}>
              <img width={50} height={50} src={`https://ddragon.leagueoflegends.com/cdn/15.5.1/img/champion/${champion.id}.png`}  alt="" className="w-10 h-10 object-cover" />
              {champion.name}
            </div>
          ))}
          </div>
        </div>
        <div className="flex flex-col items-center mt-10">
           Already Answered
           <div>
            {answer.map((champions, index) => (
              <div key={index}>{champions}</div>
            ))}
           </div>
        </div>
      </main>
    </>
  );
}
