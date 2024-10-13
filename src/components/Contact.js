import { Component } from "react";
import { FaLinkedin, FaFacebook, FaInstagram, FaTwitter, FaPhone, FaEnvelope } from "react-icons/fa";

class Contact extends Component {
  render() {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-white">
          <div className="flex flex-col items-center p-6 mx-auto text-center max-w-7xl md:p-12">
            <h1 className="text-3xl font-bold text-gray-800 md:text-5xl">Get in Touch With Us 📞</h1>
            <p className="mt-4 text-lg text-gray-600 md:text-xl">
              Have questions, feedback, or want to collaborate? Reach out to us, and we’ll get back to you promptly.
            </p>
          </div>
        </section>

        {/* Contact Information Section */}
        <section className="py-16 bg-gray-100">
          <div className="max-w-5xl px-6 mx-auto text-center">
            <h2 className="mb-8 text-3xl font-bold md:text-4xl">Contact Information</h2>
            <div className="grid gap-8 md:grid-cols-2">
              {/* Phone & Email */}
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="mb-4 text-2xl font-semibold">Reach Us</h3>
                <p className="flex items-center justify-center gap-2 text-gray-600">
                  <FaPhone className="w-5 h-5 text-indigo-600" /> +91 9455791624
                </p>
                <p className="flex items-center justify-center gap-2 mt-2 text-gray-600">
                  <FaEnvelope className="w-5 h-5 text-indigo-600" /> info@difeat.com
                </p>
              </div>

              {/* Social Media Links */}
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="mb-4 text-2xl font-semibold">Follow Us</h3>
                <div className="flex justify-center gap-6">
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaLinkedin className="w-8 h-8" />
                  </a>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaFacebook className="w-8 h-8" />
                  </a>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-500 hover:text-pink-700"
                  >
                    <FaInstagram className="w-8 h-8" />
                  </a>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-600"
                  >
                    <FaTwitter className="w-8 h-8" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-12 bg-white">
          <div className="max-w-4xl px-6 mx-auto">
            <h2 className="mb-8 text-3xl font-bold text-center md:text-4xl">Send Us a Message</h2>
            <form className="grid gap-6 md:grid-cols-2">
              <div className="flex flex-col">
                <label className="mb-2 font-semibold">Your Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2 font-semibold">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="flex flex-col col-span-2">
                <label className="mb-2 font-semibold">Message</label>
                <textarea
                  rows="6"
                  placeholder="Write your message here..."
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                ></textarea>
              </div>
              <div className="col-span-2 text-center">
                <button
                  type="submit"
                  className="px-6 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-800"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </section>

      
      </div>
    );
  }
}

export default Contact;
