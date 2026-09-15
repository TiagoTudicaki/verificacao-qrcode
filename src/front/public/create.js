const orderInput = document.getElementById("orderNumber");
const equipmentTypeInput = document.getElementById("equipmentType");
const equipmentBrandInput = document.getElementById("equipmentBrand");
const equipmentColorInput = document.getElementById("equipmentColor");
const generateBtn = document.getElementById("generateBtn");
const statusLine = document.getElementById("statusLine");
const qrPair = document.getElementById("qrPair");
const clientQr = document.getElementById("clientQr");
const equipmentQr = document.getElementById("equipmentQr");

function setStatus(message, kind) {
  statusLine.textContent = message;
  statusLine.className = "status-line" + (kind ? " " + kind : "");
}

async function gerarCodigos() {
  const orderNumber = orderInput.value.trim();
  const equipmentType = equipmentTypeInput.value.trim();
  const equipmentBrand = equipmentBrandInput.value.trim();
  const equipmentColor = equipmentColorInput.value.trim();

  if (orderNumber.length === 0) {
    setStatus("Digite o número da ordem de serviço.", "err");
    return;
  }

  if (equipmentType.length === 0 || equipmentBrand.length === 0 || equipmentColor.length === 0) {
    setStatus("Preencha tipo, marca e cor do equipamento.", "err");
    return;
  }

  generateBtn.disabled = true;
  setStatus("Gerando códigos...");
  qrPair.hidden = true;

  try {
    const response = await fetch("/pickup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderNumber, equipmentType, equipmentBrand, equipmentColor })
    });

    const data = await response.json();

    if (!response.ok) {
      setStatus(data.message || "Não foi possível gerar os códigos.", "err");
      return;
    }

    clientQr.src = data.clientQrCode;
    equipmentQr.src = data.equipmentQrCode;
    qrPair.hidden = false;
    setStatus("Códigos gerados para a OS " + orderNumber + ".", "ok");
  } catch (erro) {
    setStatus("Falha de conexão com o servidor.", "err");
  } finally {
    generateBtn.disabled = false;
  }
}

generateBtn.addEventListener("click", gerarCodigos);
orderInput.addEventListener("keydown", (evento) => {
  if (evento.key === "Enter") gerarCodigos();
});