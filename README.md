## Prontuário Eletrônico
Este é um sistema de prontuário eletrônico desenvolvido em Node.js com Express e MongoDB.

## Funcionalidades
Permite aos usuários criar, atualizar e excluir pacientes.
Facilita o gerenciamento de informações de pacientes em um consultório médico ou clínica.

## Tecnologias Utilizadas
Node.js
Express
MongoDB
Mongoose

## Configuração
Clone o repositório:
git clone https://github.com/seu-usuario/prontuario-eletronico.git

## Instale as dependências:
npm install

## Configure o banco de dados MongoDB:
Certifique-se de que o MongoDB está instalado e em execução na sua máquina.
Altere a URI de conexão com o MongoDB no arquivo config.js, se necessário.

## Inicie o servidor:
npm start

## Acesse o sistema no seu navegador:
http://localhost:3000

## Endpoints da API
- GET /api/patients: Retorna todos os pacientes.
- POST /api/patients: Cria um novo paciente.
- GET /api/patients/:id: Retorna um paciente específico.
- PUT /api/patients/:id: Atualiza um paciente existente.
- DELETE /api/patients/:id: Exclui um paciente.
