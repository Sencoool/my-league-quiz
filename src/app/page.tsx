"use client";

import { useEffect, useRef, useState } from "react";
import { allCharacters } from "../app/data/leagueData.js";
import Header from "./components/header";
import Footer from "./components/footer";

export default function Home() {
  const [initials, setInitials] = useState<Champions[]>([]); // Initials champions
  const [champions, setChampions] = useState<any[]>([]);
  const [search, setSearch] = useState<Champions[]>([]);
  const [answer, setAnswer] = useState<Champions[]>([]);
  const [randomChampion, setRandomChampion] = useState<any>([]);
  const [guess, setGuess] = useState<number>(0);
  const [winGame, setWinGame] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const domSearch = useRef<HTMLDivElement>(null);
  const inputRef = useRef<any>(null);
  const winRef = useRef<any>(false);

  type Champions = {
    name: string;
    icon: string;
    gender: string;
    lane: string | string[];
    resource: string;
    species: string | string[];
    region: string;
  };

  async function getChampions() {
    const championsArray = allCharacters;
    setInitials(championsArray);
    setChampions(championsArray);
    console.log(championsArray[1]);

    const index = Math.floor(Math.random() * championsArray.length); // Randomize champion
    setRandomChampion(championsArray[index]); // Set random champion
  }

  const getRandomChampion = () => {
    const index = Math.floor(Math.random() * champions.length);
    setRandomChampion(champions[index]);
  };

  const searchCharacter = (input: string) => {
    if (input !== "") {
      let data = champions.filter(
        (champions: any) =>
          champions.name.toLowerCase().startsWith(input.toLowerCase()) // Start with make input filter more accurate
      );
      setSearch(data);
    } else {
      setSearch([]);
    }
  };

  // Tmr, make an arrow can select the champion
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      setSelectedIndex((prev) => Math.min(prev + 1, search.length - 1));
    } else if (event.key === "ArrowUp") {
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (event.key === "Enter") {
      if (selectedIndex >= 0 && selectedIndex < search.length) {
        selectAnswer(search[selectedIndex]);
      }
    }
  };

  const selectAnswer = (input: any) => {
    let data: any = [];
    console.log("Selected:", input.name);

    data.push(input);
    setAnswer((data: any) => [...data, input]);
    setGuess(guess + 1);

    // filter selected champion
    setChampions(
      champions.filter(
        (champions: any) => champions.name !== input.name // filter every champion that id is not equal to selected champion (means remove selected champion)
      )
    );

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    gameWin(input);
    setSearch([]);
  };

  const gameWin = (data: any) => {
    let score = 0;

    if (data.name == randomChampion.name) score++;
    if (data.lane == randomChampion.lane) score++;
    if (data.gender == randomChampion.gender) score++;
    if (data.resource == randomChampion.resource) score++;
    if (data.region == randomChampion.region) score++;
    if (data.species == randomChampion.species) score++;

    if (score === 6) {
      setWinGame(true);
      winRef.current = true;
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

  // Reset arrow index when input is empty
  useEffect(() => {
    setSelectedIndex(-1);
  }, [search]);

  return (
    <>
      <Header />
      <main className="flex flex-col items-center min-h-screen py-2 container mx-auto xl:pt-[100px] pt-[50px] select-none">
        {/* search box */}
        <div className="flex flex-col items-center container mx-auto border-2 border-yellow-50 p-4 rounded-lg max-w-1/4 h-[300px] min-w-3/4 md:min-w-[500px] ">
          <h1 className="text-2xl md:text-3xl font-bold mb-5 text-center">
            League Champions Guessing
          </h1>

          <div className="flex flex-col items-center w-full bor">
            {/* search */}
            <input
              type="text"
              list="characters"
              name="search"
              id="search"
              className="bg-white text-black p-2 w-3/4 md:w-1/2 rounded-t-lg"
              placeholder="Type character name . . . ."
              onChange={(e) => searchCharacter(e.target.value)}
              onKeyDown={handleKeyDown}
              ref={inputRef}
              autoComplete="off"
            />

            {/* select  */}
            <div
              ref={domSearch}
              className={`w-3/4 md:w-1/2 max-h-[200px] overflow-y-auto flex flex-col border bg-neutral-800 rounded-b-lg relative z-10 ${inputRef.current?.value == "" ? "hidden" : "block"}} `}
            >
              {search.length === 0 && inputRef.current?.value !== "" ? (
                <div className="flex items-center justify-center gap-4 p-2 border-b">
                  No champions found!
                </div>
              ) : (
                search.map((champion: any, index: number) => (
                  <div
                    key={index}
                    className={`flex items-center gap-4 p-2 border-b border-[#ccc] hover:bg-rose-950 duration-300 cursor-pointer ${
                      selectedIndex === index ? "bg-rose-950" : ""
                    }`}
                    onClick={() => selectAnswer(champion)}
                  >
                    <img
                      width={50}
                      height={50}
                      src={`${champion.icon}`}
                      alt={champion.name}
                      className="w-10 h-10 object-cover"
                    />
                    {champion.name}
                  </div>
                ))
              )}
            </div>
            {/* <p>Answer is : {randomChampion.name}</p> */}
          </div>

          {/* Indicator */}
          <div className="absolute flex flex-col items-center mt-40 w-full md-w-[500px]">
            Indicator
            <div className="flex items-center justify-center mx-auto md:gap-5 mt-2">
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
            <div className="flex items-center justify-center mx-auto md:gap-5 ">
              <div className="flex justify-center w-[50px]">
                <div className="flex justify-center">Wrong</div>
              </div>
              <div className="flex justify-center w-[150px]">
                <div className="flex justify-center">Almost</div>
              </div>
              <div className="flex justify-center w-[50px]">
                <div className="flex justify-center">Right</div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-2xl font-bold mt-5">Your Guess</p>
        <p className="md:hidden">Swipe ➜ to see more !!!</p>

        {/* header */}
        <div className="flex flex-col xl:items-center mt-5 pl-5 pr-5 w-full overflow-x-auto scrollbar-hidden">
          <div className="min-w-[1050px] flex bg-yellow-50 text-black font-extrabold rounded-t-lg mt-5 ">
            <div className="flex justify-center p-2 w-[150px]">Icon</div>
            <div className="flex justify-center p-2 w-[150px]">Name</div>
            <div className="flex justify-center p-2 w-[150px]">Lane</div>
            <div className="flex justify-center p-2 w-[150px]">Gender</div>
            <div className="flex justify-center p-2 w-[150px]">Resources</div>
            <div className="flex justify-center p-2 w-[150px]">Region</div>
            <div className="flex justify-center p-2 w-[150px]">Species</div>
          </div>

          {/* answer */}
          <div className="w-[1050px]">
            {answer.length === 0 ? (
              <div className="flex justify-center items-center border-2 border-yellow-50 p-2 w-full">
                Guess your first answer !
              </div>
            ) : (
              answer.map((champions: any, index: any) => (
                <div className="flex" key={index}>
                  <div
                    className="flex justify-center items-center border-2 border-yellow-50 p-2 w-[150px] slideDown opacity-0"
                    style={{
                      animation: "slideDown 0.75s ease-out forwards",
                      animationDelay: "0s",
                    }}
                  >
                    <img
                      src={`${champions.icon}`}
                      alt=""
                      className="w-1/2 object-cover"
                    />
                  </div>
                  <div
                    className="flex justify-center items-center border-2 border-yellow-50 p-2 w-[150px] slideDown opacity-0"
                    style={{
                      animation: "slideDown 0.5s ease-out forwards",
                      animationDelay: "0.5s",
                      backgroundColor:
                        champions.name == randomChampion.name
                          ? "#007f4e"
                          : champions.name.includes(randomChampion.name)
                            ? "#f37324"
                            : "#e12729",
                    }}
                  >
                    {champions.name}
                  </div>
                  <div
                    className="flex justify-center items-center border-2 border-yellow-50 p-2 w-[150px] slideDown opacity-0"
                    style={{
                      animation: "slideDown 0.5s ease-out forwards",
                      animationDelay: "1.0s",
                      backgroundColor:
                        champions.lane == randomChampion.lane
                          ? "#007f4e"
                          : champions.lane.includes(randomChampion.lane)
                            ? "#f37324"
                            : "#e12729",
                    }}
                  >
                    {(Array.isArray(champions.lane)
                      ? champions.lane
                      : [champions.lane]
                    ).map((laneImg: string, index: number) => (
                      <div
                        key={index}
                        className="flex justify-center items-center w-[50%]"
                      >
                        <img
                          src={laneImg}
                          alt=""
                          className="w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div
                    className="flex justify-center items-center border-2 border-yellow-50 p-2 w-[150px] slideDown opacity-0"
                    style={{
                      animation: "slideDown 0.5s ease-out forwards",
                      animationDelay: "1.5s",
                      backgroundColor:
                        champions.gender == randomChampion.gender
                          ? "#007f4e"
                          : champions.gender.includes(randomChampion.gender)
                            ? "#f37324"
                            : "#e12729",
                    }}
                  >
                    {champions.gender}
                  </div>
                  <div
                    className="flex justify-center items-center border-2 border-yellow-50 p-2 w-[150px] slideDown opacity-0"
                    style={{
                      animation: "slideDown 0.5s ease-out forwards",
                      animationDelay: "2.0s",
                      backgroundColor:
                        champions.resource == randomChampion.resource
                          ? "#007f4e"
                          : "#e12729",
                    }}
                  >
                    {champions.resource}
                  </div>
                  <div
                    className="flex justify-center items-center border-2 border-yellow-50 p-2 w-[150px] slideDown opacity-0"
                    style={{
                      animation: "slideDown 0.5s ease-out forwards",
                      animationDelay: "2.5s",
                      backgroundColor:
                        champions.region == randomChampion.region
                          ? "#007f4e"
                          : champions.region.includes(randomChampion.region)
                            ? "#f37324"
                            : "#e12729",
                    }}
                  >
                    {champions.region}
                  </div>
                  <div
                    className="flex justify-center items-center text-center border-2 border-yellow-50 p-2 w-[150px] slideDown opacity-0"
                    style={{
                      animation: "slideDown 0.5s ease-out forwards",
                      animationDelay: "3.0s",
                      whiteSpace: "pre-line",
                      backgroundColor:
                        champions.species == randomChampion.species
                          ? "#007f4e"
                          : champions.species.includes(randomChampion.species)
                            ? "#f37324"
                            : "#e12729",
                    }}
                  >
                    {Array.isArray(champions.species)
                      ? champions.species.join("\n")
                      : champions.species}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {winGame ? (
          <div
            className="w-1/4 h-1/2 mt-20 fixed flex items-center justify-center bg-zinc-900 border-2 rounded-lg z-50 opacity-0"
            style={{
              animation: "answerDown 0.5s ease-out forwards",
              animationDelay: "3.5s",
            }}
          >
            <div className="flex flex-col items-center p-10 rounded-lg">
              <h2 className="text-3xl font-bold select-none pb-5">Victory !</h2>
              <img src={`${randomChampion.icon}`} alt="" />
              <p className="pt-5 pb-3 text-3xl font-bold select-none">
                Today guess : {randomChampion.name}
              </p>
              <p className="pb-3 select-none">Total Guess : {guess} times</p>
              <p className="pb-1 select-none">wanna play again ?</p>
              <p className="pb-1 select-none">🢃</p>
              <button
                className=" text-white px-4 py-2 rounded-lg border-2 border-white hover:bg-white hover:text-black transition-all duration-300 cursor-pointer select-none"
                onClick={playAgain}
              >
                Play Again
              </button>
            </div>
          </div>
        ) : null}
      </main>
      <Footer />
    </>
  );
}
