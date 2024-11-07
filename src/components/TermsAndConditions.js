import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TermsAndConditions = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on component load
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-white shadow-lg">
        <div className="p-8 mx-auto max-w-7xl">
          <h1 className="mb-4 text-3xl font-extrabold text-center text-gray-800 md:text-5xl">
            Terms & Conditions
          </h1>
          <p className="mb-6 text-base text-center text-gray-600 md:text-lg">
            Please read our terms and conditions carefully before using our services.
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="flex-1 py-10 bg-gray-100 md:py-16">
        <div className="max-w-5xl px-6 mx-auto space-y-12 md:px-12">
          {/* Section 1 */}
          <div className="p-6 bg-white rounded-lg shadow-md md:p-8">
            <h2 className="mb-3 text-xl font-semibold md:text-2xl">1. Introduction</h2>
            <p className="text-gray-700">
              Welcome to <span className="font-semibold text-indigo-600">DifEat</span>. By accessing or using our platform, you agree to comply with the
              following terms and conditions.
            </p>
          </div>

          {/* Section 2 */}
          <div className="p-6 bg-white rounded-lg shadow-md md:p-8">
            <h2 className="mb-3 text-xl font-semibold md:text-2xl">2. User Responsibilities</h2>
            <p className="text-gray-700">
              Users must provide accurate and up-to-date information during registration. Unauthorized access or misuse will result in immediate termination.
            </p>
          </div>

          {/* Section 3 */}
          <div className="p-6 bg-white rounded-lg shadow-md md:p-8">
            <h2 className="mb-3 text-xl font-semibold md:text-2xl">3. Payment Policy</h2>
            <p className="text-gray-700">
              We use Razorpay as our payment gateway to process all transactions. By using this service, you agree to Razorpay's policies and terms of service.
              All payments are encrypted and securely processed through Razorpay's servers.
            </p>
          </div>

          {/* Section 4 */}
          <div className="p-6 bg-white rounded-lg shadow-md md:p-8">
            <h2 className="mb-3 text-xl font-semibold md:text-2xl">4. Refund and Cancellation Policy</h2>
            <p className="text-gray-700">
              Our refund and cancellation policy is in accordance with Razorpay's guidelines. If you have any issues with your order, please contact our support team.
              Refunds will be processed within 7-10 business days and are subject to a transaction fee, as applicable.
            </p>
          </div>

          {/* Section 5 */}
          <div className="p-6 bg-white rounded-lg shadow-md md:p-8">
            <h2 className="mb-3 text-xl font-semibold md:text-2xl">5. Security</h2>
            <p className="text-gray-700">
              Your payment information is handled securely and processed only by Razorpay. We do not store any credit card or bank account details on our servers.
              Please review Razorpay's security policies for more information.
            </p>
          </div>

          {/* Section 6 */}
          <div className="p-6 bg-white rounded-lg shadow-md md:p-8">
            <h2 className="mb-3 text-xl font-semibold md:text-2xl">6. Limitation of Liability</h2>
            <p className="text-gray-700">
              We are not liable for any damages or losses arising from transactions processed through Razorpay. Any issues related to the payment gateway must
              be directed to Razorpay support.
            </p>
          </div>

          {/* Section 7 */}
          <div className="p-6 bg-white rounded-lg shadow-md md:p-8">
            <h2 className="mb-3 text-xl font-semibold md:text-2xl">7. Changes to Terms</h2>
            <p className="text-gray-700">
              We reserve the right to modify these terms at any time. Continued use of the service implies acceptance of the updated terms.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="mb-4 text-3xl font-semibold">Have Questions?</h2>
          <p className="mb-6 text-gray-600">
            If you have any questions about our terms and conditions, reach out to us at{" "}
            <span className="font-semibold text-indigo-600">difeatservices@gmail.com</span>.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 mt-4 text-white transition-all bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            Back to Home
          </button>
        </div>
      </section>
    </div>
  );
};

export default TermsAndConditions;
