import React, { useState, useEffect } from "react";
import { customerData, subdomain, displayName } from "../constants/constants";
import { auth } from "../config/firebaseConfig";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../redux/store";
import { unwrapResult } from "@reduxjs/toolkit";
import { userLogin } from "../redux/slices/loginSlice";
import { userSignUp } from "../redux/slices/loginSlice";
import Chats from "./chats";

const Authentication = () => {
  const dispatch = useAppDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState();

  const loginUser = useSelector((state) => state.user);

  useEffect(() => {
    if (customerData) {
      auth.onAuthStateChanged((user) => {
        if (user?.email === customerData?.email) {
          setIsAuthenticated(true);
          console.log("authenticated")
        } else {
          setIsAuthenticated(false);
          dispatch(userLogin({
            email: customerData?.email,
            password: "1234567"
          }))
        }
      });
    }
  }, [])

  useEffect(() => {
    if (loginUser.errorMsg === "auth/user-not-found") {
      dispatch(userSignUp({
        email: customerData?.email,
        password: "1234567"
      }))
    }
  }, [loginUser.errorMsg])

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
      {isAuthenticated===true && <Chats />}
    </>
  );
}

export default Authentication;