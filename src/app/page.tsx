'use client'

import axios from "axios";
import {useEffect, useRef, useState } from "react";
import { allCharacters } from "../app/data/leagueData.js";

export default function Home() {
  const [initials, setInitials] = useState<any>([]); // Initials champions
  const [champions, setChampions] = useState<any>([]);
  const [search, setSearch] = useState([]);
  const [answer, setAnswer] = useState<any>([]);
  const [randomChampion, setRandomChampion] = useState<any>([]);
  const [guess, setGuess] = useState<number>(0);
  const [winGame, setWinGame] = useState(false);
  const inputRef = useRef<any>(null);
  const winRef = useRef<any>(false);

  async function getChampions() {
    const res = await axios.get(
      "https://ddragon.leagueoflegends.com/cdn/15.5.1/data/en_US/champion.json"
    );
    let championsArray : any = Object.values(res.data.data); // Change object to array of champions
    setInitials(championsArray);
    setChampions(championsArray);

    const index = Math.floor(Math.random() * championsArray.length); // Randomize champion
    setRandomChampion(championsArray[index]);
  }

  const getRandomChampion = () => {
    const index = Math.floor(Math.random() * champions.length);
    setRandomChampion(champions[index]);
  };

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

  // Tmr, make an arrow can select the champion

  const selectAnswer = (input: any) => {
    let data: any = [];

    data.push(input);
    setAnswer((data : any) => [...data, input]);
    setGuess(guess + 1);

    // filter selected champion
    setChampions(champions.filter((champions: any) =>
      champions.id !== input.id // filter every champion that id is not equal to selected champion (means remove selected champion)
    ));

    if (inputRef.current) {
        inputRef.current.value = "";
    }

    gameWin(input);
    setSearch([]);
  };

  const gameWin = (data: any) => {
    let score = 0;

    if (data.name == randomChampion.name) score++;
    if (data.partype == randomChampion.partype) score++;

    if (score === 2) {
      setWinGame(true);
      winRef.current = true;;
    }
  };

  const playAgain = () => {
    setAnswer([]);
    setSearch([]);
    setChampions(initials);
    setWinGame(false);
    setGuess(0);
    getRandomChampion();
    inputRef.current.value = "";
    winRef.current = false;
  };
  

  
  // Get champions
  useEffect(() => {
    getChampions();
  }, []);
  

  return (
    <>
      <main className="flex flex-col items-center min-h-screen py-2 container mx-auto pt-[100px]">
        
        {/* search box */}
        <div className="flex flex-col items-center container mx-auto border-2 border-yellow-50 p-4 rounded-lg w-1/2 h-[300px]">
        <h1 className="text-3xl font-bold mb-5">League Champions Guessing</h1>

          <div className="flex flex-col items-center w-full">
            {/* search */}
            <input type="text" list="characters" name="search" id="search" className="bg-white text-black p-2 w-1/2 rounded-t-lg" placeholder="Type character name . . . ." onChange={e => searchCharacter(e.target.value)} ref={inputRef} autoComplete="off" />

            {/* select  */}
            <div className={`w-1/2 max-h-[200px] overflow-y-auto flex flex-col border bg-neutral-800 rounded-b-lg relative z-10 ${inputRef.current?.value == "" ? 'hidden' : 'block'}} `}>
              {search.length === 0 && inputRef.current?.value !== "" ? (
                <div className="flex items-center justify-center gap-4 p-2 border-b">
                  No champions found!
                </div>
              ) : (
                search.map((champion: any, index) => (
                  <div key={index} className="flex items-center gap-4 p-2 border-b border-[#ccc] hover:bg-rose-950 duration-300 cursor-pointer"onClick={() => selectAnswer(champion)}>
                    <img width={50} height={50} src={`https://ddragon.leagueoflegends.com/cdn/15.5.1/img/champion/${champion.id}.png`} alt={champion.name} className="w-10 h-10 object-cover" />
                    {champion.name}
                  </div>
                ))
              )}
            </div>
            {/* <p>Answer is : {randomChampion.name}</p> */}
          </div>
          
          {/* Indicator */}
          <div className="absolute flex flex-col items-center mt-40 w-[500px]">
            Indicator
            <div className="flex items-center justify-center mx-auto gap-5 mt-2">
              <div className="flex justify-center w-[50px]">
                <img src="/img/Red.png" alt="" className="w-[50px]" />
              </div>
              <div className="flex justify-center w-[150px]">
                <img src="/img/Orange.png" alt="" className="w-[50px]" />
              </div>
              <div className="flex justify-center w-[50px]">
                <img src="/img/Green.png" alt="" className="w-[50px]" />
              </div>
            </div>
            <div className="flex items-center justify-center mx-auto gap-5 ">
              <div className="flex justify-center w-[50px]">
                <div className="flex justify-center">Wrong</div>
              </div>
              <div className="flex justify-center w-[150px]">
                <div className="flex justify-center">Halfway There</div>
              </div>
              <div className="flex justify-center w-[50px]">
                <div className="flex justify-center">Right</div>
              </div>
            </div>
          </div>
        </div>

        {/* header */}
        <div className="flex flex-col items-center mt-10 w-1/2">
           Guess
           <div className="flex bg-yellow-50 text-black font-extrabold rounded-t-lg mt-5">
            <div className="flex justify-center p-2 w-[150px]">Icon</div>
            <div className="flex justify-center p-2 w-[150px]">name</div>
            <div className="flex justify-center p-2 w-[150px]">resources</div>
            <div className="flex justify-center p-2 w-[150px]">roles</div>
           </div>
        {/* answer */}
           <div>
            {(answer.length === 0) ? (
              <div className="flex justify-center items-center border-2 border-yellow-50 p-2 w-[600px]">
                Guess your first answer !
              </div>
            ) : answer.map((champions : any, index : any) => (
              <div className="flex" key={index}>
                <div className="flex justify-center items-center border-2 border-yellow-50 p-2 w-[150px] opacity-0" style={{ animation: 'slideDown 0.5s ease-out forwards', animationDelay: '0s'}}>
                  <img src={`https://ddragon.leagueoflegends.com/cdn/15.5.1/img/champion/${champions.id}.png`} alt="" className="w-1/2 object-cover"/>
                </div>
                <div className="flex justify-center items-center border-2 border-yellow-50 p-2 w-[150px] opacity-0" style={{ animation: 'slideDown 0.5s ease-out forwards', animationDelay: '0.5s',backgroundColor: champions.name == randomChampion.name ? '#007f4e' : champions.id.includes(randomChampion.name) ? '#f37324' : '#e12729'}}>
                  {champions.name}
                </div>
                <div className="flex justify-center items-center border-2 border-yellow-50 p-2 w-[150px] opacity-0" style={{ animation: 'slideDown 0.5s ease-out forwards', animationDelay: '1s',backgroundColor: champions.partype == randomChampion.partype ? '#007f4e' : champions.id.includes(randomChampion.partype) ? '#f37324' : '#e12729'}}>  
                  {champions.partype}
                </div>
                <div className="flex justify-center items-center border-2 border-yellow-50 p-2 w-[150px] opacity-0 text-center" style={{ animation: 'slideDown 0.5s ease-out forwards', animationDelay: '1.5s', backgroundColor: (champions.tags.every((tag: string) => randomChampion.tags.includes(tag))? '#007f4e' : (champions.tags.some((tag: string) => randomChampion.tags.includes(tag))? '#f37324' : '#e12729')) }}>  
                  {champions.tags.join(", ")}
                </div>
              </div>
            ))}
           </div>
        </div>
        {(winGame) ? (
          <div className="w-1/4 h-1/2 mt-20 fixed flex items-center justify-center bg-zinc-900 border-2 rounded-lg z-50 opacity-0" style={{ animation: 'answerDown 0.5s ease-out forwards', animationDelay: '2.0s'}}>
            <div className="flex flex-col items-center p-10 rounded-lg">
              <h2 className="text-3xl font-bold select-none pb-5">
                Victory !
              </h2>
              <img src={`https://ddragon.leagueoflegends.com/cdn/15.5.1/img/champion/${randomChampion.id}.png`} alt="" />
              <p className="pt-5 pb-3 text-3xl font-bold select-none">Today guess : {randomChampion.name}</p>
              <p className="pb-3 select-none">Total Guess : {guess} times</p>
              <p className="pb-1 select-none">wanna play again ?</p>
              <p className="pb-1 select-none">🢃</p>
            <button className=" text-white px-4 py-2 rounded-lg border-2 border-white hover:bg-white hover:text-black transition-all duration-300 cursor-pointer select-none" onClick={playAgain}>Play Again</button>
          </div>
        </div>
        ) : null }
      </main>
    </>
  );
}