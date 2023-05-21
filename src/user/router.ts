import express from "express";

const router = express.Router()

router.use((req, res, next) => {
  console.log("Обработчик user")
  next()
})

router.post("/login", (req, res) => {
  res.json("login")
})
router.post("/register", (req, res) => {
  res.json("register")
})

export {router}
