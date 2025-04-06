import express from 'express';
import { db } from "./firebase.js";
import { collection, getDocs } from "firebase/firestore";

const router = express.Router();


// helper function to get all dorms
export async function getDorms() {
    let ret = [];
    const docRef = await getDocs(collection(db, "dorms"));

    if (docRef) {
        docRef.forEach((doc) => {
            ret.push({
                id: doc.id,
                ...doc.data()
            })
        })

        return ret;
    } else {
        throw new Error("Can't fetch dorms");
    }
}

router.get("/", async (req, res) => {
    try {
        const dorms = await getDorms();
        res.status(200).json(dorms)
    } catch (e) {
        res.status(400).json({ error: `Error fetching dorms data ${e}` })
    }
})



export default router;