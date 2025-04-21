import { useState } from 'react';

const DownloadButton = () => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    if (!url) {
      setError('Por favor, insira uma URL do Instagram.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (response.ok) {
        window.open(data.downloadUrl, '_blank'); // Abre o link em nova aba
      } else {
        setError(data.error || 'Erro ao baixar o vídeo.');
      }
    } catch (err) {
      setError('Falha na conexão. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Cole a URL do Instagram Reel"
      />
      <button onClick={handleDownload} disabled={isLoading}>
        {isLoading ? 'Baixando...' : 'Baixar Vídeo'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default DownloadButton;