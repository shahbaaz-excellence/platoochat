import React, { useState } from "react";
import send from "../assets/send.svg";
import attachment from "../assets/attachment.svg";
import smiley from "../assets/smiley.svg";
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart';
import { auth } from "../config/firebaseConfig";
import { getStorage } from "firebase/storage";

const InputChat = ({userDetails}) => {
  const [previewEmoji, setPreviewEmoji] = useState(false);
  const [content, setcontent] = useState("");

  const user = auth.currentUser;

  const addEmoji = (e) => {
    let emoji = content + e.native;
    handleChange(emoji);
  };

  console.log(user, "uuuu", userDetails);


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
    const metadata = { contentType: file?.type };
    const uploader = getStorage().child(name).put(file, metadata);
    uploader.then((snapshot) => snapshot.ref.getDownloadURL())
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
        // setLoading(false);
      });
  };


  const handleSubmit = async (file) => {
    // let data = {
    //   content: content,
    //   timestamp: Date.now(),
    //   username: userDetails.name,
    //   type: userDetails.type,
    //   [user.uid]: "unread",
    //   recipient: user.uid ? user.uid : "group",
    //   roomid: `${user.roomid}`,
    //   sender: userId,
    //   senderEmail: email,
    //   senderPhotoURL: `${photoURL}`,
    // };

    // if (file && file.hasOwnProperty("url")) {
    //   data.file = file;
    // }
    // if (file && file.hasOwnProperty("chat")) {
    //   data.chat = file;
    //   data.content = `${userName} is calling. Accept the call`;
    // }
    // if (
    //   typeof file === "string" &&
    //   (file?.includes(" has been added to the group") ||
    //     file?.includes(" has been removed from the group") ||
    //     file.includes("Created "))
    // ) {
    //   data.content = file;
    // }

    // if (typeof file === "string" && file?.includes("https://")) {
    //   data.content = file;
    // }

    // if (
    //   typeof file === "string" &&
    //   file?.includes(
    //     "Nice to meet you. It seems we have same areas of interest, would you be interested in having a conversion with me"
    //   )
    // ) {
    //   data.content = file;
    // }

    // if (file && file.hasOwnProperty("hangedUp")) {
    //   data.hangedUp = file;
    //   data.content = file.content;
    // }

    // if (file && file.hasOwnProperty("url")) {
    //   data.file = file;
    // }
    // try {
    //   setcontent("");
    //   user.uid !== null &&
    //     userId &&
    //     data.type === "user" &&
    //     (await db
    //       .ref(`users/${domain}/${user.uid}/recentMessage/${userId}`)
    //       .set(data));
    //   user.uid !== null &&
    //     userId &&
    //     data.type === "user" &&
    //     (await db
    //       .ref(
    //         `users/${domain}/${userId}/recentMessage/${user.uid ? user.uid : "group"
    //         }`
    //       )
    //       .set(data));
    //   await db.ref(`chats/${domain}/${user.roomid}`).push(data);
    //   (await data?.type) === "customGroup" &&
    //     groupMembers.forEach((val) => {
    //       val.uid === userId
    //         ? (data[val.uid] = "read")
    //         : (data[val.uid] = "unread");
    //       db?.ref(
    //         `users/${domain}/${val.uid}/customGroup/${groupKey}/lastMessage`
    //       ).set(data);
    //     });

    //   (await data?.type) === "auditoriumGroup" &&
    //     db
    //       .ref(`auditoriumGroup/${domain}/${user.roomid}/lastMessage`)
    //       .set(data);
    // } catch (error) {
    //   console.log(error.message);
    // }
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
          onChange={(e) => { handleChange(e.target.value); setPreviewEmoji(false) }}
          style={{ width: "253px", height: 40, border: "none", outline: "none" }} />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 30, width: 40, cursor: "pointer" }}>
          <img src={attachment} alt="smiley" />
        </div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 30, width: 40, cursor: "pointer" }}>
          <img src={send} alt="smiley" />
        </div>
      </form>
    </>
  );
}

export default InputChat;