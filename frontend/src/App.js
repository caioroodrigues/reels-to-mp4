import React, { useState } from "react";
import "./index.css";

function App() {
  const [url, setUrl] = useState("");

  const handleDownload = async () => {
    if (!url.includes("instagram.com/reel")) {
      alert("Insira um link válido de Reels do Instagram.");
      return;
    }
  
    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
  
      const data = await res.json();
  
      if (data.downloadUrl) {
        window.open(data.downloadUrl, "_blank");
      } else {
        alert("Não foi possível obter o vídeo.");
      }
    } catch (err) {
      alert("Erro ao baixar o vídeo.");
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-zinc-800 via-zinc-900 to-black text-white px-4">
      <h1 className="text-4xl font-bold mb-6 text-center">Conversor de Reels para MP4</h1>

      <input
        type="text"
        placeholder="Cole o link do vídeo aqui..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full max-w-md p-3 rounded-lg border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-purple-600"
      />

      <button
        onClick={handleDownload}
        className="mt-4 bg-purple-600 hover:bg-purple-700 transition text-white px-6 py-2 rounded-lg font-semibold"
      >
        Baixar Vídeo
      </button>

      <footer className="mt-10 text-sm text-gray-400 text-center">
        © {new Date().getFullYear()} Caio. Todos os direitos reservados.
      </footer>
    </div>
  );
}

export default App;
