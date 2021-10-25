import React, { useState, useEffect } from "react";
import { customerData, subdomain, displayName } from "../constants/constants";
import { auth } from "../config/firebaseConfig";
import Settings from "./settings";

const Authentication = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  useEffect(() => {
    if (customerData) {
      auth.onAuthStateChanged((user) => {
        if (user?.email === customerData?.email) {
          setIsAuthenticated(true);
          console.log("authenticated")
        } else {
          try {
            auth.signInWithEmailAndPassword(customerData.email, "1234567").then((response) => {
              setIsAuthenticated(true);
            })
          } catch (error) {
            if (error.code === "auth/user-not-found") {
              auth.createUserWithEmailAndPassword(customerData.email, "1234567").then((response) => {
                setIsAuthenticated(true);
              })
            }
          }
        }
      });
    }
  }, [])


  const userLogout = () => {
    auth.signOut().then(() => {
      console.log("Sign-out successful")
    }).catch((error) => {
      console.log("Sign-out error")
    });
  }

  document.removeEventListener("userlogout", userLogout);
  document.addEventListener("userlogout", userLogout);

  return (
    <>
      {isAuthenticated === true && <Settings />}
    </>
  );
}

export default Authentication;