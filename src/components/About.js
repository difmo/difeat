import { Component } from "react";
import { FaLinkedin, FaGithub, FaApple, FaGooglePlay } from "react-icons/fa";
// import heroImage from "../assets/food-delivery.svg"; // Replace with relevant food image

class About extends Component {
  render() {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-white">
          <div className="flex flex-col-reverse items-center gap-8 p-8 mx-auto max-w-7xl md:flex-row">
            {/* Text Content */}
            <div className="w-full text-center md:w-1/2 md:text-left">
              <h1 className="mb-4 text-5xl font-extrabold text-gray-800">
                Fresh Food & Pure Water at Your Doorstep 🍽️💧
              </h1>
              <p className="mb-6 text-lg text-gray-600">
                Welcome to <span className="font-semibold text-indigo-600">DifEat</span> – your go-to platform for delivering **delicious meals** and **pure drinking water** across the local area. We are dedicated to making fast and reliable deliveries to meet all your hunger and hydration needs!
              </p>
              <div className="flex justify-center gap-4 md:justify-start">
                <a
                  href="https://www.linkedin.com/in/hitesh-kumar-394024236/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-800"
                >
                  <FaLinkedin className="w-5 h-5" />
                  LinkedIn
                </a>
                <a
                  href="https://github.com/1hiteshk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-2 text-white bg-gray-800 rounded-lg hover:bg-gray-900"
                >
                  <FaGithub className="w-5 h-5" />
                  GitHub
                </a>
              </div>
            </div>

            {/* Image Section */}
            <div className="w-full md:w-1/2">
              {/* <img src={heroImage} alt="Food Delivery" className="w-full h-auto" /> */}
            </div>
          </div>
        </section>

        {/* Highlights Section */}
        <section className="py-16 bg-gray-100">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="mb-8 text-4xl font-bold">Our Services</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="p-8 bg-white rounded-lg shadow-md">
                <h3 className="mb-4 text-2xl font-semibold">Food Delivery</h3>
                <p className="text-gray-600">
                  Get freshly prepared meals delivered straight to your doorstep, hot and ready to eat!
                </p>
              </div>
              <div className="p-8 bg-white rounded-lg shadow-md">
                <h3 className="mb-4 text-2xl font-semibold">Water Delivery</h3>
                <p className="text-gray-600">
                  We ensure a steady supply of pure water cans and bottles to keep you hydrated.
                </p>
              </div>
              <div className="p-8 bg-white rounded-lg shadow-md">
                <h3 className="mb-4 text-2xl font-semibold">Timely Service</h3>
                <p className="text-gray-600">
                  Our deliveries are optimized for speed, so your food and water reach you without delay.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="mb-8 text-4xl font-bold">Download the DifEat App</h2>
            <p className="mb-6 text-lg text-gray-600">
              Enjoy a seamless ordering experience with our mobile app. Order food, track deliveries, and manage payments, all in one place!
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="#"
                className="flex items-center gap-2 px-6 py-3 text-white bg-black rounded-lg hover:bg-gray-800"
              >
                <FaApple className="w-5 h-5" />
                App Store
              </a>
              <a
                href="#"
                className="flex items-center gap-2 px-6 py-3 text-white bg-green-500 rounded-lg hover:bg-green-600"
              >
                <FaGooglePlay className="w-5 h-5" />
                Google Play
              </a>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default About;
