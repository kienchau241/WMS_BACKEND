const dbConfig = require("../database/dbConfig");
const dbUtils = require("../database/dbUtils");
const userSchema = require("../Model/UserModel");
const StaticData = require("../database/StaticData");
const bcrypt = require("bcryptjs");


exports.getAllUser = async function(filter){
    if(!dbConfig.db?.pool){
        throw new Error("Not connected to db")
    }
    //console.log(userSchema.schema);
    let query = `SELECT * FROM ${userSchema.schemaName}`;
    let countquery = `SELECT COUNT(DISTINCT ${userSchema.schema.id.name}) as totalItem from ${userSchema.schemaName}`;

    const page = filter.page * 1 || 1;
    let pageSize = filter.pageSize * 1 || StaticData.config.MAX_PAGE_SIZE;
    if(pageSize > StaticData.config.MAX_PAGE_SIZE){
        pageSize = StaticData.config.MAX_PAGE_SIZE;
    }

    const {filterStr, paginationStr} = dbUtils.getFilterQuery(
        userSchema.schema,
        filter,
        page, 
        pageSize,
        userSchema.defaultSort
    );
    // console.log(pagnipationStr);
    // console.log(filterStr);

    if(filterStr){
        query = " "+ paginationStr;
    }
    //console.log(query);

    let result = await dbConfig.db.pool.request().query(query);
    let countResult = await dbConfig.db.pool.request().query(countquery);
    let totalItem = 0;

    if(countResult.recordsets[0].length > 0){
        totalItem = countResult.recordsets[0][0].totalItem;
    }
    let totalPage = Math.ceil(totalItem / pageSize); // round up

    return {
        page,
        pageSize,
        totalPage,
        totalItem,
        users : result.recordsets[0],
    };
};

exports.getUserById = async function(id){
    if(!dbConfig.db?.pool){
        throw new Error("Not connected to db")
    }

    let query = `SELECT * FROM ${userSchema.schemaName} WHERE ${userSchema.schema.id.name} = @${userSchema.schema.id.name}`;

    let result = await dbConfig.db.pool
        .request()
        .input(userSchema.schema.id.name, userSchema.schema.id.sqlType, id)
        .query(query);
    
    if(result.recordsets[0].length > 0){
        return result.recordset[0][0];
    }

    return null;
};

exports.getUserByEmail = async function(email){
    if(!dbConfig.db.pool){
        throw new Error("Not connected to db")
    }

    let query = `SELECT * FROM ${userSchema.schemaName} WHERE ${userSchema.schema.email.name} = @${userSchema.schema.email.name}`;

    const result = dbConfig.db.pool
        .request()
        .input(userSchema.schemaName, userSchema.schema.email.name, email)
        .query(query);

    if(result.recordset[0].length > 0){
        return result.recordset[0][0];
    }

    return null;
};

exports.createUser = async function(user){
    if(!dbConfig.db.pool){
        throw new Error("Not connected to db")
    }

    if(!user.role){
        throw new Error("Invalid user role")
    }

    let insertData = userSchema.validateData(user);
    //console.log(insertData);


    //hash the password with hashing algorithm called bcrypt with cost of 10 => how CPU intensive this operation will be
    insertData.password = await bcrypt.hash(insertData.password, 10)

    let query = `Insert into ${userSchema.schemaName}`;
    const {request, insertFieldNameStr, inserValueStr} = 
        dbUtils.getInsertQuery(
            userSchema.schema,
            dbConfig.db.pool.request(),
            insertData
        );
    
    if(!insertData || !inserValueStr){
        throw new Error("Invalid insert param")
    }

    query += `(${insertFieldNameStr}) values (${inserValueStr})`;
    console.log(query);

    let result = await request.query(query);

    return result.recordsets;
};

exports.updateUser = async function(id,updateUser){
    if(!dbConfig.db.pool){
        throw new Error("Not connected to db")
    }

    if(!updateUser){
        throw new Error("Invalid update param")
    }

    if(updateUser.password){
        updateUser.password = await bcrypt.hash(updateUser.password, 10 );
    }

    let query = `update ${userSchema.schemaName} set`;

    const {request, updateStr} = dbUtils.getUpdateQuery(
        userSchema.schema,
        dbConfig.db.pool.request(),
        updateUser
    );

    if(!updateStr){
        throw new Error("Invalid update param")
    }

    request.input(userSchema.schemaName.id.name, userSchema.schema.id.sqlType, id);
    query += 
        " " + 
        updateStr +
        `where ${userSchema.schema.id.name} = @${userSchema.schema.id.name}`;

    console.log(query);

    let result = await request.query(query);

    return result.recordsets;
};

exports.deleteUser = async function(id){
    if(!dbConfig.db.pool){
        throw new Error("Not connected to db");
    }

    let result = await dbConfig.db.pool
        .request()
        .input(userSchema.schema.id.name, userSchema.schema.id.sqlType, id)
        .query(
            `delete ${userSchema.schemaName} where ${userSchema.schema.id.name} = @${userSchema.schema.id.name}`
        )

    return result.recordsets;
}

exports.createUserIfNotExists = async function(user){
    if(!dbConfig.db.pool){
        throw new Error("Not connected to db");
    }

    user.role = StaticData.AUTH.Role.customer;
    if(!user.role){
        console.log(user);
        throw new Error("Invalid user role");
    }

    let insertData = userSchema.validateData(user);
    insertData.password = await bcrypt.hash(insertData.password, 10);

    let query = `SET IDENTITY_INSERT ${userSchema.schemaName} ON insert into ${userSchema.schemaName}`;

    const {request, insertFieldNameStr, inserValueStr} = dbUtils.getInsertQuery(
        userSchema.schema,
        dbConfig.db.pool.request(),
        insertData
    );

    if(!insertFieldNameStr || !inserValueStr){
        throw new Error("Invalid insert param");
    }

    query += `(${insertFieldNameStr}) select ${inserValueStr} 
        where not exists(select * from ${userSchema.schemaName} where ${userSchema.schema.id.name} = @${userSchema.schema.id.name})
        set idenity_insert ${userSchema.schemaName} off`;

    let result = await request.query(query);

    return result.recordsets;
}

exports.clearAll = async function () {
    if (!dbConfig.db.pool) {
      throw new Error("Not connected to db");
    }
  
    let result = await dbConfig.db.pool
      .request()
      .query(`delete ${userSchema.schemaName}`);
  
    // console.log(result);
    return result.recordsets;
  };