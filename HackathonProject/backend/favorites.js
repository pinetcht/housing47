import express from 'express';
import { db } from "./firebase.js";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getUserById } from "./users.js";

const router = express.Router();


// helper function to get all favorites current user
export async function getFavoritesById(userId) {
    const user = await getUserById(userId);
  
    if (!user) {
      throw new Error("User not found");
    }
  
    const q = query(collection(db, "favorites"), where("user_id", "==", userId));
    const querySnap = await getDocs(q);
  
    const favoritedRooms = [];
    querySnap.forEach((doc) => {
        favoritedRooms.push({
        id: doc.id,
        ...doc.data()
      });
    });
  
    return favoritedRooms;
  }

router.get("/", async (req, res) => {
    const { user_id } = req.body;
    try {
        const favorites = await getFavoritesById(user_id);
        res.status(200).json(favorites)
    } catch (e) {
        res.status(400).json({ error: `Error fetching suites data ${e}` })
    }
})



export default router;