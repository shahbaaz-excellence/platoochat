import React, { useState } from "react";
import send from "../assets/send.svg";
import attachment from "../assets/attachment.svg";
import smiley from "../assets/smiley.svg";
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart';
import { auth } from "../config/firebaseConfig";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { profileImage, subdomain } from "../constants/constants";
import { RealTimeDb } from "../config/firebaseConfig";

const InputChat = ({ userDetails }) => {
  const [previewEmoji, setPreviewEmoji] = useState(false);
  const [content, setcontent] = useState("");

  const user = auth.currentUser;

  const addEmoji = (e) => {
    let emoji = content + e.native;
    handleChange(emoji);
  };

  const handleSend = (e) => {
    e.preventDefault();
    setPreviewEmoji(false);
    handleSubmit(e);
  }

  const handleChange = (file) => {
    if (typeof file === "string") {
      setcontent(file);
      return;
    }
    // setLoading(true);
    //uploading the image and setting the details of image for the same to show it on the chat list
    const name = file?.name;
    // const metadata = { contentType: file?.type };
    // const uploader = getStorage().child(name).put(file, metadata);
    const storage = getStorage();
    const storageRef = ref(storage, name);
    const metadata = {
      contentType: file.type,
    };
    const uploadTask = uploadBytes(storageRef, file, metadata)
      .then((snapshot) => snapshot.getDownloadURL())
      .then((url) => {
        const uploadedFile = {
          name: file.name,
          type: file.type,
          url,
        };
        handleSubmit(uploadedFile);
        // setLoading(false);
      })
      .catch((error) => {
        console.log("eeeeeee");
        // setLoading(false);
      });
  };


  const handleSubmit = async (file) => {
    let data = {
      content: content,
      timestamp: Date.now(),
      type: userDetails.type,
      [userDetails.uid]: "unread",
      recipient: userDetails.type === "privateChat" ? userDetails.uid : userDetails.type,
      recipientName: userDetails.name,
      recipientPhotoURL: userDetails.type === "privateChat" ? userDetails?.photoURL : "",
      roomid: userDetails.roomId,
      sender: user?.uid,
      senderName: user?.displayName,
      senderPhotoURL: profileImage,
      uid: user?.uid,
      username: user?.displayName,
    };

    if (file && file.hasOwnProperty("url")) {
      data.file = file;
    }
    if (file && file.hasOwnProperty("chat")) {
      data.chat = file;
      data.content = `${user?.displayName} is calling. Accept the call`;
    }
    if (
      typeof file === "string" &&
      (file?.includes(" has been added to the group") ||
        file?.includes(" has been removed from the group") ||
        file.includes("Created "))
    ) {
      data.content = file;
    }

    if (typeof file === "string" && file?.includes("https://")) {
      data.content = file;
    }

    if (
      typeof file === "string" &&
      file?.includes(
        "Nice to meet you. It seems we have same areas of interest, would you be interested in having a conversion with me"
      )
    ) {
      data.content = file;
    }

    if (file && file.hasOwnProperty("hangedUp")) {
      data.hangedUp = file;
      data.content = file.content;
    }

    if (file && file.hasOwnProperty("url")) {
      data.file = file;
    }
    try {
      setcontent("");
      userDetails.uid !== null && user.uid && data.type === "privateChat" &&
        (await RealTimeDb.ref(`users/${subdomain}/${userDetails.uid}/recentMessage/${user.uid}`).set(data));

      userDetails.uid !== null && user.uid && data.type === "privateChat" &&
        (await RealTimeDb.ref(`users/${subdomain}/${user.uid}/recentMessage/${userDetails.uid}`).set(data));

      await RealTimeDb.ref(`chats/${subdomain}/${userDetails.roomId}`).push(data);

      // data?.type === "customGroup" &&
      //   groupMembers.forEach((val) => {
      //     val.uid === user.uid
      //       ? (data[val.uid] = "read")
      //       : (data[val.uid] = "unread");
      //     RealTimeDb.ref(
      //       `users/${subdomain}/${val.uid}/customGroup/${groupKey}/lastMessage`
      //     ).set(data);
      //   });

      // data?.type === "auditoriumGroup" &&
      //   RealTimeDb
      //     .ref(`auditoriumGroup/${subdomain}/${user.roomid}/lastMessage`)
      //     .set(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <form onSubmit={(e) => handleSend(e)} style={{ position: "fixed", bottom: 0, display: "flex", flexDirection: "row", alignItems: "center", background: "white" }}>
        <div onClick={() => setPreviewEmoji(!previewEmoji)} style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 30, width: 40, cursor: "pointer" }}>
          <img src={smiley} alt="smiley" />
        </div>
        {previewEmoji &&
          <Picker set="google" onClick={addEmoji} sheetSize={20}
            style={{ position: 'absolute', bottom: '100%', left: "2%", right: "2%", padding: 0, zIndex: 1, maxWidth: "96%" }}
            showPreview={false}
            showSkinTones={false}
          />
        }
        <input
          placeholder="Type your message"
          required
          value={content}
          onChange={(e) => { handleChange(e.target.value); setPreviewEmoji(false) }}
          style={{ width: "253px", height: 40, border: "none", outline: "none" }} />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 30, width: 40, cursor: "pointer" }}>
          <input style={{ display: "none" }} id="fileUpload" type="file" onChange={e => { handleChange(e.target.files[0]) }} />
          <label style={{ cursor: "pointer" }} for="fileUpload"><img src={attachment} alt="attach file" /></label>
        </div>
        <div onClick={(e) => handleSend(e)} style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 30, width: 40, cursor: "pointer" }}>
          <img src={send} alt="send" />
        </div>
      </form>
    </>
  );
}

export default InputChat;