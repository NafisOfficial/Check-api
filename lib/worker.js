// dependencies 
const lib = require('../lib/data')


// module scaffolding 
const worker = {};


// look up all ther checks from database
worker.gatherAllChecks = () =>{
    //get all the check
    lib.list('checks',(error,checks)=>{
        if(!err && checks && checks.length> 0){
            checks.forEach(check=>{
                lib.read('checks',check,(error,originalCheckData)=>{
                    if(!error && originalCheckData){
                        //pass data to the check validator
                        
                    }else{
                        console.log("error: could not find check data");
                    }
                })
            })
        }else{
            console.log("could not find any checks to process !");
        }
    })
}
// timer to execute worker process once per minute
worker.loop = () =>{
    setInterval(()=>{
        worker.gatherAllChecks();
    }, 1000*60)
}

worker.init=()=>{
    // execute all the checks 
    worker.gatherAllChecks();
    // call the loop so that checks  continue 
    worker.loop();
}



module.exports = worker;