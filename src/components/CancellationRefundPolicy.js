import React from "react";

const CancellationRefundPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-100 bg-white">
      <section className="p-6 sm:p-8 lg:p-12 mx-auto max-w-7xl bg-white shadow-lg rounded-lg ">
        <h1 className="mb-6 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center text-gray-800">
          Cancellation & Refund Policy
        </h1>
        <p className="mb-10 text-base sm:text-lg lg:text-xl text-center text-gray-600 max-w-3xl mx-auto">
          At DifEat, we strive to provide the best service possible. Please read our cancellation and refund policy carefully to understand your rights.
        </p>

        <div className="space-y-10 text-gray-700">
          {/* Section 1 */}
          <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
            <h2 className="mb-3 text-xl sm:text-2xl font-bold">1. Order Cancellations</h2>
            <p>
              Orders can only be canceled before they are confirmed by the restaurant or delivery partner. Once an order is confirmed, we start preparing it immediately to ensure timely delivery. Unfortunately, cancellations cannot be processed after confirmation.
            </p>
          </div>

          {/* Section 2 */}
          <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
            <h2 className="mb-3 text-xl sm:text-2xl font-bold">2. Refunds on Canceled Orders</h2>
            <p>
              If an order is canceled before confirmation, you will receive a full refund within 5-7 business days. Refunds are processed via the original payment method, and we’ll notify you once the refund is initiated.
            </p>
          </div>

          {/* Section 3 */}
          <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
            <h2 className="mb-3 text-xl sm:text-2xl font-bold">3. Incorrect or Incomplete Orders</h2>
            <p>
              If you receive an incorrect or incomplete order, please contact our customer support team within 24 hours. We will work with the restaurant or store to either replace the order or issue a partial or full refund, based on the situation.
            </p>
          </div>

          {/* Section 4 */}
          <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
            <h2 className="mb-3 text-xl sm:text-2xl font-bold">4. Delays in Delivery</h2>
            <p>
              We strive to deliver orders promptly. However, if there’s an unexpected delay due to factors beyond our control (e.g., weather, traffic, high demand), we may offer a discount or partial refund at our discretion. Contact our support if you experience significant delays.
            </p>
          </div>

          {/* Section 5 */}
          <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
            <h2 className="mb-3 text-xl sm:text-2xl font-bold">5. Non-Refundable Items</h2>
            <p>
              Certain items, like perishable food items and beverages, are non-refundable once delivered, except in cases of incorrect or spoiled items. We prioritize food safety and quality, but please contact us immediately if there are issues with the condition of your order.
            </p>
          </div>

          {/* Section 6 */}
          <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
            <h2 className="mb-3 text-xl sm:text-2xl font-bold">6. Refund Processing Time</h2>
            <p>
              All approved refunds will be processed within 5-10 business days. The exact time may vary depending on your bank or payment provider. We appreciate your patience and will work to resolve any issues as quickly as possible.
            </p>
          </div>

          {/* Section 7 */}
          <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
            <h2 className="mb-3 text-xl sm:text-2xl font-bold">7. Contact Us</h2>
            <p>
              For any questions or concerns regarding cancellations or refunds, please contact our customer support team at{" "}
              <span className="font-semibold text-indigo-600">difeatservices@gmail.com</span>. We’re here to help!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CancellationRefundPolicy;
