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
        

    },

    async verify(clientToken, equipmentToken){
        const pickup = await pickupModel.verify(clientToken, equipmentToken);

        if(pickup === undefined){
            const erro = new Error("Tokens inválidos");
            throw erro;
        }

        if(pickup.status === "confirmed"){
            const erro = new Error("Aparelho já foi retirado");
            throw erro;
        }
        
        const id = pickup.id;
        const newStatus = "confirmed";
        const checkedAt = new Date();
        const confirmationMethod = "qrcode";

        const result = await pickupModel.update(id, newStatus, checkedAt, confirmationMethod);
        return result
}

}
module.exports = pickupService;