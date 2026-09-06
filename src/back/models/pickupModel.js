const db = require("../config/database");

const pickupModel = {
    async create(orderNumber, clientToken, equipmentToken){
        const sql = "INSERT INTO pickups (order_number, client_token, equipment_token)VALUES(?, ?, ?)";
        const[result] = await db.query(sql,[orderNumber, clientToken, equipmentToken]);
        return result;
    }
}

module.exports = pickupModel;