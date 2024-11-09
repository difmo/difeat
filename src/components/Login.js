import { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import chef from "../assets/food/vater.png";
import {
  auth,
  RecaptchaVerifier,
  PhoneAuthProvider,
  signInWithCredential,
  doc, setDoc, firestore,getDoc
} from "../../firebase";
import { useContext } from "react";
import userContext from "../utils/userContext";

const phoneSchema = Yup.object().shape({
  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number"),
  otp: Yup.string()
    .min(6, "OTP must be 6 digits")
    .max(6, "OTP must be 6 digits"),
});

const Login = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [verificationId, setVerificationId] = useState(null);
  const navigate = useNavigate();
  const { setUser } = useContext(userContext);

  const handlePhoneSubmit = (values) => {
    console.log("Sending OTP to:", values.phone);

    try {
      // Initialize RecaptchaVerifier
      const recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            console.log("ReCAPTCHA solved:", response);
          },
        }
      );

      // Ensure recaptcha renders correctly
      recaptchaVerifier
        .render()
        .then((widgetId) => {
          console.log("ReCAPTCHA rendered with widget ID:", widgetId);

          const phoneNumber = `+91${values.phone}`;
          const provider = new PhoneAuthProvider(auth);

          // Request phone number verification
          provider
            .verifyPhoneNumber(phoneNumber, recaptchaVerifier)
            .then((confirmationResult) => {
              // Log confirmation result to inspect object structure
              console.log("Confirmation result object:", confirmationResult);
              setVerificationId(confirmationResult);
              setOtpSent(true);
              console.log(
                "OTP sent successfully with Verification ID:",
                confirmationResult.verificationId
              );
            })
            .catch((error) => {
              console.error("Error sending OTP:", error.message);
              alert(`Error: ${error.message}`);
            });
        })
        .catch((error) => {
          console.error("Error rendering reCAPTCHA:", error.message);
        });
    } catch (error) {
      console.error("Error in phone number verification:", error.message);
    }
  };


  const handleOtpSubmit = async (values) => {
    if (!verificationId) {
      const errorMessage = "Verification ID is missing. Please request a new OTP.";
      console.error(errorMessage);
      alert(errorMessage);
      return;
    }
  
    try {
      const credential = PhoneAuthProvider.credential(verificationId, values.otp);
      const userCredential = await signInWithCredential(auth, credential);
      const user = userCredential.user;
      console.log("OTP verified successfully. User:", user);
  
      // Check if the user document already exists
      const userDocRef = doc(firestore, "difeatusers", user.uid);
      const userDoc = await getDoc(userDocRef);
  
      if (!userDoc.exists()) {
        // User doesn't exist, create the user document
        const userData = {
          profile: {
            uid: user.uid,
            phoneNumber: user.phoneNumber,
            createdAt: new Date().toISOString(),
            name: user.displayName || "Guest",
            email: user.email || "guest@example.com",
            profileImageUrl: user.photoURL || "https://example.com/default-profile.jpg",
          },
          roles: {
            isUser: true,
            isStoreKeeper: false
          },
          primaryAddress: null,
          settings: {
            notificationsEnabled: true,
            darkMode: false,
          },
        };
        await setDoc(userDocRef, userData);
        console.log("New user created:", user.uid);
      } else {
        console.log("User already exists in Firestore:", user.uid);
      }
  
      handleLogin(user);
      navigate("/");
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert(`Error verifying OTP: ${error.message || error}`);
    }
  };
  

  const handleLogin = (user) => {
    if (user) {
      console.log("User object received:", user); 
      const userData = {
        uid: user.uid,
        name: user.displayName || "Guest",
        email: user.email || "guest@example.com",
        isStoreKeeper: false,  
        isUser: true,         
        phoneNumber: user.phoneNumber,
        profileImageUrl: user.photoURL || "https://example.com/default-profile.jpg",
      };

      console.log("Formatted user data:", userData);

      setUser(userData);
      console.log("User state updated"); 
      user.getIdToken().then((token) => {
        console.log("Access token retrieved:", token); 

        localStorage.setItem("token", token);
        localStorage.setItem("isLoggedIn", "true");
        console.log("Token and login state saved to localStorage"); 

      }).catch((error) => {
        console.error("Error retrieving access token:", error); 
      });
    } else {
      console.log("No user data found"); 
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-orange-100">
      <div className="w-full max-w-lg p-8 my-5 bg-white shadow-lg rounded-2xl lg:max-w-md sm:max-w-sm">
        {/* Logo and Header */}
        <div className="text-center">
          <a href="/">
            <img
              alt="DifEat"
              className="w-20 h-auto mx-auto sm:w-32 md:w-40 lg:w-48 xl:w-56"
              src={chef}
            />
          </a>

          <h2 className="mt-4 text-xl font-bold text-gray-800 sm:text-2xl lg:text-3xl">
            Welcome Back!
          </h2>
          <p className="mt-1 text-sm text-gray-500 sm:text-base">
            Sign in with your phone number to continue
          </p>
        </div>

        {/* Formik Form */}
        <Formik
          initialValues={{ phone: "", otp: "" }}
          validationSchema={phoneSchema}
          onSubmit={otpSent ? handleOtpSubmit : handlePhoneSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
          }) => (
            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-6 sm:space-y-8"
            >
              {!otpSent ? (
                <>
                  {/* Phone Number Input */}
                  <div>
                    <input
                      type="text"
                      name="phone"
                      placeholder="Enter your phone number"
                      value={values.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full px-4 py-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 sm:text-base"
                    />
                    {errors.phone && touched.phone && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Send OTP Button */}
                  <button
                    type="submit"
                    className="w-full py-3 text-lg font-bold text-white bg-[#fb0b0f] hover:bg-orange-600 sm:text-base"
                  >
                    CONTINUE
                  </button>
                </>
              ) : (
                <>
                  {/* OTP Input */}
                  <div>
                    <input
                      type="text"
                      name="otp"
                      placeholder="Enter OTP"
                      value={values.otp}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full px-4 py-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 sm:text-base"
                    />
                    {errors.otp && touched.otp && (
                      <p className="mt-1 text-sm text-red-500">{errors.otp}</p>
                    )}
                  </div>

                  {/* Verify OTP Button */}
                  <button
                    type="submit"
                    className="w-full py-3 text-lg text-white bg-[#fb0b0f] rounded-lg hover:bg-orange-600 sm:text-base"
                  >
                    Verify OTP
                  </button>

                  {/* Resend OTP / Change Number */}
                  <p
                    className="mt-4 text-sm text-center text-gray-500 cursor-pointer hover:underline"
                    onClick={() => setOtpSent(false)}
                  >
                    Resend OTP / Change Number
                  </p>
                </>
              )}
            </form>
          )}
        </Formik>
        <p className="mt-4 text-sm text-center text-gray-500">
          By clicking on Login, I accept the{" "}
          <a
            href="/terms-and-conditions"
            className="text-orange-500 underline hover:text-orange-600"
          >
            Terms & Conditions
          </a>{" "}
          &{" "}
          <a
            href="/privacy-policy"
            className="text-orange-500 underline hover:text-orange-600"
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
      {/* Invisible reCAPTCHA container */}
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default Login;
