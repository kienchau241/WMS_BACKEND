const dbConfig = require("../database/dbConfig");
const dbUtils = require("../database/dbUtils");
const ProductModel = require("../Model/ProductModel");

exports.getAllProduct = async function(){
    if(!dbConfig.db.pool){
        throw new Error("Not connected to db")
    }

    let query = `select * from ${ProductModel.schemaName}`;
    let countquery = `SELECT COUNT(DISTINCT ${ProductModel.schema.product_id.name}) 
        as totalItem from ${ProductModel.schemaName}`;

    const page = filter.page * 1 || 1;
    let pageSize = filter.pageSize * 1 || StaticData.config.MAX_PAGE_SIZE;
    if(pageSize > StaticData.config.MAX_PAGE_SIZE){
        pageSize = StaticData.config.MAX_PAGE_SIZE;
    }

    const {filterStr, paginationStr} = dbUtils.getFilterQuery(
        ProductModel.schema,
        filter,
        page, 
        pageSize,
        ProductModel.defaultSort
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
        products : result.recordsets[0],
    };
}

exports.getProductById = async function(Id){
    if(!dbConfig.db.pool){
        throw new Error("Not connected to db")
    }
    let query = `select * from ${ProductModel.schemaName}
        where ${ProductModel.schema.product_id.name} = @${ProductModel.schema.product_id.name}`;
    
    let result = await dbConfig.db.pool 
        .request()
        .input(ProductModel.schema.product_id.name, ProductModel.schema.product_id.sqlType, Id)
        .query(query)

    if(result.recordsets[0].length > 0){
        return result.recordsets[0];
    }

    return null;
}

exports.updateProduct = async function(id,insertData){
    if(!dbConfig.db.pool){
        throw new Error("Not connected to db")
    }
    if(!updateData){
        throw new Error("Invalid update param");
    }

    let query = `update ${ProductModel.schemaName} set`;

    const {request, updateStr} = dbUtils.getUpdateQuery(
        ProductModel.schema,
        dbConfig.db.pool.request(),
        insertData
    );

    if(!updateStr){
        throw new Error("Invalid update param");
    }

    request.input(ProductModel.schema.product_id.name, ProductModel.schema.product_id.sqlType, id);
    query += 
        " " + 
        updateStr +
        `where ${ProductModel.schema.product_id.name} = @${ProductModel.schema.product_id.name}`;

    let result = await request.query(query);

    return result.recordsets;
}

exports.createProduct = async function(productData){
    if(!dbConfig){
        throw new Error("Not connected to db");
    }

    let insertData = ProductModel.validateData(productData);
    let query = `insert ${ProductModel.schemaName} into`;

    const {request, insertFieldNameStr, insertValueStr} = dbUtils.getInsertQuery(
        ProductModel.schemaName,
        dbConfig.db.pool.request(),
        insertData
    );

    query += `(${insertFieldNameStr}) values (${insertValueStr})`;

    let result = await request.query(query);

    return result.recordsets;
}

exports.deleteProduct = async function(id){
    if(!dbConfig.db.pool){
        throw new Error('Not connected to db');
    };

    let query = `delete ${ProductModel.schemaName} 
        where ${ProductModel.schema.product_id.name} = @${ProductModel.schema.product_id.name}`;

    let result = await dbConfig.db.pool 
        .request()
        .input(ProductModel.schema.product_id.name, ProductModel.schema.product_id.sqlType, id)
        .query(query)

    if(result.recordsets[0].length > 0){
        return result.recordsets[0];
    }
    return null;
}