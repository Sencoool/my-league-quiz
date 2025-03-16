'use client'

import axios from "axios"
import {useEffect, useRef, useState } from "react"

export default function Home() {
  const [champions, setChampions] = useState<any>([]);
  const [search, setSearch] = useState([]);
  const [answer, setAnswer] = useState<any>([]);
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

  const handleClick = (input: any) => {
    let data: any = [];

    data.push(input);
    setAnswer((data : any) => [...data, input]);
    
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
        <div className="relative container mx-auto items-center flex flex-col border-2 border-yellow-50 p-4 rounded-lg w-1/2 h-[300px]">
          <h1 className="text-3xl font-bold mb-10">League Champions Guessing</h1>
          <h1>Answer is : {randomChampion.name} </h1>
          <input type="text" list="characters" name="search" id="search" className="bg-white text-black p-2 w-1/2 rounded-lg" placeholder="Type character name . . . ." onChange={e => searchCharacter(e.target.value)} ref={inputRef}/>
          <div className="absolute w-1/2 max-h-[340px] top-39 overflow-y-scroll">
          {search.map((champion: any, index) => (
            <div className="flex items-center gap-4 p-2 border-b bg-neutral-800 border-[#ccc] hover:bg-rose-950 duration-300 cursor-pointer z-10" key={index} onClick={e => handleClick(champion)}>
              <img width={50} height={50} src={`https://ddragon.leagueoflegends.com/cdn/15.5.1/img/champion/${champion.id}.png`}  alt="" className="w-10 h-10 object-cover" />
              {champion.name}
            </div>
          ))}
          </div>
        </div>
        {/* header */}
        <div className="flex flex-col items-center mt-10 w-1/2">
           Guess
           <div className="flex bg-yellow-50 text-black font-extrabold  rounded-t-lg">
            <div className="flex justify-center p-2 w-[150px]">Icon</div>
            <div className="flex justify-center p-2 w-[150px]">name</div>
            <div className="flex justify-center p-2 w-[150px]">resources</div>
           </div>
        {/* answer */}
           <div>
            {(answer.length === 0) ? (
              <div className="flex justify-center items-center border-2 border-yellow-50 p-2 w-[450px]">
                No Answer
              </div>
            ) : answer.map((champions : any, index : any) => (
              <div className="flex" key={index}>
                <div className="flex justify-center items-center border-2 border-yellow-50 p-2 w-[150px] bg-red-800">
                  <img src={`https://ddragon.leagueoflegends.com/cdn/15.5.1/img/champion/${champions.id}.png`} alt="" className="w-1/2 object-cover"/>
                </div>
                <div className="flex justify-center items-center border-2 border-yellow-50 p-2 w-[150px] bg-red-800">
                  {champions.name}
                </div>
                <div className="flex justify-center items-center border-2 border-yellow-50 p-2 w-[150px] bg-red-800">  
                  {champions.partype}
                </div>
              </div>
            ))}
           </div>
        </div>
      </main>
    </>
  );
}