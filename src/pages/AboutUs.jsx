import { useEffect, useState } from "react";
import Guest from "../layouts/Guest";
import Footer from "../components/Footer";
import { FaUserAlt } from "react-icons/fa";
import { Sparkles, HeartHandshake, MapPin } from "lucide-react";
import { _get } from "../api";

const AboutUs = () => {
  const [homepageInfo, setHomepageInfo] = useState(null);
  const [officers, setOfficers] = useState([]);
  const [loadingOfficers, setLoadingOfficers] = useState(true);
  const storageBase = "https://api.kalingangkababaihan.com/storage/";

  useEffect(() => {
    const fetchHomepageInfo = async () => {
      try {
        const response = await _get("/homepage-info");
        setHomepageInfo(response.data || {});
      } catch (error) {
        console.error("Error fetching homepage info:", error);
      }
    };
    fetchHomepageInfo();
    fetchOfficers();
  }, []);

  const fetchOfficers = async () => {
    setLoadingOfficers(true);
    try {
      const response = await _get("/officers");
      const data = response.data || [];

      const priority = ["president", "vice president", "secretary", "treasurer", "auditor"];
      const sorted = [...data].sort((a, b) => {
        const aIdx = priority.indexOf((a.position || "").toLowerCase());
        const bIdx = priority.indexOf((b.position || "").toLowerCase());
        const aRank = aIdx === -1 ? priority.length + 1 : aIdx;
        const bRank = bIdx === -1 ? priority.length + 1 : bIdx;
        return aRank - bRank;
      });

      setOfficers(sorted);
    } catch (error) {
      console.error("Error fetching officers:", error);
    } finally {
      setLoadingOfficers(false);
    }
  };

  const stats = [
    { label: "Women supported", value: homepageInfo?.women_supported || "..." },
    { label: "Meals served", value: homepageInfo?.meals_served || "..." },
    { label: "Communities reached", value: homepageInfo?.communities_reached || "..." },
    { label: "Volunteers strong", value: homepageInfo?.number_of_volunteers || "..." },
  ];

  return (
    <Guest>
      <div className="min-h-screen w-full flex flex-col bg-gray-50">

        {/* HERO */}
        <section className="relative w-full pt-32 pb-20 bg-gradient-to-r from-orange-50 via-white to-orange-100 overflow-hidden">
          <div className="absolute top-10 left-10 w-48 h-48 bg-orange-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-0 w-72 h-72 bg-orange-300/20 rounded-full blur-3xl"></div>

          <div className="max-w-[1200px] mx-auto px-6 relative z-10 flex flex-col gap-6">
            <p className="text-xs uppercase tracking-[0.25em] text-orange-500 font-semibold">About Kalinga ng Kababaihan</p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight chewy">
              Empowering women. Strengthening communities.
            </h1>
            <p className="text-base md:text-lg text-gray-700 max-w-3xl">
              We are a community-centered organization uplifting women through relief, health support, livelihood, mentorship, and advocacy‹¨«building spaces where women thrive, lead, and create lasting impact.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl">
              {stats.map((item, idx) => (
                <div key={idx} className="bg-white/80 backdrop-blur border border-orange-100 rounded-lg p-3 shadow-sm">
                  <p className="text-[11px] uppercase tracking-wide text-gray-500">{item.label}</p>
                  <p className="text-xl font-bold text-orange-600">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="w-full py-16 bg-white">
          <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {[{
              title: "Mission",
              text: "To empower the marginalized‹¨«especially women and mothers‹¨«through education, support, and opportunities that enable dignity, confidence, and independence.",
              icon: <HeartHandshake className="w-8 h-8 text-orange-500" />,
            }, {
              title: "Vision",
              text: "A community where women are fully equipped to lead, contribute, and inspire positive change through strength, resilience, and compassion.",
              icon: <Sparkles className="w-8 h-8 text-orange-500" />,
            }].map((item, idx) => (
              <div key={idx} className="bg-gray-50 border border-orange-100 shadow-sm p-8 rounded-xl flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white border border-orange-100 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">{item.title}</h2>
                </div>
                <p className="text-base text-gray-700 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Organizational Chart */}
        <section className="bg-gray-50 py-16 w-full">
          <div className="max-w-[1200px] mx-auto px-6 flex flex-col gap-10">
            <div className="text-center flex flex-col gap-2">
              <h2 className="text-3xl md:text-4xl font-bold chewy text-gray-800">Committed Volunteers, Real Impact</h2>
              <p className="text-sm text-gray-600">Meet the leaders guiding our programs and partnerships.</p>
            </div>

            {loadingOfficers ? (
              <div className="py-8 text-center text-sm text-gray-500">Loading officers...</div>
            ) : officers.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-500">Officers will be announced soon.</div>
            ) : (
              <>
                <div className="flex flex-col items-center gap-3">
                  {(() => {
                    const leader = officers[0];
                    const leaderImage = leader?.image
                      ? leader.image.startsWith("http")
                        ? leader.image
                        : `${storageBase}${leader.image}`
                      : null;
                    return (
                      <>
                        {leaderImage ? (
                          <img
                            src={leaderImage}
                            alt={leader.name}
                            className="w-24 h-24 rounded-full object-cover shadow-md border border-gray-200"
                          />
                        ) : (
                          <FaUserAlt className="w-24 h-24 bg-white text-gray-400 p-6 rounded-full shadow-md border border-gray-200" />
                        )}
                        <p className="text-xl font-bold">{leader.name}</p>
                        <p className="text-sm text-gray-600">{leader.position}</p>
                      </>
                    );
                  })()}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 place-items-center">
                  {officers.slice(1).map((officer) => {
                    const imageSrc = officer.image
                      ? officer.image.startsWith("http")
                        ? officer.image
                        : `${storageBase}${officer.image}`
                      : null;
                    return (
                      <div
                        key={officer.id || officer.name}
                        className="flex flex-col items-center text-center bg-white rounded-xl p-4 shadow-sm border border-gray-100 w-full max-w-[220px]"
                      >
                        {imageSrc ? (
                          <img
                            src={imageSrc}
                            alt={officer.name}
                            className="w-16 h-16 rounded-full object-cover shadow-sm"
                          />
                        ) : (
                          <FaUserAlt className="w-16 h-16 bg-gray-50 text-gray-400 p-4 rounded-full shadow-sm" />
                        )}
                        <p className="text-lg font-semibold mt-3">{officer.name}</p>
                        <p className="text-sm text-gray-600">{officer.position}</p>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </section>

        {/* Core Values */}
        <section className="bg-white py-16 w-full">
          <div className="max-w-[1200px] mx-auto px-6 text-center flex flex-col gap-8">
            <h1 className="text-3xl md:text-4xl chewy">Our Core Values</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { title: "Leadership", desc: "Empowering women to lead with integrity and inspire change.", image: "/image1.png" },
                { title: "Collaboration", desc: "Working together to create lasting impact and unity.", image: "/image2.png" },
                { title: "Fairness", desc: "Promoting equality, justice, and opportunity for everyone.", image: "/image3.png" },
                { title: "Usefulness", desc: "Providing practical resources to help women thrive.", image: "/image4.png" },
              ].map((item, idx) => (
                <div key={idx} className="bg-gray-50 border border-orange-100 shadow-sm p-6 rounded-xl flex flex-col items-center gap-3">
                  <img src={item.image} alt={item.title} className="w-14 h-14" />
                  <h2 className="text-base font-bold text-orange-600">{item.title}</h2>
                  <p className="text-xs text-gray-700 leading-relaxed text-center">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="bg-gray-50 py-16 w-full">
          <div className="max-w-[1200px] mx-auto px-6 flex flex-col gap-6">
            <div className="flex flex-col gap-2 text-center">
              <p className="text-3xl md:text-4xl font-bold chewy">Find Us Here</p>
              <p className="text-sm text-orange-600 flex items-center justify-center gap-2">
                <MapPin className="w-4 h-4" /> B4 Lot 6-6 Fantacy Road 3, Teresa Park Subdivision, Las Pi‹¨«as City
              </p>
            </div>
            <div className="rounded-xl overflow-hidden shadow-md border border-gray-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1624.643344412647!2d121.00521134463953!3d14.42284865762466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d139981f8ad5%3A0xef833b6731e952d2!2sRespiratory%20and%20Sleep%20Centre!5e0!3m2!1sen!2sph!4v1747614913745!5m2!1sen!2sph"
                width="100%"
                height="480"
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
