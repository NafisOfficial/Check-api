const fs = require("fs");
const path = require('path');

const lib = {};
//get base directory
lib.baseDir = path.join(__dirname, "../.data/");


// open and write file
lib.create = (folderName, fileName, data, callback) => {
    fs.open(lib.baseDir + folderName + '/' + fileName + ".json", 'wx', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            const stringData = JSON.stringify(data);
            fs.writeFile(fileDescriptor, stringData, (err) => {
                if (!err) {
                    fs.close(fileDescriptor, (err) => {
                        if (!err) {
                            callback(false);
                        } else {
                            callback("there was an error: file close failed");
                        }
                    });
                } else {
                    callback("there was an error: Failed to write file");
                }
            });
        } else {
            callback("there was an error: file may already exists");
        }
    })
}

// read data from file
lib.read = (folderName, fileName, callback) => {
    fs.readFile(lib.baseDir + folderName + '/' + fileName + ".json", "utf-8", (err, data) => {
        callback(err, data);
    })
}

//update existing file
lib.update = (folderName, fileName, data, callback) => {
    fs.open(lib.baseDir + folderName + '/' + fileName + ".json", 'r+', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            const stringData = JSON.stringify(data);
            fs.ftruncate(fileDescriptor, (err) => {
                if (!err) {
                    fs.writeFile(fileDescriptor, stringData, (err) => {
                        if (!err) {
                            fs.close(fileDescriptor, (err) => {
                                if (!err) {
                                    callback(false);
                                } else {
                                    callback("there was an error: file close failed");
                                }
                            });
                        } else {
                            callback("there was an error: file write to update failed");
                        }
                    });
                } else {
                    callback("there was an error: Failed to truncate file");
                }
            });
        } else {
            callback("there was an error: file update failed ");
        }
    })
}

lib.delete=(folderName,fileName,callback)=>{
fs.unlink(lib.baseDir + folderName + '/' + fileName + ".json",(err)=>{
    if(!err){
        callback("message: Delete successful");
    }else{
        callback("error: delete failed");
    }
})
}

module.exports = lib;