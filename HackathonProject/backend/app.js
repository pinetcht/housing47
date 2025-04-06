
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import dormsRouter from "./dorms.js";
import userRouter from "./users.js";
// import favoritesRouter from "./favorites.js";
// import floorsRouter from "./floors.js";
// import suitesRouter from "./suites.js";
// import roommatesRouter from "./roommates.js";
import roomsRouter from "./rooms.js";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase.js";

const app = express();
const port = 5001;
app.use(express.json());


app.use(cors())
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get("/", (req, res) => {
    res.send("Hello, world!");
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const q = query(collection(db, "users"), where("email", "==", email));
        const querySnap = await getDocs(q);

        const userWithEmail = [];
        querySnap.forEach((doc) => {
            userWithEmail.push({
                id: doc.id,
                ...doc.data()
            });
        });

        if (userWithEmail.length > 1) {
            return res.status(409).json({
                error: "Multiple accounts found with this email. Please contact support.",
            });
        }

        // Handle no match
        if (userWithEmail.length === 0) {
            return res.status(404).json({ error: "Email not found." });
        }

        const user = userWithEmail[0];

        // Check password (assuming plain-text for now)
        if (user.password !== password) {
            return res.status(401).json({ error: "Invalid password." });
        }


        // Success!
        res.status(200).json({
            message: "Login successful",
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                group_id: user.group_id,
            },
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Internal server error" });
    }

})




/* --------------------------------- EXPRESS ROUTES ------------------------------------- */

app.use("/dorms", dormsRouter);
// app.use("/floors", floorsRouter);
// app.use("/suites", suitesRouter);
app.use("/rooms", roomsRouter);
app.use("/users", userRouter);
// app.use("/roommates", roommatesRouter);
// app.use("/favorites", favoritesRouter);


/* ---------------------------------------------------------------------------------------- */
