# API de Notas — Back-end (Aula 05)

API REST desenvolvida com **Node.js** e **Express.js** para a Atividade 02 da Aula 05 da disciplina **Frameworks Front-end (SENAI)**.

As notas ficam salvas no arquivo `data.json`, que funciona como um banco de dados simples. A API permite criar, listar, buscar, editar e excluir notas (CRUD).

- **Deploy (Render):** _adicionar link após o deploy_
- **Front-end que consome esta API:** [api-notas-frontend](https://github.com/liviaghirardi/api-notas-frontend)

## Tecnologias

- Node.js
- Express.js
- CORS
- File System (`fs`) com arquivo JSON
- Render (deploy)

## Estrutura

```
api-notas-backend/
├── server.js      # servidor Express e rotas CRUD
├── data.json      # armazenamento das notas
└── package.json   # dependências e scripts
```

## Endpoints

| Método | Rota | Função | Respostas |
|--------|------|--------|-----------|
| GET | `/api/notes` | Lista todas as notas | `200` |
| GET | `/api/notes/:id` | Busca uma nota pelo id | `200`, `404` |
| POST | `/api/notes` | Cria uma nota | `201`, `400` |
| PUT | `/api/notes/:id` | Atualiza uma nota | `200`, `400`, `404` |
| DELETE | `/api/notes/:id` | Exclui uma nota | `204`, `404` |

### Códigos de resposta

| Código | Significado |
|--------|-------------|
| `200 OK` | Requisição realizada com sucesso |
| `201 Created` | Nota criada com sucesso |
| `204 No Content` | Nota excluída (sem corpo na resposta) |
| `400 Bad Request` | `titulo` ou `texto` não enviados |
| `404 Not Found` | Nenhuma nota com o id informado |

### Corpo das requisições POST e PUT

```json
{
  "titulo": "Estudos",
  "texto": "Revisar os métodos HTTP"
}
```

### Exemplo de nota retornada

```json
{
  "id": "1",
  "titulo": "Estudos",
  "texto": "Revisar os métodos HTTP",
  "criadoEm": "2026-11-23T12:00:00.000Z"
}
```

## Como executar

```bash
npm install
npm start
```

A API fica disponível em `http://localhost:3000`.

## Deploy no Render

1. Crie um **Web Service** no Render conectado a este repositório.
2. **Build Command:** `npm install`
3. **Start Command:** `npm start`

> No plano gratuito do Render, o arquivo `data.json` volta ao estado do repositório quando o serviço reinicia ou fica inativo, então as notas criadas não são permanentes.
