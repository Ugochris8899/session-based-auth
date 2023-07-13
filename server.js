require('./config/DB')
const express = require( 'express' );
const session = require("express-session")
const authRouter = require( './routes/userRoute' );
const recordRouter = require( './routes/recordRoutes' );



const app = express();
const PORT = 6666;
// allows data to be passed through request body
app.use( express.json() )

// set up the session middleware
app.use(
    session({
        secret: process.env.SECRETE,
        resave: false,
        saveUninitialized: false,
        cookies: {
            maxAge: 60 * 60 * 1000, // 1 hour
        },
    })
)

app.use("/api", authRouter)
app.use( '/api', recordRouter );

app.listen( PORT, () => {
    console.log( `Server is listening to port: ${ PORT }` );
} );

