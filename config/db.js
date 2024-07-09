const sql = require('mssql')

const config = {
    user: "sa9",
    password: "1234",
    database: "BackendProjectDB",
    server: 'localhost', //Server to connect to. You can use 'localhost\instance' to connect to named instance.
    port: 1433, //Port to connect to (default: 1433). Don't set when connecting to named instance.
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: false, // for azure use true
        trustServerCertificate: true // use true for local dev / self-signed certs
    }
}
const poolPromise = new sql.ConnectionPool(config).connect().then(pool => {
    console.log("Connected to MSSQL ")
    return pool
}).catch(err => {
    console.log("Connection Faild To Database:", err)
    throw err
})
module.exports = {
    sql, poolPromise
}