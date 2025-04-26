import express from "express";
import {prismaClient} from "../../packages/db/index";
import botsRouter from "./routes/bots";



import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());


app.use("/bots", botsRouter);

app.get("/", (req, res) => {
    res.send("Hello World");

});

app.listen(8000, () => {
    console.log("Server is running on port 8000");
});