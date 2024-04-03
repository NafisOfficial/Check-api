const routesHandler = {};

routesHandler.sampleHandler=(requestProperties, callback)=>{

    console.log(requestProperties);
    callback(200, {
        message: "Sample handler is running"
    })
}
module.exports = routesHandler;