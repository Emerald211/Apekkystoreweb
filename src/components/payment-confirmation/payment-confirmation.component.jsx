import { BsCheckCircleFill } from "react-icons/bs";
import Button from "../button/button.component";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  customOnAUthStateChange,
  db,
} from "../../utils/firebase/firebase.component";
import { getDoc, doc, updateDoc, setDoc } from "firebase/firestore";
import emailjs from "emailjs-com";

const PaymentConfirmation = () => {
  emailjs.init("mESjxZ_og4PkWRGaA");

 

  const storedOrder = JSON.parse(localStorage.getItem("completedOrder"));

 

  useEffect(() => {
    const unsubscribe = customOnAUthStateChange((user) => {
      if (user) {
        console.log("User is authenticated:", user);

        const userDocRef = doc(db, "users", user.uid);
        getDoc(userDocRef)
          .then((docSnapshot) => {
            if (docSnapshot.exists()) {
              const existingOrders = docSnapshot.data().orders || [];

              const updatedOrders = [...existingOrders, storedOrder];
              return updateDoc(userDocRef, { orders: updatedOrders });
            } else {
              return setDoc(userDocRef, { orders: [storedOrder] });
            }
          })
          .then(() => {
            console.log("User document created/updated successfully");
            localStorage.setItem("completedOrder", JSON.stringify(null));
          })
          .catch((error) => {
            console.error("Error creating/updating user document:", error);
          });
      } else {
        console.log("User is not authenticated");
      }
    });

    return () => unsubscribe();
  }, [storedOrder]);
 // Empty dependency array to run once when the component mounts

  const navigate = useNavigate();
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <BsCheckCircleFill className="text-main text-[100px] mb-10" />
      <h1 className="font-serrat font-bold">Payment Successful</h1>
      <h5 className="font-serrat text-gray-600 mb-10">
        Thanks for purchasing an item with Apekky Store
      </h5>

      <Button onClick={() => navigate("/orders")} buttonType="inverted">
        CHECK ORDERS
      </Button>
    </div>
  );
};

export default PaymentConfirmation;
