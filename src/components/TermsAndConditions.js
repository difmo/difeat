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
            <h2 className="mb-3 text-xl font-semibold md:text-2xl">3. Payment & Refund Policy</h2>
            <p className="text-gray-700">
              All payments made through our app are final and non-refundable. Contact our support team for any order-related issues.
            </p>
          </div>

          {/* Section 4 */}
          <div className="p-6 bg-white rounded-lg shadow-md md:p-8">
            <h2 className="mb-3 text-xl font-semibold md:text-2xl">4. Limitation of Liability</h2>
            <p className="text-gray-700">
              We are not liable for damages arising from the use of our platform, beyond the value of purchased items.
            </p>
          </div>

          {/* Section 5 */}
          <div className="p-6 bg-white rounded-lg shadow-md md:p-8">
            <h2 className="mb-3 text-xl font-semibold md:text-2xl">5. Changes to Terms</h2>
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
            <span className="font-semibold text-indigo-600">info@difmo.com</span>.
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
