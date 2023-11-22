const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const { getAll, get, save, update, remove } = require("../controller/recipes");

router.route('/').get(getAll).post(auth.authenticate(), save);

// Modify the following line
router.route("/:id").get(get).put(update).delete(remove);

module.exports = router;