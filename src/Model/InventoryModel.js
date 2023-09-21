const ModelSchema = require("./ModelSchema");
const ModelSchemaValidator = require("./ModelSchemaValidator");
const sql = require("mssql");

const InventoryModel = new ModelSchema({
    inventory_id : new ModelSchemaValidator({
        name :"inventory_id",
        sqlType:sql.Int
    }),
    product_id: new ModelSchemaValidator({
        name:"product_id",
        sqlType: sql.Int,
        require:true,
        validator:function(val){
            return val >= 0;
        }
    }),
    location_id: new ModelSchemaValidator({
        name:"location_id",
        sqlType: sql.Int,
        require:true,
        validator:function(val){
            return val >= 0;
        }
    }),
    quantity: new ModelSchemaValidator({
        name:"quantity",
        sqlType: sql.Int,
        require:true,
        validator:function(val){
            return val >= 0;
        }
    }),
    last_stock_date: new ModelSchemaValidator({
        name:"last_stock_date",
        sqlType:sql.DateTime,
        require:true,
    })
},"Inventory","last_stock_date");

module.exports = InventoryModel;
