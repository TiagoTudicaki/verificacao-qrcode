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
    },

    async verify(req, res){
        try{
            if(Object.keys(req.body).length < 1){
                const erro = new Error("Os campos são obrigatórios");
                throw erro;
            }

            const {client_token, equipment_token} = req.body;

            const verifyPickup = await pickupService.verify(client_token, equipment_token);
            return res.status(200).json(verifyPickup);
        }catch(erro){
            return res.status(400).json({message:erro.message});
        }
    }
}



module.exports = pickupController;