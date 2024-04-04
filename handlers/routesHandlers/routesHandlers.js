const routesHandler = {};

routesHandler.sampleHandler=(requestProperties, callback)=>{

    callback(200, {
        message: "Sample handler is running"
    })
}
module.exports = routesHandler;