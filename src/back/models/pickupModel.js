const db = require("../config/database");


const pickupModel = {
    async create(orderNumber, clientToken, equipmentToken){
        const sql = "INSERT INTO pickups (order_number, client_token, equipment_token)VALUES(?, ?, ?)";
        const[result] = await db.query(sql,[orderNumber, clientToken, equipmentToken]);
        return result;
    },

    async verify(clientToken, equipmentToken){
        const [rows] = await db.execute(
            "SELECT * FROM pickups WHERE client_token = ? AND equipment_token = ?",
            [clientToken, equipmentToken]
        );

        return rows[0];

    
    },

    async update(id, newStatus, checkedAt, confirmationMethod ){

        const [confirmedPickup] = await db.query(
            "UPDATE pickups SET status = ?, checked_at = ?, confirmation_method = ? WHERE id = ?",[newStatus, checkedAt, confirmationMethod, id]
        );

        return confirmedPickup;
    }


}

module.exports = pickupModel;