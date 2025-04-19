
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/download', (req, res) => {
  const { url } = req.body;
  const outputPath = path.join(__dirname, 'video.mp4');

  const command = `yt-dlp -f best -o "${outputPath}" "${url}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erro: ${error.message}`);
      return res.status(500).send('Erro ao baixar o vídeo');
    }

    res.download(outputPath, 'reel.mp4', (err) => {
      if (err) console.error('Erro ao enviar o vídeo:', err);
      fs.unlinkSync(outputPath);
    });
  });
});

app.listen(5000, () => console.log('Servidor rodando na porta 5000'));
