import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "../payment-form/payment-form.component";

const PUBLIC_KEY =
  "pk_test_51NEGz0D4SNHQTH6u7RmWjnSVfxMdNy7bD76yt7mf4QKIw53evABPUfmujsQbkjerAR7f1oyOxPS5F5UxYjrZJJIb00DyZLi0ly";

const stripeTestPromise = loadStripe(PUBLIC_KEY);

// eslint-disable-next-line react/prop-types
const StripContainer = ({ formData}) => {
  return (
    <Elements stripe={stripeTestPromise}>
      <PaymentForm formData={formData} />
    </Elements>
  );
};

export default StripContainer;
