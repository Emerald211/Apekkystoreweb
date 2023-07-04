import { useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import "./payment.styles.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/user/user.selector";
import {
  selectCartItems,
  selectCartTotal,
  selectDeliveryFee,
} from "../../store/cart/cart.selector";

import { customOnAUthStateChange } from "../../utils/firebase/firebase.component";
import emailjs from "emailjs-com";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../utils/firebase/firebase.component";



const CARD_OPTIONS = {
  iconStyle: "solid",
  style: {
    base: {
      iconColor: "#c4f0ff",
      color: "#fff",
      fontWeight: 500,
      fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      ":-webkit-autofill": { color: "#fce883" },
      "::placeholder": { color: "#87bbfd" },
    },
    invalid: {
      iconColor: "#ffc7ee",
      color: "#ffc7ee",
    },
  },
};

// eslint-disable-next-line react/prop-types
const PaymentForm = ({ formData }) => {
  const [success, setSucess] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const currentuser = useSelector(selectCurrentUser);
  const cartitem = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const deliveryfee = useSelector(selectDeliveryFee);
  // eslint-disable-next-line react/prop-types
  const { address, deliverytime, country } = formData;

  console.log(address, deliverytime);

  console.log(address, deliverytime);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (!error) {
      try {
        const { id } = paymentMethod;
        const response = await axios.post("http://localhost:4000/payment", {
          amount: 1000,
          id,
        });

        if (response.data.success) {
          console.log("Sucessful Payment");
          setSucess(true);
          navigate("/confirmpayment");

          const completedOrder = {
            email: currentuser.email,
            name:  currentuser.name === undefined ? currentuser.email : currentuser.name,
            items: cartitem,
            amount: `${total} Pounds`,
            address: address,
            country: country,
            deliverytime: deliverytime,
            deliveryfee: deliveryfee,
          };

          const productDetails = cartitem.map((product) => {
            return `
              Product: ${product.name}
              Image URL: ${product.imageUrl}
              Price: ${product.price} Euros
              Quantity: ${product.quantity}
            `;
          });

          const formattedProductDetails = productDetails.join("\n");

          // To buyer

          const sendPaymentConfirmationEmail = () => {
            const templateParams = {
              name: completedOrder.name,
              order_id: completedOrder.id,
              amount: completedOrder.amount,
              paymentMethod: "CARD",
              items: `${formattedProductDetails}`,
              
            };

            emailjs
              .send("service_x1xb88n", "template_vswwvhp", templateParams)
              .then((response) => {
                console.log(
                  "Payment confirmation email sent to the customer:",
                  response.status,
                  response.text
                );
              })
              .catch((error) => {
                console.error(
                  "Error sending payment confirmation email to the customer:",
                  error
                );
              });
          };

          sendPaymentConfirmationEmail();

          // Assuming you have configured EmailJS and initialized it with your User ID

          // Function to send the payment confirmation email to the seller

          const sendPaymentNotificationToSeller = () => {
            const templateParams = {
              order_id: completedOrder.id,
              amount: completedOrder.amount,
              customerName: completedOrder.name,
              customerEmail: completedOrder.email,
              paymentMethod: "CARD",
              items: `${formattedProductDetails}`,
              address: completedOrder.address,
              country: completedOrder.country,
              deliverytime: completedOrder.deliverytime,
            };

            emailjs
              .send("service_x1xb88n", "template_csfo85y", templateParams)
              .then((response) => {
                console.log(
                  "Payment notification email sent to the seller:",
                  response.status,
                  response.text
                );
              })
              .catch((error) => {
                console.error(
                  "Error sending payment notification email to the seller:",
                  error
                );
              });
          };

          // Usage example
          sendPaymentNotificationToSeller();

          alert("Order completed");

          const unsubscribe = customOnAUthStateChange((user) => {
            if (user) {
              console.log("User is authenticated:", user);

              // Fetch the existing user document
              const userDocRef = doc(db, "users", user.uid);
              getDoc(userDocRef)
                .then((docSnapshot) => {
                  if (docSnapshot.exists()) {
                    const existingOrders = docSnapshot.data().orders || [];

                    console.log(existingOrders);

                    // Update the user document by adding the new order to the existing orders array
                    const updatedOrders = [...existingOrders, completedOrder];

                    console.log(updatedOrders);
                    return updateDoc(userDocRef, { orders: updatedOrders });
                  } else {
                    // Create a new user document with the order as the first entry in the orders array
                    return setDoc(userDocRef, { orders: [completedOrder] });
                  }
                })
                .then(() =>
                  console.log("User document created/updated successfully")
                )
                .catch((error) =>
                  console.error("Error creating/updating user document:", error)
                );
            } else {
              console.log("User is not authenticated");
            }
          });

          return () => unsubscribe();
        }
      } catch (error) {
        console.log(error, "Error");
      }
    } else {
      console.log(error.message);
    }
  };

  return (
    <>
             
      {!success ? (
        <form
          className=" w-[80vw] flex flex-col justify-center items-center"
          onSubmit={handleSubmit}
        >
          <fieldset className="FormGroup">
            <div className="FormRow">
              <CardElement options={CARD_OPTIONS} />
            </div>
          </fieldset>

          <button className=" w-full bg-black text-white py-3">PAY</button>
        </form>
      ) : (
        <div>
          <h2>You just bought a Item from Apekky STore Congrats</h2>
        </div>
      )}
    </>
  );
};

export default PaymentForm;
