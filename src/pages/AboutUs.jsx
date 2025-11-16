import Guest from "../layouts/Guest";
import Footer from "../components/Footer";
import { FaUserAlt } from "react-icons/fa";

const officers = [
  { name: "Beavin Soriano", role: "President" },
  { name: "Juliet Eronico", role: "Vice President" },
  { name: "Cherry Balili", role: "Secretary" },
  { name: "Gina Losare", role: "Treasurer" },
  { name: "Marieatha Lim", role: "Auditor" },
];

const AboutUs = () => {
  return (
    <Guest>
      <div className="min-h-screen w-full flex flex-col">

        {/* HERO SECTION (NO IMAGE) */}
        <section className="relative w-full pt-32 pb-28 bg-gradient-to-b from-orange-50 to-orange-500 text-white overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-16 left-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-52 h-52 bg-white/10 rounded-full blur-2xl"></div>

          <div className="max-w-[1200px] mx-auto px-6 relative z-10 ">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-orange-600">
              Empowering Women,  
              <br />
              Strengthening Communities.
            </h1>

            <p className="text-lg md:text-xl max-w-3xl leading-relaxed text-gray-800">
              Kalinga ng Kababaihan is a community-centered organization that
              uplifts women through education, health support, livelihood,
              mentorship, and advocacy—building communities where women thrive,
              lead, and create lasting impact.
            </p>
          </div>
        </section>

        {/* MISSION & VISION */}
        <section className="w-full py-20 bg-gray-50">
          <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white shadow-md p-8 rounded-xl border-l-4 border-orange-500">
              <h2 className="text-3xl font-bold text-orange-600 mb-4">
                Mission
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                To empower the marginalized, especially women and mothers,
                through education, support, and accessible opportunities that
                enable them to live with dignity, confidence, and independence.
              </p>
            </div>

            <div className="bg-white shadow-md p-8 rounded-xl border-l-4 border-orange-500">
              <h2 className="text-3xl font-bold text-orange-600 mb-4">
                Vision
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                A community where women are fully equipped to lead, contribute,
                and inspire positive change through their strength, resilience,
                and compassion.
              </p>
            </div>
          </div>
        </section>

        {/* ORGANIZATIONAL CHART */}
        <section className="bg-white py-20 w-full">
          <div className="max-w-[1200px] mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-bold chewy text-center mb-16">
              Committed Volunteers, Real Impact.
            </h2>

            <h3 className="text-2xl md:text-3xl font-bold text-center mb-10">
              Organizational Chart
            </h3>

            {/* President */}
            <div className="flex flex-col items-center mb-16">
              <FaUserAlt className="w-28 h-28 bg-gray-100 text-gray-400 p-6 rounded-full shadow-md" />
              <p className="text-xl font-bold mt-3">Beavin Soriano</p>
              <p className="text-sm text-gray-600">President</p>
            </div>

            {/* Other Officers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 place-items-center">
              {officers.slice(1).map((officer, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center"
                >
                  <FaUserAlt className="w-24 h-24 bg-gray-100 text-gray-400 p-5 rounded-full shadow-sm" />
                  <p className="text-lg font-bold mt-2">{officer.name}</p>
                  <p className="text-sm text-gray-600">{officer.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CORE VALUES */}
        <section className="bg-gray-50 py-20 w-full">
          <div className="max-w-[1200px] mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl chewy mb-12">Our Core Values</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xl font-semibold">
              <div>Leadership</div>
              <div>Collaboration</div>
              <div>Fairness</div>
              <div>Usefulness</div>
            </div>
          </div>
        </section>

        {/* LOCATION MAP */}
        <section className="bg-white py-20 w-full">
          <div className="max-w-[1200px] mx-auto px-6">
            <p className="text-center text-4xl md:text-5xl font-bold chewy mb-4">
              Find Us Here!
            </p>
            <p className="text-center text-lg text-orange-600 mb-10">
              B4 Lot 6-6 Fantacy Road 3, Teresa Park Subdivision, Las Piñas City
            </p>

            <div className="rounded-md overflow-hidden shadow-md">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1624.643344412647!2d121.00521134463953!3d14.42284865762466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d139981f8ad5%3A0xef833b6731e952d2!2sRespiratory%20and%20Sleep%20Centre!5e0!3m2!1sen!2sph!4v1747614913745!5m2!1sen!2sph"
                width="100%"
                height="500"
                loading="lazy"
                className="w-full"
                style={{ border: 0 }}
              ></iframe>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </Guest>
  );
};

export default AboutUs;
