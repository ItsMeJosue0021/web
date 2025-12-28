import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { _get } from "../api";
import { HeartHandshake, Sparkles, Globe2, ArrowRight } from "lucide-react";

import Header from "../components/headers/Header";
import Footer from "../components/Footer";
import ChatButton from "../components/chatbot/ChatButton";

import banner from "../assets/img/banner.png";
import activity1 from "../assets/img/activity1.png";
import activity2 from "../assets/img/activity2.png";
import donateNowImg from "../assets/img/donateNow.png";
import getInvolvedImg from "../assets/img/involved.png";
import Picture1 from "../assets/img/Picture1.jpg";

const images = [
  { src: banner, text: "Think of giving not as a duty, but as a privilege." },
  { src: Picture1, text: "Lose yourself in the service of others." },
  { src: activity2, text: "No act of kindness, no matter how small, is ever wasted." },
];

const Home = () => {
  const baseURL = "https://api.kalingangkababaihan.com/storage/";

  const [currentIndex, setCurrentIndex] = useState(0);
  const [recentProjects, setRecentProjects] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    fetchPastProjects();
  }, []);

  const fetchPastProjects = async () => {
    try {
      const response = await _get("/past-projects");
      setRecentProjects(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  return (
    <div className="w-full md:w-screen bg-white min-h-screen overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <section className="w-full py-16 bg-gradient-to-r from-orange-50 via-white to-orange-100">
        <div className="w-full max-w-[1200px] mx-auto pt-16 px-4 flex flex-col lg:flex-row items-center gap-10">
          <div className="w-full lg:w-1/2 flex flex-col space-y-6 text-left">
            <div className="flex flex-col space-y-3">
              <p className="text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold">Together, we uplift</p>
              <h1 className="text-4xl md:text-5xl text-gray-800 font-bold leading-tight chewy">
                Building hope for women, families, and communities
              </h1>
              <p className="text-gray-600 text-base md:text-lg poppins-regular">
                Kalinga ng Kababaihan champions dignity through relief, livelihood, and safe spaces. Your support makes every story of resilience possible.
              </p>
            </div>

            <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Link className="px-6 py-3 rounded-md text-sm text-white hover:text-white bg-orange-600 transform transition-transform duration-300 hover:scale-105 cursor-pointer shadow" to="/donate">
                Donate Now
              </Link>
              <Link
                to="/contact-us"
                className="px-6 py-3 rounded-md text-sm text-orange-600 hover:text-orange-700 border border-orange-200 bg-white hover:bg-orange-50 transform transition-transform duration-300 hover:scale-105 cursor-pointer"
              >
                Talk to Us
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Women supported", value: "1,200+" },
                { label: "Meals served", value: "50,000+" },
                { label: "Communities reached", value: "25+" },
                { label: "Volunteers strong", value: "800+" },
              ].map((item, idx) => (
                <div key={idx} className="bg-white border border-orange-100 rounded-lg p-3 shadow-sm">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">{item.label}</p>
                  <p className="text-xl font-bold text-orange-600">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <div className="relative w-full h-[260px] sm:h-[360px] md:h-[420px] overflow-hidden rounded-3xl shadow-xl">
              <div className="relative h-full">
                <img
                  src={images[currentIndex].src}
                  alt={`Slide ${currentIndex + 1}`}
                  className="w-full h-full rounded-3xl object-cover transition-transform duration-500 ease-in-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent rounded-3xl"></div>
                <div className="absolute inset-0 flex justify-center items-end pb-8 text-white text-2xl md:text-3xl font-bold text-center px-5">
                  <p className="italic drop-shadow-lg">{images[currentIndex].text}</p>
                </div>
              </div>

              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 text-gray-800 p-2 rounded-full hover:bg-white transition"
              >
                &lt;
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 text-gray-800 p-2 rounded-full hover:bg-white transition"
              >
                &gt;
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <div
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-6 h-1.5 rounded-full transition-all cursor-pointer ${
                      index === currentIndex ? "bg-white" : "bg-white/50"
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Help */}
      <section className="w-full bg-white py-16">
        <div className="max-w-[1200px] mx-auto px-4 flex flex-col gap-8">
          <div className="flex flex-col gap-2 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold">What we do</p>
            <h2 className="text-3xl md:text-4xl chewy text-gray-800">Programs that create lasting change</h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-sm md:text-base">
              From immediate relief to long-term empowerment, our programs are designed to meet women and families where they are.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                icon: <HeartHandshake className="w-8 h-8 text-orange-500" />,
                title: "Relief & Care",
                desc: "Food packs, hygiene kits, and safe spaces for women and children affected by crisis.",
              },
              {
                icon: <Sparkles className="w-8 h-8 text-orange-500" />,
                title: "Skills & Livelihood",
                desc: "Workshops and starter support that help women earn and build confidence.",
              },
              {
                icon: <Globe2 className="w-8 h-8 text-orange-500" />,
                title: "Community Building",
                desc: "Partnerships with barangays and volunteers to sustain programs where they are needed most.",
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-gray-50 border border-orange-100 rounded-xl p-5 flex flex-col gap-3 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center border border-orange-100">
                  {item.icon}
                </div>
                <p className="text-lg font-semibold text-gray-800">{item.title}</p>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Projects */}
      <section className="w-full bg-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 py-16 mt-12 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex flex-col gap-2 text-left">
              <h1 className="text-3xl md:text-4xl text-gray-800 chewy">Recent Projects</h1>
              <p className="text-gray-700 max-w-2xl text-sm md:text-base">Here are some of our latest initiatives dedicated to supporting women, families, and communities in need.</p>
            </div>
            <Link
              to="/our-projects"
              className="inline-flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 font-semibold"
            >
              View all projects <ArrowRight size={16} />
            </Link>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentProjects.map((project, index) => (
              <div
                key={index}
                data-aos="fade-down"
                className="relative w-full h-80 rounded-lg overflow-hidden group shadow bg-white"
              >
                <img
                  src={project.image ? `${baseURL}${project.image}` : activity1}
                  alt="image"
                  className="w-full h-full object-cover object-center transition-transform duration-500 ease-in-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-lg"></div>

                <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 text-[10px] rounded-full bg-white/20 border border-white/30 backdrop-blur-sm">Project</span>
                    <span className="text-[10px] text-gray-200">{project.date || ""}</span>
                  </div>
                  <p className="text-xl font-bold">{project.title}</p>
                  <p className="text-xs mt-1 line-clamp-3">
                    {project.description?.length > 180
                      ? project.description.slice(0, 180) + "..."
                      : project.description}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <Link
                      to={`/our-projects/${project.id}`}
                      className="px-3 text-gray-200 hover:text-white py-1 text-xs border border-gray-200 hover:border-white rounded"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donate Section */}
      <section className="w-full bg-white py-20">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-10 p-6 rounded-3xl bg-orange-50 border border-orange-100 shadow-sm">
            <img src={getInvolvedImg} alt="img" className="w-full h-auto md:w-[460px] rounded-2xl shadow" />
            <div className="flex flex-col items-center md:items-start gap-5">
              <p className="text-3xl md:text-4xl text-gray-800 font-bold chewy text-center md:text-left leading-tight">
                Give food. Bring hope. Fuel brighter futures.
              </p>
              <p className="text-base md:text-lg text-gray-700 font-light text-center md:text-left">
                Your contribution turns into meals, medicine, and safe spaces for women and families who need it most.
              </p>
              <ul className="text-sm text-gray-700 space-y-2 w-full max-w-lg">
                {[
                  "Transparent tracking of where your support goes.",
                  "Secure payment options including GCash and bank transfers.",
                  "Direct impact on local communities and shelters.",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-[10px] mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <Link
                  to="/donate"
                  className="px-6 py-3 rounded-md text-sm text-white hover:text-white bg-orange-600 transform transition-transform duration-300 hover:scale-105 cursor-pointer shadow"
                >
                  Donate Now
                </Link>
                <Link
                  to="/contact-us"
                  className="px-6 py-3 rounded-md text-sm text-orange-600 hover:text-orange-700 border border-orange-200 bg-white hover:bg-orange-50 transform transition-transform duration-300 hover:scale-105 cursor-pointer"
                >
                  Talk to Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Words That Inspire */}
      <section className="w-full bg-orange-600 py-20">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="pb-8 flex flex-col gap-2 items-center text-white">
            <h1 className="text-4xl chewy">Words That Inspire</h1>
            <p className="text-center">Timeless reminders of compassion, purpose, and giving.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {[
              {
                text: "I don't think you ever stop giving. I really don't. I think it's an on-going process...",
                author: "Oprah Winfrey",
              },
              {
                text: "At the end of the day it's not about what you have... it's about what you've given back.",
                author: "Denzel Washington",
              },
              {
                text: "Volunteers are the only human beings... who reflect this nation's compassion.",
                author: "Erma Bombeck",
              },
            ].map((quote, index) => (
              <div
                key={index}
                data-aos="fade-left"
                data-aos-delay={`${(index + 1) * 100}`}
                className="text-white w-full md:w-80 h-fit p-5 rounded-lg bg-white/15 backdrop-blur-md shadow-lg"
              >
                <p className="text-base italic chewy">"{quote.text}"</p>
                <p className="pt-4 text-right text-xl chewy">- {quote.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Get Involved */}
      <section className="w-full py-20 bg-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 flex flex-col gap-8">
          <div className="flex flex-col space-y-3 items-center text-center">
            <h1 className="text-3xl md:text-4xl chewy text-gray-800">Get Involved</h1>
            <p className="text-lg text-gray-700 poppins-regular max-w-2xl">
              Join us as a volunteer, donor, or partner. Every hand extended makes our community stronger.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                title: "Volunteer",
                desc: "Be on the ground for events, relief drives, and community sessions.",
                action: "Sign up",
                to: "/contact-us",
              },
              {
                title: "Donate",
                desc: "Support programs with one-time or recurring gifts through secure channels.",
                action: "Donate now",
                to: "/donate",
              },
              {
                title: "Partner",
                desc: "Collaborate as an organization or sponsor to scale our impact.",
                action: "Partner with us",
                to: "/contact-us",
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col gap-3">
                <p className="text-lg font-semibold text-gray-800">{item.title}</p>
                <p className="text-sm text-gray-600 flex-1">{item.desc}</p>
                <Link to={item.to} className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700">
                  {item.action} <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <ChatButton />
    </div>
  );
};

export default Home;
