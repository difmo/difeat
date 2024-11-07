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
            Your privacy is our priority. Please review our policy to understand how we handle your data.
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
                We collect personal information necessary for delivering our services, such as your name, contact details, and delivery address. We may also collect
                location data to facilitate accurate and timely deliveries and improve our service in your area.
              </p>
            </div>

            {/* Section 2 */}
            <div className="p-8 bg-white rounded-lg shadow-md">
              <h2 className="mb-4 text-2xl font-bold">2. How We Use Your Information</h2>
              <p className="text-gray-600">
                Your information is used primarily to process orders, ensure accurate deliveries, and provide customer support. Additionally, we may use your data to
                personalize your experience, recommend products, and inform you about promotions, new offerings, or policy changes.
              </p>
            </div>

            {/* Section 3 */}
            <div className="p-8 bg-white rounded-lg shadow-md">
              <h2 className="mb-4 text-2xl font-bold">3. Data Sharing & Third Parties</h2>
              <p className="text-gray-600">
                We do not sell your information to third parties. We may share relevant data with our trusted partners (such as delivery providers or payment processors)
                strictly for order fulfillment. Our partners are bound by confidentiality agreements to protect your privacy.
              </p>
            </div>

            {/* Section 4 */}
            <div className="p-8 bg-white rounded-lg shadow-md">
              <h2 className="mb-4 text-2xl font-bold">4. Data Security</h2>
              <p className="text-gray-600">
                We implement robust security measures to safeguard your data from unauthorized access, alteration, and misuse. While we strive to use commercially acceptable
                means to protect your personal data, please be aware that no method of transmission or storage is 100% secure.
              </p>
            </div>

            {/* Section 5 */}
            <div className="p-8 bg-white rounded-lg shadow-md">
              <h2 className="mb-4 text-2xl font-bold">5. Location-Based Services</h2>
              <p className="text-gray-600">
                For efficient deliveries, we may request access to your real-time location data. This helps our delivery partners accurately locate you for faster service.
                You have control over location sharing and can manage this setting on your device.
              </p>
            </div>

            {/* Section 6 */}
            <div className="p-8 bg-white rounded-lg shadow-md">
              <h2 className="mb-4 text-2xl font-bold">6. Your Rights & Choices</h2>
              <p className="text-gray-600">
                You have the right to access, modify, or delete your personal data. If you wish to opt out of marketing communications, you can do so by adjusting your preferences
                in the app or contacting us directly. For privacy-related inquiries, please reach out to our support team.
              </p>
            </div>

            {/* Section 7 */}
            <div className="p-8 bg-white rounded-lg shadow-md">
              <h2 className="mb-4 text-2xl font-bold">7. Changes to This Policy</h2>
              <p className="text-gray-600">
                We may update this Privacy Policy as needed to reflect changes in our practices, technology, or legal obligations. Any updates will be posted on this page, and
                continued use of our services implies acceptance of the updated policy.
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
            If you have questions about our Privacy Policy, please contact us at{" "}
            <span className="font-semibold text-indigo-600">info@difmo.com</span>.
          </p>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
