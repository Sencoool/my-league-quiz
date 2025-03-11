'use client'

import axios from "axios"
import {useEffect, useState } from "react"

export default function Home() {
  const [champions, setChampions] = useState([]);
  const [search, setSearch] = useState([]);
  const [randomChampion, setRandomChampion] = useState<any>([]);

  const searchCharacter = (input: string) => {
    if (input === "") {
      setSearch([]); // ไม่พิมพ์ ไม่แสดงผลลัพธ์
      return;
    }
  
    let data = champions.filter((c: any) =>
      c.name.toLowerCase().includes(input.toLowerCase())
    );
  
    setSearch(data);
  };
  

  const changeSelectStage = (index: any, e: any) => {
    let data = [...search];
  };

  useEffect(() => {
    async function getChampions() {
      const res = await axios.get(
        "https://ddragon.leagueoflegends.com/cdn/15.5.1/data/en_US/champion.json"
      );
      let championsArray: any = Object.values(res.data.data);
  
      // เพิ่ม property `select` เพื่อป้องกัน error
      championsArray = championsArray.map((champion: any) => ({
        ...champion,
      }));
  
      setChampions(championsArray);
      setSearch([]); // เริ่มต้นให้ไม่มีรายการแสดง
  
      const index = Math.floor(Math.random() * championsArray.length);
      setRandomChampion(championsArray[index]);
    }
    getChampions();
  }, []);
  

  return (
    <>
      <main className="flex flex-col items-center justify-center min-h-screen py-2 container mx-auto">
        <div className="container mx-auto items-center flex flex-col border-2 border-blue-500 p-4 rounded-lg w-1/2 h-[350px]">
          <h1 className="text-3xl font-bold mb-10">League Champions Guessing</h1>
          <h1>Answer is : {randomChampion.name} </h1>
          <input type="text" list="characters" name="search" id="search" className="bg-white text-black p-2 w-1/2 rounded-lg" placeholder="Type character name . . . ." onChange={e => searchCharacter(e.target.value)} autoComplete="off"/>
          <div className="relative w-1/2 max-h-[340px] overflow-y-scroll custom-scrollbar">
          {search.map((champion: any, index) => (
            <div className="flex items-center gap-4 p-2 border-b border-[#ccc] hover:bg-[#dadada] duration-150 cursor-pointer" key={index} onClick={(e) => changeSelectStage(index, e)}>
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
