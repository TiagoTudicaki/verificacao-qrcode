const pickupService = require("../services/pickupService");

const pickupController = {
    async create(req, res){
        try{
           
        if(Object.keys(req.body).length === 0){
            const erro = new Error("Requisição vazia");
            throw erro;
        }

        const {orderNumber} = req.body;

        const newPickup = await pickupService.create(orderNumber);
        return res.status(201).json(newPickup);

        }catch(erro){
            return res.status(400).json(erro);
        }
    }
}

module.exports = pickupController;