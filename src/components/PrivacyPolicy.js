import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-white">
        <div className="p-8 mx-auto max-w-7xl">
          <h1 className="mb-4 text-4xl font-extrabold text-center text-gray-800 md:text-5xl">
            Privacy Policy
          </h1>
          <p className="mb-8 text-lg text-center text-gray-600">
            Your privacy is important to us. Please read our policy carefully to understand how we collect, use, and protect your information.
          </p>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-6xl px-4 mx-auto sm:px-6">
          <div className="space-y-8">
            {/* Section 1 */}
            <div className="p-8 bg-white rounded-lg shadow-md">
              <h2 className="mb-4 text-2xl font-bold">1. Information We Collect</h2>
              <p className="text-gray-600">
                We collect personal information when you register on our platform, place orders, or use our services. This may include your name, email, phone number, and address.
              </p>
            </div>

            {/* Section 2 */}
            <div className="p-8 bg-white rounded-lg shadow-md">
              <h2 className="mb-4 text-2xl font-bold">2. How We Use Your Information</h2>
              <p className="text-gray-600">
                We use your information to process orders, provide customer service, and improve our platform. We may also send you promotional emails or notifications related to your orders.
              </p>
            </div>

            {/* Section 3 */}
            <div className="p-8 bg-white rounded-lg shadow-md">
              <h2 className="mb-4 text-2xl font-bold">3. Data Sharing & Third Parties</h2>
              <p className="text-gray-600">
                We do not sell your data to third parties. However, we may share it with trusted partners who help us deliver services (e.g., payment processors or delivery partners).
              </p>
            </div>

            {/* Section 4 */}
            <div className="p-8 bg-white rounded-lg shadow-md">
              <h2 className="mb-4 text-2xl font-bold">4. Data Security</h2>
              <p className="text-gray-600">
                We implement security measures  to protect your personal data from unauthorized access, loss, or misuse. However, no system is entirely secure, and we cannot guarantee absolute data security.
              </p>
            </div>

            {/* Section 5 */}
            <div className="p-8 bg-white rounded-lg shadow-md">
              <h2 className="mb-4 text-2xl font-bold">5. Your Rights & Choices</h2>
              <p className="text-gray-600">
                You have the right to access, modify, or delete your personal data. If you wish to opt out of promotional communications, you can do so at any time by contacting us.
              </p>
            </div>

            {/* Section 6 */}
            <div className="p-8 bg-white rounded-lg shadow-md">
              <h2 className="mb-4 text-2xl font-bold">6. Changes to This Policy</h2>
              <p className="text-gray-600">
                We reserve the right to update this Privacy Policy at any time. Changes will be posted on this page, and your continued use of our platform will imply acceptance of the revised policy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="mb-8 text-4xl font-bold">Need More Information?</h2>
          <p className="mb-6 text-lg text-gray-600">
            If you have any questions about our Privacy Policy, feel free to contact us at{" "}
            <span className="font-semibold text-indigo-600">info@difmo.com</span>.
          </p>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
