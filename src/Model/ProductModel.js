const modelSchema = require("./ModelSchema");
const ModelSchemaValidator = require("./ModelSchemaValidator");
const sql = require("mssql")

const ProductModel = new modelSchema({
    product_id: new ModelSchemaValidator({
        name:"product_id",
        sqlType: sql.Int,
    }),
    name : new ModelSchemaValidator({
        name:"name",
        sqlType: sql.VarChar,
        require:true
    }),
    description: new ModelSchemaValidator({
        name:"description",
        sqlType:sql.VarChar,
        require: true,
        validator: function(val){
            return val.length < 200 && val.length >= 1
        }
    }),
    sku: new ModelSchemaValidator({
        name:"sku",
        sqlType: sql.VarChar,
        require: true,
        validator: function(val){
            return val.length >= 1 && val.length <= 11;
        }
    }),
    unit_price: new ModelSchemaValidator({
        name:"unit_price",
        sqlType: sql.Float,
        require:true,
        validator: function(val){
            return val > -1;
        }
    }),

    weight: new ModelSchemaValidator({
        name:"weight",
        sqlType:sql.Float,
        require:true,
        validator: function(){
            return val > -1;
        }
    })
}) 

module.exports = ProductModel;