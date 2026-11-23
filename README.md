# Prontuário Eletrônico

Uma demo local de cadastro de pacientes com Node.js, TypeScript, Express e MongoDB. Pelo painel, você pode buscar pacientes por nome, cadastrar, editar e excluir registros.

![Painel do Prontuário Eletrônico com quatro pacientes de demonstração](docs/painel.png)

## Experimente

Na raiz do projeto, com Docker Compose disponível, rode:

```bash
docker compose up --build
```

Abra [http://localhost:3000](http://localhost:3000). O Compose inicia o painel com quatro pacientes fictícios e guarda os cadastros em um volume do MongoDB.

1. Clique em **Novo paciente** e cadastre um nome fictício.
2. Use **Buscar por nome** para localizar o cadastro.
3. Clique em **Editar** e atualize a idade.
4. Clique em **Excluir** e confirme a remoção.

O painel é uma demonstração local sem autenticação. Use apenas dados fictícios.

## Rode com Node.js

Com **Node.js 22 ou superior** e **MongoDB** em execução, rode:

```bash
npm ci
npm run build
MONGODB_URI=mongodb://127.0.0.1:27017/prontuario_demo PRONTUARIO_SEED=true npm start
```

| Variável | Padrão | Uso |
| --- | --- | --- |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/prontuario` | Conexão com o MongoDB |
| `PRONTUARIO_SEED` | Desativada | Com `true`, insere os exemplos ausentes na inicialização e preserva edições existentes |
| `HOST` | `127.0.0.1` | Endereço em que o servidor escuta |
| `PORT` | `3000` | Porta HTTP |

## Como funciona

O Express serve o painel estático e a API no mesmo endereço. O painel usa a API para consultar e gravar cadastros, e o Mongoose valida e persiste os dados no MongoDB.

| Método | Rota | Resultado |
| --- | --- | --- |
| `GET` | `/api/health` | Estado da conexão com o MongoDB |
| `GET` | `/api/patients` | Lista de pacientes |
| `POST` | `/api/patients` | Cria um cadastro e responde com HTTP 201 |
| `GET` | `/api/patients/:id` | Consulta um cadastro |
| `PUT` | `/api/patients/:id` | Atualiza os campos enviados |
| `DELETE` | `/api/patients/:id` | Exclui um cadastro e responde com HTTP 204 |

Envie JSON com `name` (texto), `age` (inteiro de 0 a 130) e `gender` (texto). A API retorna HTTP 400 para dados inválidos e HTTP 404 para um identificador válido sem cadastro correspondente.

```bash
curl -i http://localhost:3000/api/patients \
  -H 'Content-Type: application/json' \
  -d '{"name":"Rafa Demo","age":29,"gender":"non-binary"}'
```

## Testes

```bash
npm test
```

A suíte usa uma instância MongoDB acessível em `127.0.0.1:27017`. Para usar outra instância, defina `MONGODB_TEST_URI`. Os testes criam e removem um banco temporário com nome único. A suíte cobre o cadastro completo, validações, a carga de exemplos e as rotas do painel e de saúde.
