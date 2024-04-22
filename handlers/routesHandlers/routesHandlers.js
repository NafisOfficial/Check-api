const handler = {};

handler.sampleHandler = (requestProperties, callback) => {

    callback(200, {
        message: "Sample handler is running"
    })
}
module.exports = handler;