import { useState } from "react";
import emailjs from "emailjs-com";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState(null);

  function handleChange(evt) {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    setStatus("Sending...");

    try {
      const response = await emailjs.send(
        "service_swsrve9",
        "template_we5dqc9",
        formData,
        "9zaM_GwjLLtVqw2Kj"
      );

      setStatus("Message sent successfully!");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      console.error("Email sending error:", err);
      setStatus("Failed to send message. Try again.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl animate-fade-in text-white">
        <h2 className="text-3xl font-bold text-center text-indigo-300 mb-6">
          Contact Us
        </h2>
        {status && (
          <p className="text-center mb-4 text-sm text-indigo-200">{status}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-indigo-200"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 mt-1 rounded-lg bg-white/20 text-white border border-indigo-500 placeholder:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Your Name"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-indigo-200"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 mt-1 rounded-lg bg-white/20 text-white border border-indigo-500 placeholder:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="your@example.com"
              required
            />
          </div>
          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-indigo-200"
            >
              Subject
            </label>
            <input
              id="subject"
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full p-2 mt-1 rounded-lg bg-white/20 text-white border border-indigo-500 placeholder:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Subject"
              required
            />
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-indigo-200"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-2 mt-1 rounded-lg bg-white/20 text-white border border-indigo-500 placeholder:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Your message..."
              required
            />
          </div>
          <button className="w-full bg-indigo-500 hover:bg-indigo-600 transition-colors duration-300 p-2 rounded-lg text-white font-semibold">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
