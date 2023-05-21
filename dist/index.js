import express from "express";
import { router as userRouter } from "./user/router.js";
const PORT = 7070;
const app = express();
app.use((req, res, next) => {
    console.log(`Пришел запрос. Время:${Date.now()}`);
    next();
});
app.use("/user", userRouter);
app.get("/hello", (req, res) => {
    res.sendStatus(201);
});
app.use((err, req, res, next) => {
    res.status(500);
    res.json(err.message);
});
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}. GO to http://localhost:${PORT}`);
});
