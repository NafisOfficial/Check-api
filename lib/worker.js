// dependencies 
const Url = require('url');
const http = require('http');
const https = require('https');
const lib = require('../lib/data');
const { parseJSON } = require('../helpers/utilities');


// module scaffolding 
const worker = {};


// look up all ther checks from database
worker.gatherAllChecks = () => {
    //get all the check
    lib.list('checks', (error, checks) => {
        if (!err && checks && checks.length > 0) {
            checks.forEach(check => {
                lib.read('checks', check, (error, originalCheckData) => {
                    if (!error && originalCheckData) {
                        //pass data to the check validator
                        worker.validateCheckData(parseJSON(originalCheckData));
                    } else {
                        console.log("error: could not find check data");
                    }
                })
            })
        } else {
            console.log("could not find any checks to process !");
        }
    })
}

//validate check data 
worker.validateCheckData = (checkObject) => {
    if (checkObject && checkObject.id) {
        checkObject.state = typeof (checkObject.state) === 'string' && ['up', 'down'].indexOf(checkObject.state) > -1 ? checkObject.state : "down";

        checkObject.lastCheck = typeof (checkObject.lastCheck) === 'number' && checkObject.lastCheck > 0 ? checkObject.lastCheck : false;

        worker.performCheck(checkObject)
    } else {
        console.log("error: check was invalid or not properly formatted");
    }

}

// perform check 
worker.performCheck = (checkObject) => {
    //prepare the check outcome 
    let checkOutCome = {
        'error': false,
        'responseCode': false
    }
    // mark the outcome has not been sent yet
    let outComeSent = false;

    let parsedUrl = Url.parse(checkObject.protocol + "://" + checkObject.url, true);
    const hostName = parsedUrl.hostname;
    const path = parsedUrl.path;
    //construct the request
    const requestDetails = {
        "protocol": checkObject.protocol + ":",
        "hostname": hostName,
        "method": parsedUrl.method.toUpperCase(),
        "path": path,
        "timeout": checkObject.timeOutSeconds * 1000,
    };

    const protocolToUse = checkObject.protocol === 'http' ? http : https;
    let req = protocolToUse.request(requestDetails, (res) => {
        // check the status of the response
        const status = res.statusCode;
        //update the check outcome and pass to the next process
        checkOutCome.responseCode = status;
        if (!outComeSent) {
            worker.processCheckOutCome(checkObject, checkOutCome);
            outComeSent = true;
        }
    })

    req.on('error', (error) => {
        checkOutCome = {
            error: true,
            value: e
        }
        worker.processCheckOutCome(checkObject, checkOutCome);
        outComeSent = true;
    })
    req.on('timeout', () => {
        checkOutCome = {
            error: true,
            value: "timeout"
        }
        worker.processCheckOutCome(checkObject, checkOutCome);
        outComeSent = true;
    })

}

worker.processCheckOutCome = (checkObject, checkOutCome) =>{
    //check if check outcome is up or down
    let State = !checkOutCome.error && checkOutCome.responseCode && checkObject.successCode.indexOf(checkOutCome.responseCode) > -1 ? 'up' : 'down';
    //decide we should alert the user or not 
    let alertWanted = checkObject.lastCheck && checkObject.state !== State ? true : false;

    //update the check data 
    const newCheckData = checkObject;

    newCheckData.State = State;
    newCheckData.lastCheck = Date.now();

    //update check to disk
    lib.update('checks',newCheckData.id,newCheckData,(error)=>{
        if(!error){
            // send the check data to alert process
            if(alertWanted){
                // todo:: make a twillio alert system and alert 
                console.log("alart");
            }else{
                // todo:: make a twillio alert system and alert
                console.log("all are ok");
            }
        }else{
            console.log("error : trying to save check data of one of the checks");
        }
    })

}




// timer to execute worker process once per minute
worker.loop = () => {
    setInterval(() => {
        worker.gatherAllChecks();
    }, 1000 * 60)
}

worker.init = () => {
    // execute all the checks 
    worker.gatherAllChecks();
    // call the loop so that checks  continue 
    worker.loop();
}



module.exports = worker;