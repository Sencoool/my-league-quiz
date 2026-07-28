import LoadingScene from "./components/LoadingScene";
import Header from "./components/header";
import Footer from "./components/footer";

export default function Loading() {
  // This file acts as the native Next.js loading boundary 
  // It handles the loading state during route transitions
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <LoadingScene />
      <Footer />
    </div>
  );
}
