const express = require( 'express' );
const router = express.Router();
const authController = require("../controllers/userController")
const {getAllUsers} = require("../controllers/userController")

router.post("/signup", authController.signUp);
router.post("/signin", authController.signIn);
router.get("/signout", authController.signOut);
router.get("/getall", getAllUsers )

module.exports = router