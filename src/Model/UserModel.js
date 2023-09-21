const modelSchema = require("./ModelSchema");
const ModelSchemaValidator = require("./ModelSchemaValidator");
const sql = require("mssql");
const STATICDATA = require("../database/StaticData");

const UserSchema =new modelSchema(
    {
        id: new ModelSchemaValidator({
            name: "user_id",
            sqlType: sql.Int
        }),
        email: new ModelSchemaValidator({
            name:"email",
            sqlType:sql.VarChar,
            require: true,
            validator: function(val){
                return String(val)
                    .toLowerCase()
                    .match(
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    );
            }
        }),
        password: new ModelSchemaValidator({
            name: "password",
            sqlType:sql.VarChar,
            require:true,
            validator: function(val){
                return val.length >= 8 && val.length< 200;
            }
        }),
        role: new ModelSchemaValidator({
            name:"role",
            sqlType:sql.VarChar,
            require:true,
            default:STATICDATA.AUTH.Role.customer,
        }),
        is_verified_email: new ModelSchemaValidator({
            name :"is_verified_email",
            sqlType: sql.Int,
            require: true,
            default: 0 ,// 0 = false and 1 = true
            validator:function(val){
                return val == 1 && val == 0;
            }
        })
    },
    "Users",
    "user_id"
);

module.exports = UserSchema;