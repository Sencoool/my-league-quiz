import Image from "next/image";

export default async function Home() {
  // call api
  const data = await fetch("https://ddragon.leagueoflegends.com/cdn/15.5.1/data/en_US/champion.json")
  const champions = await data.json()
  console.log(champions.data)
  return (
    <>
      <main className="flex flex-col items-center justify-center min-h-screen py-2 container mx-auto">
        <div className="container mx-auto items-center justify-center flex flex-col border-2 border-blue-500 p-4 rounded-lg w-1/3">
          <h1 className="text-3xl font-bold">League Champions Guessing</h1>
          <input
            type="text"
            placeholder="Guess . . ."
            className="bg-white text-black p-2 rounded-lg"
          />
        </div>
      </main>
    </>
  );
}
