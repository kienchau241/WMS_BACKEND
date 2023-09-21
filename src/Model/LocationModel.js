const ModelSchema = require("./ModelSchema");
const modelSchema = require("./ModelSchema");
const ModelSchemaValidator = require("./ModelSchemaValidator");
const sql = require("mssql");

const LocationModel = new ModelSchema(
    {
        location_id: new ModelSchemaValidator({
            name:'location_id',
            sqlType:sql.Int
        }),
        name:new ModelSchemaValidator({
            name:"name",
            sqlType:sql.VarChar,
            require:true,  
        }),
        zone : new ModelSchemaValidator({
            name:"zone",
            sqlType:sql.VarChar,
            require:true
        }),
        address:new ModelSchemaValidator({
            name:"address",
            sqlType:sql.VarChar,
            require:true
        }),
        capacity: new ModelSchemaValidator({
            name:"capacity",
            sqlType:sql.Int,
            require:true,
            validator:function(val){
                return val >= 0;
            }
        })
    },
    "_location",
    "capacity"
)

module.exports = LocationModel;