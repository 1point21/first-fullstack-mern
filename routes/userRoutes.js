const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController")

// at this point are already in /users
router.route("/")
    .get(usersController.getAllUsers)
    .post(usersController.createNewUser)
    .patch(usersController.updateUser)
    .delete(usersController.deleteUser)

module.exports = router