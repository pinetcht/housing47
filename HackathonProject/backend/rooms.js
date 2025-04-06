import express from 'express';
import { db } from "./firebase.js";
import { getRoommatesByUserId, getUserById } from "./users.js";
import { collection, getDocs, getDoc, setDoc, doc, query, where } from "firebase/firestore";

const router = express.Router();


// helper function to get all dorms
// Helper function to get a room by its ID
export async function getRoomById(roomId) {
    try {
        const roomDoc = await getDoc(doc(db, "rooms", roomId));
        
        if (roomDoc.exists()) {
            return {
                id: roomDoc.id,
                ...roomDoc.data()
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error getting room by ID:", error);
        throw error;
    }
}

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

    const filteredRooms = rooms.filter(room =>
        !room.is_taken &&
        room.capacity === numMembers &&
        room.class_year === classYear
      );

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



// helper function to get all dorms
export async function getRoomByNum(roomNumber) {
    const q = query(collection(db, "rooms"), where("room_number", "==", roomNumber));
    const querySnap = await getDocs(q);
  
    const rooms = [];
    querySnap.forEach((doc) => {
        rooms.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // more than one room with same room number
    if (rooms.length > 1) {
        return res.status(409).json({
            error: "Multiple rooms found with this room number. Please contact support.",
        });
    }

    // Handle no match
    if (rooms.length === 0) {
        return res.status(404).json({ error: "Room not found." });
    } 

    return rooms[0];
}


router.get("/get_room/:roomNumber", async (req, res) => {
    try {
        const room = await getRoomByNum(req.params.roomNumber);
        res.status(200).json(room)
    } catch (e) {
        res.status(400).json({ error: `Error fetching room data ${e}` })
    }
})

router.get("/get_room_by_id/:roomId", async (req, res) => {
    try {
        const roomId = req.params.roomId;
        const roomDoc = await getDoc(doc(db, "rooms", roomId));
        
        if (roomDoc.exists()) {
            const roomData = {
                id: roomDoc.id,
                ...roomDoc.data()
            };
            res.status(200).json(roomData);
        } else {
            res.status(404).json({ error: "Room not found" });
        }
    } catch (error) {
        console.error("Error getting room by ID:", error);
        res.status(400).json({ error: `Error fetching room data: ${error.message}` });
    }
});

router.post("/selectRoom", async (req, res) => {
    const { room_id, user_id } = req.body;

    try {
        const room = await getRoomById(room_id);
        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }

        const user = await getUserById(user_id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // If user doesn't have a group, create a personal group for them
        let group_id = user.group_id;
        if (!group_id) {
            // Create a new personal group
            const newGroupRef = doc(collection(db, "groups"));
            await setDoc(newGroupRef, {
                name: `${user.name}'s Room`,
                created_at: new Date(),
                members: [user_id]
            });
            
            group_id = newGroupRef.id;
            
            // Update the user with the new group_id
            await setDoc(doc(db, "users", user_id), { group_id }, { merge: true });
        }

        // Now we have a valid group_id to use
        await Promise.all([
            // Update current room with group_id
            setDoc(doc(db, "rooms", room_id), { 
                assigned_group_id: group_id, 
                is_taken: true 
            }, { merge: true }),
        ]);

        const userGroup = await getRoommatesByUserId(user_id);
        
        await Promise.all(
            userGroup.map((user) =>
                setDoc(doc(db, "users", user.id), { room_id: room_id }, { merge: true })
            )
        );

        res.status(200).json("Successfully selected rooms");
        
    } catch (e) {
        console.error("Error in selectRoom:", e);
        res.status(400).json({ error: `Error selecting room: ${e.message}` });
    }
});

router.post("/unselectRoom", async (req, res) => {
    const { room_id, user_id } = req.body;

    try {
        const room = await getRoomById(room_id);
        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }

        const user = await getUserById(user_id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }


        await Promise.all([
            // Reset group_id to null and is_taken to false
            setDoc(doc(db, "rooms", room_id), { assigned_group_id: null, is_taken: false  }, { merge: true }),
        ]);

        const userGroup = await getRoommatesByUserId(user_id);
        await Promise.all(
            userGroup.map((user) =>
                setDoc(doc(db, "users", user.id), { room_id: null }, { merge: true })
            )
        );

        res.status(200).json("Successfully unselected rooms");
    
        
    } catch (e) {
        res.status(400).json({ error: `Error unselecting room ${e}` })
    }
})

export default router;