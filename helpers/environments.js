const environments = {};


environments.dev = {
    port: 3000,
    envName: "developerMode",
    secretKey: "iLoveDevSecretKeyasdfghjkl"
}

environments.production = {
    port: 5000,
    envName: "production",
    secretKey: "iLoveProductionSecretKeyqwertyuiop"
}

//determine which environment was pass
const currentEnvironments = typeof(process.env.NODE_ENV) === "string" ? process.env.NODE_ENV : "developerMode";

const environmentToExport = typeof(environments[currentEnvironments]) ==="object" ? environments[currentEnvironments] : environments.dev;

module.exports = environmentToExport;