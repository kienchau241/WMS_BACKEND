const dbConfig = require("../database/dbConfig");
const dbUtils = require("../database/dbUtils");
const OrderLineModel = require("../Model/orderLineModel");

exports.getAllOrderLine = async function(){
    if(!dbConfig.db.pool){
       throw new Error("Not connected to db") ;
    };

    let query = `SELECT * FROM ${OrderLineModel.schemaName}`;
    let countquery = `SELECT COUNT(DISTINCT ${OrderLineModel.schema.line_id.name}) 
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

exports.getOrderLineById = async function(id){
    if(!dbConfig.db.pool){
        throw new Error("Not connected to db") ;
    };

    let result = await dbConfig.db.pool 
        .request()
        .input(OrderLineModel.schema.line_id.name, OrderLineModel.schema.line_id.sqlType, id)
        .query(`Select * from ${OrderLineModel.schemaName} 
            where ${OrderLineModel.schema.line_id.name} = @${OrderLineModel.schema.line_id.name}`)

    if(result.recordsets[0].length > 0){
        return result.recordsets[0];
    };
    return null;
};

exports.createOrderLine = async function(orderLine){
    if(!dbConfig.db.pool){
        throw new Error("Not connected to db") ;
    };

    let insertData = OrderLineModel.validateData(orderLine);
    let query =`insert into ${OrderLineModel.schemaName} values`;

    const {request, insertFieldNameStr, insertValueStr} = dbUtils.getInsertQuery(
        OrderLineModel.schemaName,
        dbConfig.db.pool.request(),
        insertData
    );

    query += `(${insertFieldNameStr}) values (${insertValueStr})`;

    let result= await request.query(query);

    return result.recordsets;
};

exports.updateOrderLine = async function(updateData){
    if(!dbConfig.db.pool){
        throw new Error("Not connected to db") ;
    };

    if(!updateData){
        throw new Error("Invalid update param")
    }

    let query = `update ${OrderLineModel.schemaName} set`;

    const {request, updateStr} = dbUtils.getUpdateQuery(
        OrderLineModel.schema,
        dbConfig.db.pool.request(),
        updateData
    );

    if(!updateStr){
        throw new Error("Invalid update param")
    }

    request.input(OrderLineModel.schemaName.line_id.name, OrderLineModel.schema.line_id.sqlType, id);
    query += 
        " " + 
        updateStr +
        `where ${OrderLineModel.schemaName.line_id.name} = @${OrderLineModel.schemaName.line_id.name}`;

    console.log(query);

    let result = await request.query(query);

    return result.recordsets;

};

exports.deleteOrderLine = async function(id){
    if(!dbConfig.db.pool){
        throw new Error("Not connected to db") ;
    };

    let result = await dbConfig.db.pool 
        .request()
        .input(OrderLineModel.schema.line_id.name, OrderLineModel.schema.line_id.sqlType, id)
        .query(`delete ${OrderLineModel.schemaName} 
            where ${OrderLineModel.schema.line_id.name} = @${OrderLineModel.schema.line_id.name}`);
    
    if(result.recordsets[0].length >0){
        return result.recordsets[0];
    }

    return null;
}