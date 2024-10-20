import { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import chef from "../assets/food/vater.png";

// Validation Schema for phone number and OTP
const phoneSchema = Yup.object().shape({
  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number"),
  otp: Yup.string()
    .min(4, "OTP must be 4 digits")
    .max(4, "OTP must be 4 digits"),
});

const Login = () => {
  const [otpSent, setOtpSent] = useState(false); // OTP Sent state
  const navigate = useNavigate();

  const handlePhoneSubmit = (values) => {
    console.log("Phone Submitted:", values.phone);
    setOtpSent(true); // Simulate OTP being sent
  };

  const handleOtpSubmit = (values) => {
    console.log("OTP Submitted:", values.otp);
    localStorage.setItem("token", "mock_token_value");
    navigate("/"); // Redirect after OTP verification
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
            href="/terms"
            className="text-orange-500 underline hover:text-orange-600"
          >
            Terms & Conditions
          </a>{" "}
          &{" "}
          <a
            href="/privacy"
            className="text-orange-500 underline hover:text-orange-600"
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default Login;
