const dbConfig = require("../database/dbConfig");
const dbUtils = require("../database/dbUtils");
const InventoryModel = require("../Model/InventoryModel");

exports.getAllInventory = async function(){
    if(!dbConfig.db.pool){
        throw new Error("Not connected to db")
    }

    let query = `Select * from ${InventoryModel.schemaName}`;
    let countquery = `SELECT COUNT(DISTINCT ${InventoryModel.schema.inventory_id.name}) 
        as totalItem from ${InventoryModel.schemaName}`;

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

    if(filterStr){
        query = " "+ paginationStr;
    }

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
        Inventories : result.recordsets[0],
    };
};

exports.getInventoryById = async function(id){
    if(!dbConfig.db.pool){
        throw new Error("Not connected to db")
    }

    const result = await dbConfig.db.pool   
        .request()
        .input(InventoryModel.schema.inventory_id.name, InventoryModel.schema.inventory_id.sqlType, id)
        .query(`select * from ${InventoryModel.schemaName} where ${InventoryModel.schema.inventory_id.name} = @${InventoryModel.schema.inventory_id.name}`)

    if(result.recordsets[0] > 0){
        return result.recordsets[0]
    }
    return null;
}

exports.createInventory = async function(inventoryData){
    if(!dbConfig.db.pool){
        throw new Error("Not connected to db");
    }

    let insertData = InventoryModel.validateData(inventoryData);
}