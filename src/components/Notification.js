import React, { useEffect } from "react";

const Notification = ({show, heading, content, notification, setNotification}) => {

  useEffect(()=>{
    if(show===true){
      hideNotification();
    }
  },[show])

  function hideNotification() {
    setTimeout(function(){ 
      setNotification({
        show:false,
        heading:"",
        content:"",
      })
     }, 3000);
  }

  return(
    <>
      <div style={{background:"#F5F5F5", borderTopLeftRadius:15, borderTopRightRadius:15 , height:(show===true ? 40 : 0), transition:"1s", width:"90%", position:"absolute", top:(show===true ? -40 : 0), left:"50%", transform:"translate(-50%, 0)", display:"flex", flexDirection:"column" , justifyContent:"center", alignItems:"center"}}>
        <span style={{fontSize:14, fontWeight:700, color:"#5B5B5B"}}>{heading}</span>
        <span style={{fontSize:10, fontWeight:500, color:"#5B5B5B"}}>{content}</span>
      </div>
    </>
  );
}

export default Notification;