const ModelSchema = require("./ModelSchema");
const ModelSchemaValidator = require("./ModelSchemaValidator");
const sql = require('mssql');

const OrderModel = new ModelSchema({
    order_id:new ModelSchemaValidator({
        name:"order_id",
        sqlType: sql.Int
    }),
    user_id : new ModelSchemaValidator({
        name:"user_id",
        sqlType:sql.Int,
        require:true,
    }),
    order_date: new ModelSchemaValidator({
        name:"order_date",
        sqlType: sql.DateTime,
        require:true
    }),
    status: new ModelSchemaValidator({
        name:"status",
        sqlType :sql.VarChar,
        require:true,
        validator: function(val){
            return val == "Pending..." && val == "Fail" && val == "Success";
        }
    }),
    total_amount: new ModelSchemaValidator({
        name:"total_amount",
        sqlType:sql.Int,
        require:true,
        validator: function(val){
            return val >= 0;
        }
    })
},"_order","order_date");

module.exports = OrderModel;