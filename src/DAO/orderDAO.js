const dbConfig = require("../database/dbConfig");
const dbUtils = require("../database/dbUtils");
const OrderModel = require("../Model/OrderModel");
//const StaticData = require("../database/StaticData");
//const bcrypt = require("bcryptjs");

exports.getAllOrders = async function(){
    if(!dbConfig.db?.pool){
        throw new Error("Not connected to db")
    }

    let query = `SELECT * FROM ${OrderModel.schemaName}`;
    let countquery = `SELECT COUNT(DISTINCT ${OrderModel.schema.order_id.name}) 
        as totalItem from ${OrderModel.schemaName}`;

    const page = filter.page * 1 || 1;
    let pageSize = filter.pageSize * 1 || StaticData.config.MAX_PAGE_SIZE;
    if(pageSize > StaticData.config.MAX_PAGE_SIZE){
        pageSize = StaticData.config.MAX_PAGE_SIZE;
    }

    const {filterStr, paginationStr} = dbUtils.getFilterQuery(
        OrderModel.schema,
        filter,
        page, 
        pageSize,
        OrderModel.defaultSort
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
        orders : result.recordsets[0],
    };
};

exports.getOrderById = async function(id){
    if(!dbConfig.db.pool){
        throw new Error("Not connected to db")
    }

    let query = `select * from ${OrderModel.schemaName} 
        where ${OrderModel.schema.order_id.name} = @${OrderModel.schema.order_id.name}`;
    console.log(query);

    let result = await dbConfig.db.pool 
        .request()
        .input(OrderModel.schema.order_id.name, OrderModel.schema.order_id.sqlType, id)
        .query(query)

    if(result.recordsets[0].length > 0){
        return result.recordset[0][0];
    }

    return null;
};

exports.createOrder = async function(order){
    if(!dbConfig.db.pool){
        throw new Error("Not connect to db");
    };

    let insertData = OrderModel.validateData(order);
    let query = `insert into ${OrderModel.schemaName}`;

    const {request, insertFieldNameStr, insertValueStr} = 
        dbUtils.getInsertQuery(
            OrderModel.schemaName,
            dbConfig.db.pool.request(),
            insertData
    );

    query = `(${insertFieldNameStr}) values (${insertValueStr})`;

    let result = await request.query(query);

    return result.recordsets;
}

// Cannot be update the order which was ordered => delete and create new one

exports.deleteOrder = async function(id){
    if(!dbConfig.db.pool){
        throw new Error("Not connect to db");
    };

    let result = await dbConfig.db.pool
        .request()
        .input(OrderModel.schema.order_id.name, OrderModel.schema.order_id.sqlType, id)
        .query(`delete ${OrderModel.schemaName} where ${OrderModel.schema.order_id.name} = @${OrderModel.schema.order_id.name}`);
    
    return result.recordsets;
}

