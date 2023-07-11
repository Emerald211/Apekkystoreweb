import axios from "axios";
import { useSelector } from "react-redux";
import { selectCartItems } from "../../store/cart/cart.selector";
import { url } from "../../slices/api";
import { selectCurrentUser } from "../../store/user/user.selector";

const PayButton = () => {
    const cartItems = useSelector(selectCartItems);
    const currentuser = useSelector(selectCurrentUser)
    const handleCheckout = () => {
      
    
   
      axios.post(`${url}/stripe/create-checkout-session`, {
          cartItems,
          userId: currentuser.uid
      }).then((res) => {
          if (res.data.url) {
              window.location.href = res.data.url
          }
      }).catch((error) => console.log(error.message))
  };
  return (
    <>
      <button
        className="bg-black px-3 py-2 text-white mb-8 font-bold"
        onClick={() => handleCheckout()}
      >
        PROCEED TO PAYMENT
      </button>
    </>
  );
};

export default PayButton;
