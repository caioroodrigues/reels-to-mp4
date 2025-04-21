export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método não permitido" });
    }
  
    const { url } = req.body;
  
    if (!url || !url.includes("instagram.com")) {
      return res.status(400).json({ error: "URL inválida" });
    }
  
    try {
      const fetchRes = await fetch("https://saveig.app/api/ajaxSearch", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "Origin": "https://saveig.app",
          "Referer": "https://saveig.app/",
        },
        body: `q=${encodeURIComponent(url)}&t=media&lang=en`
      });
  
      const data = await fetchRes.json();
  
      const link = data.data?.[0]?.url;
  
      if (link) {
        return res.status(200).json({ downloadUrl: link });
      } else {
        return res.status(500).json({ error: "Link de download não encontrado." });
      }
    } catch (err) {
      return res.status(500).json({ error: "Erro ao processar a URL" });
    }
  }
  