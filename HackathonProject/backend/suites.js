import express from 'express';
import { db } from "./firebase.js";
import { collection, getDocs } from "firebase/firestore";

const router = express.Router();


// helper function to get all dorms
export async function getSuites() {
    let ret = [];
    const docRef = await getDocs(collection(db, "suites"));

    if (docRef) {
        docRef.forEach((doc) => {
            ret.push({
                id: doc.id,
                ...doc.data()
            })
        })

        return ret;
    } else {
        throw new Error("Can't fetch suites");
    }
}

router.get("/", async (req, res) => {
    try {
        const dorms = await getSuites();
        res.status(200).json(dorms)
    } catch (e) {
        res.status(400).json({ error: `Error fetching suites data ${e}` })
    }
})



export default router;