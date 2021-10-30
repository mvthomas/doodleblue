import { db } from '../firebaseConfig';
import { collection, getDocs, getDoc, doc, deleteDoc, setDoc } from "firebase/firestore";


const getDB = async (id) => {
    const db_ = await getDocs(collection(db, id));
    let dbData = []
    db_.forEach((doc) => {
        dbData.push(doc.data())
    });
    return dbData
}

const addUser=async(data)=>{
    const uid = collection(db, "uid");
    const docRef = doc(db, "uid", data.email);
    const docSnap = await getDoc(docRef);
    try {
        const docRef = await setDoc(doc(uid, data.email), {
            name: data.name,
            email: data.email,
            phone: data.phone,
            company: data.company,
            id:data.id
        });
        if (docSnap.exists()) {
            return {status:false, data:"Document Already exists and updated!"}
        } else return {status:true, data:docRef}
      } catch (e) {
        return {status:false, data:"Error adding document :"+e}
      }
}

const deleteUser=async(data)=>{
    let response = await deleteDoc(doc(db, "uid", data));
    return response
}

const updateChat=async(id, data)=>{
    const chats = collection(db, "chats");
    try{
        const docRef = await setDoc(doc(chats, id), data);
        return true
    } catch (e) { return e}
}

export {getDB, addUser, deleteUser, updateChat}