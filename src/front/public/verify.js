const dot1 = document.getElementById("dot1");
const dot2 = document.getElementById("dot2");
const dot3 = document.getElementById("dot3");
const stageLabel = document.getElementById("stageLabel");
const capturedInfo = document.getElementById("capturedInfo");
const scanArea = document.getElementById("scanArea");
const resultArea = document.getElementById("resultArea");
const resultIcon = document.getElementById("resultIcon");
const resultTitle = document.getElementById("resultTitle");
const resultMessage = document.getElementById("resultMessage");
const restartBtn = document.getElementById("restartBtn");

let html5QrCode = null;
let clientToken = null;
let equipmentToken = null;

function marcarPasso(numero) {
  const dots = [dot1, dot2, dot3];
  dots.forEach((dot, indice) => {
    dot.className = "step-dot";
    if (indice < numero - 1) dot.classList.add("done");
    if (indice === numero - 1) dot.classList.add("active");
  });
}

async function iniciarLeitura() {
  html5QrCode = new Html5Qrcode("reader");
  const config = { fps: 10, qrbox: 220 };

  await html5QrCode.start(
    { facingMode: "environment" },
    config,
    onCodigoLido,
    () => {}
  );
}

async function pararLeitura() {
  if (html5QrCode) {
    try {
      await html5QrCode.stop();
      html5QrCode.clear();
    } catch (erro) {
      // câmera já parada, segue o fluxo
    }
    html5QrCode = null;
  }
}

async function onCodigoLido(textoDecodificado) {
  if (clientToken === null) {
    clientToken = textoDecodificado;
    await pararLeitura();
    marcarPasso(2);
    stageLabel.textContent = "Agora escaneie o código do equipamento";
    capturedInfo.textContent = "Cliente capturado: " + clientToken;
    iniciarLeitura();
    return;
  }

  if (equipmentToken === null) {
    equipmentToken = textoDecodificado;
    await pararLeitura();
    marcarPasso(3);
    stageLabel.textContent = "Confirmando com o servidor...";
    capturedInfo.textContent = "";
    enviarVerificacao();
  }
}

async function enviarVerificacao() {
  try {
    const response = await fetch("/pickup/verify", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_token: clientToken,
        equipment_token: equipmentToken
      })
    });

    const data = await response.json();

    if (!response.ok) {
      mostrarResultado(false, "Retirada não confirmada", data.message || "Os códigos não conferem.");
      return;
    }

    mostrarResultado(true, "Retirada confirmada", "O aparelho foi liberado com sucesso.");
  } catch (erro) {
    mostrarResultado(false, "Falha de conexão", "Não foi possível falar com o servidor.");
  }
}

function mostrarResultado(sucesso, titulo, mensagem) {
  scanArea.hidden = true;
  resultArea.hidden = false;
  resultArea.className = "result-panel " + (sucesso ? "ok" : "err");
  resultIcon.textContent = sucesso ? "✓" : "✕";
  resultTitle.textContent = titulo;
  resultMessage.textContent = mensagem;
}

function reiniciar() {
  clientToken = null;
  equipmentToken = null;
  marcarPasso(1);
  stageLabel.textContent = "Escaneie o código do cliente";
  capturedInfo.textContent = "";
  resultArea.hidden = true;
  scanArea.hidden = false;
  iniciarLeitura();
}

restartBtn.addEventListener("click", reiniciar);

marcarPasso(1);
iniciarLeitura();
