const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur p-8 rounded-2xl shadow-lg animate-fade-in">
        <h1 className="text-4xl font-extrabold text-center text-indigo-300 mb-6">
          About Ahiska Community
        </h1>
        <p className="text-lg text-gray-200 mb-6 leading-relaxed">
          Welcome to the Ahiska Community Platform! Our mission is to provide a
          supportive space for Ahiska Turks where people can connect, seek help,
          and share knowledge. Whether you're looking for answers to important
          questions, joining events, or seeking educational support, this
          platform is here to help.
        </p>
        <h2 className="text-2xl font-bold text-indigo-400 mt-8 mb-3">
          What We Offer
        </h2>
        <ul className="list-disc list-inside text-gray-100 space-y-2">
          <li>
            <span className="font-semibold text-indigo-300">
              Community Support:
            </span>{" "}
            Ask questions and receive answers from other community members.
          </li>
          <li>
            <span className="font-semibold text-indigo-300">
              Events & Gatherings:
            </span>{" "}
            Stay updated on upcoming events, cultural gatherings, and networking
            opportunities.
          </li>
          <li>
            <span className="font-semibold text-indigo-300">
              Educational Assistance:
            </span>{" "}
            Get help with educational resources, scholarships, and mentorship
            programs.
          </li>
        </ul>
        <h2 className="text-2xl font-bold text-indigo-400 mt-8 mb-3">
          Our Vision
        </h2>
        <p className="text-lg text-gray-200 leading-relaxed">
          We strive to create a welcoming and resourceful online space where
          every member of the Ahiska Turks community can find support, stay
          informed, and grow together.
        </p>
        <p className="text-lg text-gray-200 mt-6">
          Thank you for being part of this journey! If you have any questions or
          suggestions, feel free to reach out to us.
        </p>
      </div>
    </div>
  );
};

export default About;
