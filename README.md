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