import express from 'express';
import { db } from "./firebase.js";
import { collection, getDocs, updateDoc, doc, setDoc, addDoc, deleteDoc, getDoc, where, query} from "firebase/firestore";

const router = express.Router();


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
    const { class_year, email, group_id, password, room_id, username } = req.body;

    if ( !class_year || !email || !password || !room_id ||  !username) {
        return res.status(400).send('Missing required fields');
    }

    try {
        const userData = {
            class_year: class_year,
            email: email,
            group_id: group_id || null,
            password: password,
            room_id: room_id,
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
        const docRef = doc(db, "users", req.params.id);
        
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            res.status(200).json(docSnap.data());
            
        } else {
            console.log("Document does not exist");
        }
    } catch (e) {
        res.status(400).json({error: `Error fetching user data ${e}`})
    }
})

// get current user's roommates
router.get("/roommates/:id", async (req, res) => {

    let group_id = null;

    // get user info
    try {
        const docRef = doc(db, "users", req.params.id);
        
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            group_id = docSnap.data().group_id;
        } else {
            console.log("User does not exist");
        }
    } catch (e) {
        res.status(400).json({error: `Error fetching user data ${e}`})
    }

    // get roommates
    try {
        const q = query(collection(db, "users"), where("group_id", "==", group_id))
        
        const querySnap = await getDocs(q);

        if (querySnap) {
            const usersInGroup = [];

            querySnap.forEach((doc) => {
                // if (doc.id !== req.params.id) {
                //     usersInGroup.push({
                //     id: doc.id,
                //     ...doc.data()
                //     });
                // }

                usersInGroup.push({
                    id: doc.id,
                    ...doc.data()
                    });
                });
                
                res.status(200).json({
                    message: 'Fetched roommates successfully',
                    roommates: usersInGroup
                });
        } else {
            console.log("User does not exist");
        }
    } catch (e) {
        res.status(400).json({error: `Error fetching user data ${e}`})
    }
})


export default router;