import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

// Porta dinâmica para o Render (ou 3000 localmente)
const PORT = process.env.PORT || 3000;

// Caminho do arquivo JSON que funciona como "banco de dados"
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, 'data.json');

// Middlewares
app.use(cors());          // libera o acesso do front-end (outro domínio)
app.use(express.json());  // permite receber JSON no corpo da requisição

// ====================
// Funções auxiliares
// ====================
function lerNotas() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function salvarNotas(notas) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(notas, null, 2));
}

function validarNota(body) {
  const titulo = typeof body?.titulo === 'string' ? body.titulo.trim() : '';
  const texto = typeof body?.texto === 'string' ? body.texto.trim() : '';
  return { titulo, texto, valida: titulo !== '' && texto !== '' };
}

// ====================
// Rota inicial
// ====================
app.get('/', (req, res) => {
  res.json({
    status: 'API de Notas funcionando!',
    rotas: {
      listar: 'GET /api/notes',
      buscar: 'GET /api/notes/:id',
      criar: 'POST /api/notes',
      atualizar: 'PUT /api/notes/:id',
      excluir: 'DELETE /api/notes/:id'
    }
  });
});

// ====================
// GET - Listar notas
// ====================
app.get('/api/notes', (req, res) => {
  res.status(200).json(lerNotas());
});

// ====================
// GET - Buscar uma nota
// ====================
app.get('/api/notes/:id', (req, res) => {
  const nota = lerNotas().find((n) => n.id === req.params.id);

  if (!nota) {
    return res.status(404).json({ erro: 'Nota não encontrada' });
  }

  res.status(200).json(nota);
});

// ====================
// POST - Criar nota
// ====================
app.post('/api/notes', (req, res) => {
  const { titulo, texto, valida } = validarNota(req.body);

  if (!valida) {
    return res.status(400).json({ erro: 'Título e texto são obrigatórios' });
  }

  const notas = lerNotas();
  const novaNota = {
    id: Date.now().toString(),
    titulo,
    texto,
    criadoEm: new Date().toISOString()
  };

  notas.push(novaNota);
  salvarNotas(notas);

  res.status(201).json(novaNota);
});

// ====================
// PUT - Editar nota
// ====================
app.put('/api/notes/:id', (req, res) => {
  const notas = lerNotas();
  const index = notas.findIndex((n) => n.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ erro: 'Nota não encontrada' });
  }

  const { titulo, texto, valida } = validarNota(req.body);

  if (!valida) {
    return res.status(400).json({ erro: 'Título e texto são obrigatórios' });
  }

  notas[index] = {
    ...notas[index],
    titulo,
    texto,
    atualizadoEm: new Date().toISOString()
  };
  salvarNotas(notas);

  res.status(200).json(notas[index]);
});

// ====================
// DELETE - Excluir nota
// ====================
app.delete('/api/notes/:id', (req, res) => {
  const notas = lerNotas();
  const restantes = notas.filter((n) => n.id !== req.params.id);

  if (restantes.length === notas.length) {
    return res.status(404).json({ erro: 'Nota não encontrada' });
  }

  salvarNotas(restantes);
  res.status(204).send();
});

// ====================
// Inicia o servidor
// ====================
app.listen(PORT, () => {
  if (!fs.existsSync(DATA_FILE)) {
    salvarNotas([]);
  }
  console.log(`Servidor rodando na porta ${PORT}`);
});
