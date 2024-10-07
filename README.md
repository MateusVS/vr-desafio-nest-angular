# Sistema de Gerenciamento de Produtos Full Stack

Este projeto é uma aplicação web abrangente para gerenciar produtos em várias lojas. Consiste em um frontend Angular e um backend Node.js com banco de dados PostgreSQL.

## Funcionalidades

- Listagem de produtos com opções avançadas de filtragem
- Criação e edição de produtos
- Gerenciamento de preços específicos por loja
- Suporte para upload de imagens de produtos
- Testes unitários com 80% de cobertura

## Stack Tecnológica

### Frontend
- Angular com TypeScript
- Framework de testes unitários
- Roda na porta 4200

### Backend
- Node.js com TypeScript
- Banco de dados PostgreSQL
- TypeORM para gerenciamento de banco de dados
- Roda na porta 3000

### Recursos Adicionais
- Containerização com Docker
- Migrações de banco de dados
- Paginação para grandes conjuntos de dados
- Tabelas de dados ordenáveis

## Começando

### Pré-requisitos
- Node.js (recomendada a versão LTS mais recente)
- Docker e Docker Compose
- Git

### Instalação

1. Clone o repositório:
```bash
git clone git@github.com:MateusVS/vr-desafio-nest-angular.git
cd vr-desafio-nest-angular
```

2. Instale as dependências do frontend:
```bash
cd ./web
npm install
cd ..
```

3. Instale as dependências do backend:
```bash
cd ./server
npm install
cd ..
```

4. Inicie a aplicação:
```bash
docker-compose up --build
```

Isso iniciará tanto os serviços de frontend quanto de backend, junto com o banco de dados PostgreSQL.

## Estrutura da Aplicação

### Página de Consulta de Produtos
- Exibe uma tabela de produtos com opções de filtragem
- Filtros incluem: Código, Descrição, Custo e Preço de Venda
- Ações: Excluir e Editar produtos
- Opção para adicionar novos produtos

### Página de Registro de Produtos
- Permite a criação e edição de produtos
- Campos incluem:
  - Código (gerado automaticamente)
  - Descrição (obrigatório, máximo 60 caracteres)
  - Custo (opcional, formato numérico 13,3)
  - Upload de imagem (suporta .png e .jpg)
- Gerenciamento de preços específicos por loja através de um diálogo modal

## Desenvolvimento

### Executando Testes
```bash
# Testes do Frontend
cd ./web
npm test

# Testes do Backend
cd ./server
npm test
```
