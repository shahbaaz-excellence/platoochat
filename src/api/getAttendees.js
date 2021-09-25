import { RealTimeDb } from "../config/firebaseConfig";
import { subdomain } from "../constants/constants";

export const getAllAttendees = async () => {
  try {
    let users = [];
    RealTimeDb.ref(`users/${subdomain}/`).on("value", (snapshot) => {
      snapshot.forEach((snap) => {
        // console.log(snap.val(), "usersssssss")
        users.push({
          name: snap.val().name,
          status: snap.val().status,
        })
      })
    })
    return users;
  }
  catch (err) {
    throw err.response.data;
  }
}