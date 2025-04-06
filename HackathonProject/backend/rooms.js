import express from 'express';
import { db } from "./firebase.js";
import { getRoommatesByUserId, getUserById } from "./users.js";
import { collection, getDocs } from "firebase/firestore";

const router = express.Router();


// helper function to get all dorms
export async function getRooms() {
    let ret = [];
    const docRef = await getDocs(collection(db, "rooms"));

    if (docRef) {
        docRef.forEach((doc) => {
            ret.push({
                id: doc.id,
                ...doc.data()
            })
        })

        return ret;
    } else {
        throw new Error("Can't fetch rooms");
    }
}

router.get("/", async (req, res) => {
    try {
        const rooms = await getRooms();
        res.status(200).json(rooms)
    } catch (e) {
        res.status(400).json({ error: `Error fetching room data ${e}` })
    }
})

export async function filterRooms(user_id) {
    const rooms = await getRooms();
    const user = await getUserById(user_id);

    if (!rooms) {
        throw new Error("Can't fetch rooms");
    }

    if (!user) {
        throw new Error("Can't fetch user");
    }

    const userGroup = await getRoommatesByUserId(user_id);
    const numMembers = userGroup.length;
    const classYear = user.class_year;

    console.log("rooms ", rooms);

    let filteredRooms = [];
    rooms.forEach((room) => {
        if(!room.is_taken && room.capacity == numMembers && room.class_year == classYear){
            filteredRooms.push({
                id: room.id,
                ...room
            })
        }

    });

    return filteredRooms;

}

router.get("/filtered/:id", async (req, res) => {
    try {
        const filteredRooms = await filterRooms(req.params.id);
        res.status(200).json(filteredRooms)
    } catch (e) {
        res.status(400).json({ error: `Error fetching filtered data ${e}` })
    }
})

export default router;