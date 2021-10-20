import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const UploadFile = async (file) => {
    // setLoading(true);
    //uploading the image and setting the details of image for the same to show it on the chat list
    const name = file?.name;
    const storage = getStorage();
    const storageRef = ref(storage, name);
    const metadata = {
      contentType: file?.type,
    };
    const uploadTask = await uploadBytes(storageRef, file, metadata)
    getDownloadURL(storageRef).then((url) => {
      const uploadedFile = {
        name: file.name,
        type: file.type,
        url,
      };
      console.log(uploadedFile,"lliiii");
      return uploadedFile;
    }).catch((e) => {
      console.log(e, "error uploading file");
    })
  };