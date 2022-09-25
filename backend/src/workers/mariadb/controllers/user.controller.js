const router = require("express");
const userRouter = router.Router();
const userService = require("../services/user.service");

userRouter.get("/users", (req, res) => {
  userService.findAll(req, res);
});

userRouter.get("/users/:id", (req, res) => {
  userService.findById(req, res);
});

userRouter.post("/users", (req, res) => {
  userService.create(req, res);
});

userRouter.put("/users/:id", (req, res) => {
  userService.update(req, res);
});

userRouter.delete("/users/:id", (req, res) => {
  userService.delete(req, res);
});

module.exports = userRouter;
