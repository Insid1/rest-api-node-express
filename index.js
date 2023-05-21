import express from "express"
import {router as userRouter} from "./user/router.js";

const PORT = 7070

const app = express()

app.use((req, res, next) => {
  console.log(`Пришел запрос. Время:${Date.now()}`)
  next()
})

app.use("/user", userRouter)

app.get("/hello", (req, res) => {
  // res.sendStatus(201)
  throw new Error("Ошибга")
})

app.use((err, req, res, next) => {
  console.log(err instanceof Error)
  res.status(500)
  if (err instanceof Error) {
    res.json(err.message)
  } else {
    res.json("Unexpected error occurred!")
  }
  // console.log(err.message)
  // next();
  // res.se
})

app.listen(PORT,() => {
  console.log(`Server started on port ${PORT}. GO to http://localhost:${PORT}`)
})
