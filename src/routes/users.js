const express = require("express");
const { handleSignup, handleLogin } = require("../controller/users");
const router = express.Router();

router.post("/signup", handleSignup);
router.post("/login", handleLogin);

module.exports = router;