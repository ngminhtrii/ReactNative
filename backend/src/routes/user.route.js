const express = require("express");
const {
  getUsers,
  postCreateUser,
  putUpdateUser,
  deleteUserController,
} = require("../controllers/user.controller");

const router = express.Router();

router.get("/", getUsers);
router.post("/", postCreateUser);
router.put("/:userId", putUpdateUser);
router.delete("/:userId", deleteUserController);

module.exports = router;
