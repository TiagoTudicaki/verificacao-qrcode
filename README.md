# Sistema de verificação de entrada e devolução de aparelhos por QR code

> Projeto em evolução, visando testes reais na prática.

Esse sistema foi pensado para resolver uma dor no dia a dia de uma assistência técnica, onde um grande fluxo de aparelhos entra e sai todos os dias.
Ao dar entrada no aparelho (informando o número da OS), o sistema gera um QR code de verificação. Na hora da devolução ao cliente, dois QR codes — um do cliente e um do aparelho — precisam bater para confirmar que o aparelho certo está sendo entregue à pessoa certa.

## Status do Projeto

🚧 Em desenvolvimento ativo — com foco em consolidação de boas práticas

### Situação atual

- Estrutura MVC definida (controller, service, model)

## Tecnologias

- **Node.js** — ambiente de execução JavaScript no servidor.
- **Express** — framework para criação de APIs e rotas HTTP.
- **MySQL** — banco de dados relacional.
- **mysql2** — driver de conexão e execução de queries no MySQL com suporte a Promises.
- **dotenv** — gerenciamento de variáveis de ambiente.
- **uuid** — gera identificadores únicos e praticamente impossíveis de repetir, usados como token de cada QR code (cliente e aparelho).
- **qrcode** — transforma um texto (o token gerado pelo uuid) em uma imagem de QR code, exibível na tela ou imprimível.


## Como Instalar e Rodar

### Pré-requisitos

- Node.js 18+
- MySQL 8+

### Passo a passo

**1. Clone o repositório**

```bash
git clone https://github.com/TiagoTudicaki/verificacao-qrcode
cd verificacao-qrcode
```

**2. Instale as dependências**

```bash
npm install
```

**3. Configure as variáveis de ambiente**

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=
DB_PORT=3306
```

**4. Crie o banco de dados**

Execute no MySQL:

```sql 
CREATE DATABASE verificacao_qrcode;
USE verificacao_qrcode;

CREATE TABLE pickups(
id INT auto_increment PRIMARY KEY,
order_number VARCHAR(50) NOT NULL,
client_token VARCHAR(36) UNIQUE NOT NULL,
equipment_token VARCHAR(36) UNIQUE NOT NULL,
status enum('pending','confirmed','canceled') DEFAULT'pending',
created_at TIMESTAMP DEFAULT current_timestamp,
checked_at TIMESTAMP NULL,
confirmation_method enum('qrcode','manual') NULL);