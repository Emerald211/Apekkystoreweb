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

  const [email, setemail] = useState(false);

  const storedOrder = JSON.parse(localStorage.getItem("completedOrder"));

  if (storedOrder !== null) {
    setemail(true);
  }

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

  useEffect(() => {
    const sendEmail = async () => {
      const completedOrder = {
        id: storedOrder.id,
        email: storedOrder.email,
        name: storedOrder.name,
        items: storedOrder.items,
        amount: storedOrder.amount,
        status: "COMPLETED",
        time: storedOrder.time,
        payerid: storedOrder.payerid,
        address: storedOrder.address,
        country: storedOrder.country,
        deliverytime: storedOrder.deliverytime,
      };
      console.log(completedOrder);

      const products = completedOrder.items;

      const productDetails = products.map((product) => {
        return `
          Product: ${product.name}
          Image URL: ${product.imageUrl}
          Price: ${product.price} Euros
          Quantity: ${product.quantity}
        `;
      });

      const formattedProductDetails = productDetails.join("\n");

      const sendPaymentConfirmationEmail = async () => {
        const templateParams = {
          name: completedOrder.name,
          order_id: completedOrder.id,
          amount: completedOrder.amount,
          paymentMethod: "PAYPAL",
          items: formattedProductDetails,
        };

        try {
          const response = await emailjs.send(
            "service_x1xb88n",
            "template_vswwvhp",
            templateParams
          );
          console.log(
            "Payment confirmation email sent to the customer:",
            response.status,
            response.text
          );
        } catch (error) {
          console.error(
            "Error sending payment confirmation email to the customer:",
            error
          );
        }
      };

      const sendPaymentNotificationToSeller = async () => {
        const templateParams = {
          order_id: completedOrder.id,
          amount: completedOrder.amount,
          customerName: completedOrder.name,
          customerEmail: completedOrder.email,
          paymentMethod: "PAYPAL",
          items: formattedProductDetails,
          address: completedOrder.address,
          country: completedOrder.country,
          deliverytime: completedOrder.deliverytime,
        };

        try {
          const response = await emailjs.send(
            "service_x1xb88n",
            "template_csfo85y",
            templateParams
          );
          console.log(
            "Payment notification email sent to the seller:",
            response.status,
            response.text
          );
        } catch (error) {
          console.error(
            "Error sending payment notification email to the seller:",
            error
          );
        }
      };

      try {
        await sendPaymentConfirmationEmail();
        await sendPaymentNotificationToSeller();
        alert("Order completed");
      } catch (error) {
        console.error("Error during email sending:", error);
      }
    };

    sendEmail();
  }, []); // Empty dependency array to run once when the component mounts

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
