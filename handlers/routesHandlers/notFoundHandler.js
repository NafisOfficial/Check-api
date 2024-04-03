const notFoundHandler = {};

notFoundHandler.notFound=(requestProperties, callback)=>{
    callback(404,{
        message: "path doesn't exists",
    })
}

module.exports = notFoundHandler;