const router = require("express").Router();
const textController = require("./controllers/textController");
const userController = require("./controllers/userController");

router.post("/text", textController.getText);
router.get("/random-theme", textController.getRandomTheme);

router.post("/user", userController.createUser);
router.post("/stats", userController.createStats);
router.get("/stats", userController.getStats);

module.exports = router;