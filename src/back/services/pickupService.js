const pickupModel = require("../models/pickupModel");
const { v4: uuidv4} = require("uuid");
const qrcode = require("qrcode");

const pickupService = {
    async create(orderNumber){
        
            if(typeof orderNumber != "string"){
            throw new Error("O numero da ordem tem que ser texto");
        }

        if(orderNumber.trim() === ""){
            throw new Error("O campo numero da ordem não pode ser vazio");
        }

        const validateOrderNumber = /^[0-9]+$/.test(orderNumber);

        if(!validateOrderNumber){
            throw new Error("O campo numero da ordem deve possuir apenas numeros");
        }

        const clientToken = uuidv4();
        const equipmentToken = uuidv4();

        const clientQrCode = await qrcode.toDataURL(clientToken);
        const equipmentQrCode = await qrcode.toDataURL(equipmentToken);

        await pickupModel.create(orderNumber, clientToken, equipmentToken);
        return {clientQrCode, equipmentQrCode};
        

        

    }
}

module.exports = pickupService;