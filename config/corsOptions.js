const allowedOrigins = require("./allowedOrigins")

// this followed the docs for cors
const corsOptions = {
    // lookup object
    origin: (origin, callback) => {
        
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) // will allow e.g. insomnia
        {
            callback(null, true)
        }
        else {
            callback(new Error('not allowed by CORS'))
        }
    },
    // handles creds header
    credentials: true,
    // mitigates problems with 204 statuses
    optionsSuccessStatus: 200
}

module.exports = corsOptions