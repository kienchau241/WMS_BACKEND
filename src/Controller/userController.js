const userDAO = require("../DAO/userDAO");

exports.getAllUser = async function(req, res){
    //console.log(req.query)
    try{
        const {page, pageSize, totalPage, totalItem, users} = await userDAO.getAllUser(req.query);
        res.status(200).json({
            code:200,
            msg:"Get all users successs !",
            page,
            pageSize,
            totalPage,
            totalItem,
            data:{
                users
            }
        })
    } catch(e){
        console.error(e);
        res
        .status(500) // 500 - Internal Error
        .json({
            code: 500,
            msg: e.toString(),
        });
    }   
}