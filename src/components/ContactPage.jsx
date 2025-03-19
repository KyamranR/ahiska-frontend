import { useState } from "react";
import emailjs from "emailjs-com"; // Install this package for sending emails

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

      console.log("Email sent:", response);
      setStatus("Message sent successfully!");
    } catch (err) {
      console.error("Email sending error:", err);
      setStatus("Failed to send message. Try again.");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold text-center">Contact Us</h2>
        {status && <p className="text-center mt-2 text-blue-500">{status}</p>}
        <form onSubmit={handleSubmit} className="mt-4">
          <div>
            <label className="block font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
              required
            />
          </div>
          <div className="mt-2">
            <label className="block font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
              required
            />
          </div>
          <div className="mt-2">
            <label className="block font-medium">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
              required
            />
          </div>
          <div className="mt-2">
            <label className="block font-medium">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
              required
            />
          </div>
          <button className="w-full mt-4 bg-blue-500 text-white p-2 rounded">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
