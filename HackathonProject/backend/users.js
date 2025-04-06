import express from 'express';
import { db } from "./firebase.js";
import { collection, getDocs, doc, setDoc, addDoc, getDoc, where, query} from "firebase/firestore";

const router = express.Router();

// helper function to get user profile data
export async function getUserById(userId) {
    const docRef = doc(db, "users", userId);
        
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
       return docSnap.data();
        
    } else {
        throw new Error("User not found");
    }

}

// helper function to check if user already exists
export async function userExists(email) {
    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnap = await getDocs(q);

    return !querySnap.empty;
}

router.get("/", async (req, res) => {
    try {
        let ret = [];
        const docRef = await getDocs(collection(db, "users"));
    
        docRef.forEach((doc) => {
            ret.push({
                id: doc.id,
                ...doc.data()
            })
        }) 

        res.status(200).json(ret)
    } catch(e) {
        res.status(400).json({error: `Error fetching user data ${e}`})
    }
})

router.post("/create", async (req, res) =>{
    const { class_year, email, password, username } = req.body;

    if ( !class_year || !email || !password || !username) {
        return res.status(400).send('Missing required fields');
    }

    if (userExists(email)) {
        return res.status(400).send("User already exists!");
    }

    try {
        const userData = {
            class_year: class_year,
            group_id: null,
            room_id: null,
            email: email,
            password: password,
            username: username
        };

        const userCollection = collection(db, "users");
        const docRef = await addDoc(userCollection, userData);

        res.status(200).json({
            message: 'User profile created successfully',
            userId: docRef.id
        });
    } catch (error) {
        console.error("Error creating user profile:", error);
        res.status(500).send('Internal server error');
    }
})


// get user profile data
router.get("/:id", async (req, res) => {
    try {
        const user = await getUserById(req.params.id);
        res.status(200).json(user);
        
    } catch (e) {
        res.status(400).json({error: `Error fetching user data ${e}`})
    }
})


export async function getRoommatesByUserId(userId) {
    const user = await getUserById(userId);
  
    if (!user || !user.group_id) {
      throw new Error("User not found or not in a group");
    }
  
    const q = query(collection(db, "users"), where("group_id", "==", user.group_id));
    const querySnap = await getDocs(q);
  
    const usersInGroup = [];
    querySnap.forEach((doc) => {
      usersInGroup.push({
        id: doc.id,
        ...doc.data()
      });
    });
  
    return usersInGroup;
  }


router.get("/roommates/:id", async (req, res) => {
    try {
      const roommates = await getRoommatesByUserId(req.params.id);
  
      res.status(200).json({
        message: "Fetched roommates successfully",
        roommates: roommates
      });
    } catch (error) {
      console.error("Error fetching roommates:", error);
      res.status(400).json({ error: error.message });
    }
  });



router.post("/addToGroup", async (req, res) => {
    const { currId, roommateId } = req.body;
  
    try {
      // 1. Get current user
      const currUser = await getUserById(currId);
      if (!currUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const roommate = await getUserById(roommateId);
      if (!roommate) {
        return res.status(404).json({ error: "Roommate not found" });
      }

      let group_id = currUser.group_id;
      let class_year = Math.max(currUser.class_year, roommate.class_year);
      let room_id = null;
  
      // 2. If current user has no group, create one and assign
      if (!group_id) {
        group_id = Math.random().toString(36).substring(2, 10);
  
        await Promise.all([
          // Create a new group doc
          addDoc(collection(db, "roommate_groups"), { group_id }),
  
          // Update current user with group_id
          setDoc(doc(db, "users", currId), { group_id, room_id }, { merge: true }),
        ]);
      }
  
      // 3. Add roommate to the group + change class year to curr user's class year
      // this assumes that the roommate doesn't already have a group
      await setDoc(doc(db, "users", roommateId), { group_id, class_year, room_id }, { merge: true });
  
      // 4. Respond success
      return res.status(200).json({ message: "Successfully added to group", group_id });
    } catch (error) {
      console.error("Error in /addToGroup:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

router.post("/leaveGroup/:id", async(req, res) => {
    try {

        let group_id = null;
        let room_id = null;

        await Promise.all([
            // Update current user with group_id
            setDoc(doc(db, "users", req.params.id), { group_id, room_id }, { merge: true }),
          ]);

          return res.status(200).json({ message: "Successfully left the group"});

    } catch (error) {
        console.error("Error in /leaveGroup:", error);
        return res.status(500).json({ error: "Internal server error" });

    }
})


router.post("/selectRoom", async (req, res) => {
    const { currId, roommateId } = req.body;
  
  });
  

export default router;