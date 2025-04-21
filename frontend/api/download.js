export default async function handler(req, res) {
    // Configura CORS para pré-flight OPTIONS
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'POST');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      return res.status(200).end();
    }
  
    // Aceita apenas POST
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ error: 'Método não permitido. Use POST.' });
    }
  
    const { url } = req.body;
  
    // Validação robusta da URL do Instagram
    const isInstagramUrl = /(?:https?:\/\/)?(?:www\.)?(?:instagram\.com|instagr\.am)\/(?:reel|p|tv)\/[^\/]+/.test(url);
    if (!url || !isInstagramUrl) {
      return res.status(400).json({ error: 'URL do Instagram inválida. Exemplo: https://www.instagram.com/reel/ABC123/' });
    }
  
    // Timeout de 8 segundos (evita erro 504 na Vercel)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
  
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
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 's-maxage=3600'); // Cache de 1 hora
        return res.status(200).json({ downloadUrl: link });
      } else {
        return res.status(404).json({ error: 'Vídeo não encontrado.' });
      }
    } catch (err) {
      clearTimeout(timeout);
      if (err.name === 'AbortError') {
        return res.status(504).json({ error: 'A API demorou muito para responder. Tente novamente.' });
      }
      return res.status(500).json({ error: 'Erro interno ao processar a URL.' });
    }
  }