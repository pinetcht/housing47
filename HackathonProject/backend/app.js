
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import dormsRouter from "./dorms.js";
import userRouter from "./users.js";
// import favoritesRouter from "./favorites.js";
// import floorsRouter from "./floors.js";
// import suitesRouter from "./suites.js";
// import roommatesRouter from "./roommates.js";
// import roomsRouter from "./rooms.js";

const app = express();
const port = 5001;


app.use(cors())
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/", (req, res) => {
    res.send("Hello, world!");
  });


/* --------------------------------- EXPRESS ROUTES ------------------------------------- */
app.use(express.json());

app.use("/dorms", dormsRouter);
// app.use("/floors", floorsRouter);
// app.use("/suites", suitesRouter);
// app.use("/rooms", roomsRouter);
app.use("/users", userRouter);
// app.use("/roommates", roommatesRouter);
// app.use("/favorites", favoritesRouter);


/* ---------------------------------------------------------------------------------------- */
