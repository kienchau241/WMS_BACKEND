const sql = require('mssql');

class ModelSchemaValidator{
    constructor(config){
        this.name = config.name;
        this.sqlType = config.sqlType;

        switch(config.sqlType){
            case sql.VarChar:
            case sql.DateTime:
                this.type = "string";
            case sql.Int:
            case sql.Float:
                this.type = "number";
                break;
            default :  
                throw new Error("Unsupported model type " + config.sqlType);
        }
        this.require = Boolean(config.require);

        if (typeof config.default === this.type) {
          this.default = config.default;
        }
    }
    validate(val){
        console.log(val);
        if (val === undefined || val === null) {
            val = this.default;
            if (this.require) {
                return {
                    isValid: false,
                    err: "field is required",
                };
            } else {
                return {
                    isValid: true,
                };
            }
        }
      
        if (typeof val !== this.type) {
          return {
            isValid: false,
            err: "invalid value type",
          };
        }
      
          if (this.validator && !this.validator(val)) {
            //console.log(this.validator && !this.validator(val));
            return {
              isValid: false,
              err: "validator check failed",
            };
          }
      
          return {
            isValid: true,
          };

    }
}

module.exports = ModelSchemaValidator;