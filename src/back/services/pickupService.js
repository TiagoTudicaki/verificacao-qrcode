const pickupModel = require("../models/pickupModel");
const { v4: uuidv4 } = require("uuid");
const qrcode = require("qrcode");

const pickupService = {
  async create(orderNumber, equipmentType, equipmentBrand, equipmentColor) {
    if (typeof orderNumber != "string") {
      throw new Error("O numero da ordem tem que ser texto");
    }

    if (orderNumber.trim() === "") {
      throw new Error("O campo numero da ordem não pode ser vazio");
    }

    const validateOrderNumber = /^[0-9]+$/.test(orderNumber);

    if (!validateOrderNumber) {
      throw new Error("O campo numero da ordem deve possuir apenas numeros");
    }

    if (typeof equipmentType != "string" || equipmentType.trim() == "") {
      throw new Error("O tipo do equipamento deve ser texto e não pode ser vazio");
    }

    if (typeof equipmentBrand != "string" || equipmentBrand.trim() == "") {
      throw new Error("A marca do equipamento deve ser texto e não pode ser vazia");
    }

    if (typeof equipmentColor != "string" || equipmentColor.trim() == "") {
      throw new Error("A cor do equipamento deve ser texto e não pode ser vazia");
    }

    const isOnlyNumbers = /^[0-9]+$/;

    if (isOnlyNumbers.test(equipmentType)) {
      throw new Error("O tipo do equipamento não pode ser apenas números");
    }

    if (isOnlyNumbers.test(equipmentBrand)) {
      throw new Error("A marca do equipamento não pode ser apenas números");
    }

    if (isOnlyNumbers.test(equipmentColor)) {
      throw new Error("A cor do equipamento não pode ser apenas números");
    }

    const clientToken = uuidv4();
    const equipmentToken = uuidv4();

    const clientQrContent = JSON.stringify({
      token: clientToken,
      type: equipmentType,
      brand: equipmentBrand,
      color: equipmentColor,

    });

    const clientQrCode = await qrcode.toDataURL(clientQrContent);
    const equipmentQrCode = await qrcode.toDataURL(equipmentToken);

    await pickupModel.create(orderNumber, clientToken, equipmentToken);
    return { clientQrCode, equipmentQrCode };
  },

  async verify(clientToken, equipmentToken) {
    const pickup = await pickupModel.verify(clientToken, equipmentToken);

    if (pickup === undefined) {
      const erro = new Error("Tokens inválidos");
      throw erro;
    }

    if (pickup.status === "confirmed") {
      const erro = new Error("Aparelho já foi retirado");
      throw erro;
    }

    const id = pickup.id;
    const newStatus = "confirmed";
    const checkedAt = new Date();
    const confirmationMethod = "qrcode";

    const result = await pickupModel.update(
      id,
      newStatus,
      checkedAt,
      confirmationMethod,
    );
    return result;
  },
};
module.exports = pickupService;
