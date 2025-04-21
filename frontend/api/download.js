export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método não permitido" });
    }
  
    const { url } = req.body;
    const isInstagramUrl = /(?:https?:\/\/)?(?:www\.)?(?:instagram\.com|instagr\.am)\/(?:reel|p)\/[^\/]+/.test(url);
  
    if (!url || !isInstagramUrl) {
      return res.status(400).json({ error: "URL do Instagram inválida." });
    }
  
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // Timeout de 8s
  
    try {
      const fetchRes = await fetch("https://saveig.app/api/ajaxSearch", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: `q=${encodeURIComponent(url)}&t=media&lang=en`,
        signal: controller.signal
      });
      clearTimeout(timeout);
  
      const data = await fetchRes.json();
      const link = data.data?.[0]?.url;
  
      if (link) {
        return res.status(200).json({ downloadUrl: link });
      } else {
        return res.status(404).json({ error: "Vídeo não encontrado." });
      }
    } catch (err) {
      clearTimeout(timeout);
      if (err.name === 'AbortError') {
        return res.status(504).json({ error: "A API demorou muito para responder." });
      }
      return res.status(500).json({ error: "Erro ao processar a URL." });
    }
  }