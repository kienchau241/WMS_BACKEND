const modelSchema = require("./ModelSchema");
const ModelSchemaValidator = require("./ModelSchemaValidator");
const sql = require("mssql");

const orderLineModel = new modelSchema({
    line_id:new ModelSchemaValidator({
        name:"line_id",
        sqlType: sql.Int
    }),
    order_id: new ModelSchemaValidator({
        name:'order_id',
        sqlType:sql.Int,
        require:true
    }),
    product_id:new ModelSchemaValidator({
        name:"product_id",
        sqlType: sql.Int,
        require:true
    }),
    quantity: new ModelSchemaValidator({
        name:"quantity",
        sqlType:sql.Int,
        require:true
    }),
    unit_price: new ModelSchemaValidator({
        name:"unit_price",
        sqlType: sql.Float,
        require: true,
        validator: function(val){
            return val > -1;
        }
    }),
    status: new ModelSchemaValidator({
        name:"status",
        sqlType :sql.VarChar,
        require:true,
        validator: function(val){
            return val == "Pending..." && val == "Fail" && val == "Success";
        }
    }),
}, "order_line", "line_id");

module.exports = orderLineModel;