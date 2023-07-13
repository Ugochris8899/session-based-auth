const userModel = require( '../models/userModel' );
const bcrypt = require( 'bcrypt' );


// sign up a new user
exports.signUp = async (req, res) =>{
    try {
        const { username, email, password} = req.body;

        // check if the email is already registered
        const existingUser = await userModel.findOne({email});
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered"})

        }

        // salt the password
        const saltedPassword =await bcrypt.genSalt( 10 );
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltedPassword);

        // create a new user
        const user = new userModel({
            username,
            email,
            password: hashedPassword,
            // records: [],
        });

        // save the user to the database
        await user.save();

        res.status(201).json({
            message: "User created successfully",
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

// sign in an existing user
exports.signIn = async(req, res) =>{
    try {
        const {email, password} = req.body;

        // check if the user exists
        const user = await userModel.findOne({email});
        if(!user) {
            return res.status(401).json({message: "Invalid credentials"});
        } 

        // compare the passwords
        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch) {
            return res.status(401).json({message: "Invalid credentials"});
        }

        // set user session
        req.session.user = user;

        res.status(200).json({
            message: "User signed in successfully",
            // user
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

//sign out the currently signed-in user
exports.signOut = (req, res) => {
    // destroy the session
    req.session.destroy();
    res.status(200).json({message: "User signed out successfully"});
};


exports.getAllUsers = async ( req, res ) => {
    try {
        const users = await userModel.find();
        if ( users === null ) {
            res.status( 200 ).json( {
                message: "No user found.",
                data: []
            })
        } else {
            res.status( 200 ).json( {
                message: "The number of users are: "+  users.length,
                data: users
            })
        }
    } catch ( e ) {
        res.status( 500 ).json( {
            message: e.message
        })
    }
}

