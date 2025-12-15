import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { _get } from "../api";

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

  const [recentProjects, setRecentProjects] = useState([]);

  useEffect(() => {
      fetchPastProjects();
  }, []);

  const fetchPastProjects = async () => {
      try {
          const response = await _get("/past-projects");
          setRecentProjects(response.data);
      } catch (error) {
          console.error('Error fetching events:', error);
      }
  };

  return (
    <div className="w-full md:w-screen bg-gray-50 min-h-screen overflow-x-hidden">

      <Header />

      {/* Hero Section */}
      <section className="w-full py-20 pb-5">
        <div className="w-full max-w-[1200px] mx-auto pt-20 flex justify-center items-start">
          <div className="flex flex-col space-y-10 text-center">
            <div className="flex flex-col space-y-2">
              <h1 className="text-5xl text-gray-800 font-bold chewy">
                Welcome to the{" "}
                <span className="text-orange-600 chewy">Kalinga ng Kababaihan</span>
              </h1>
              <p className="text-gray-600 text-base poppins-regular">
                We are a non-profit organization that is dedicated to helping the less fortunate.
              </p>
            </div>

            <div className="w-full flex items-center justify-center gap-4">
                <Link className="px-6 py-3 rounded-md text-sm text-white hover:text-white bg-orange-600 transform transition-transform duration-300 hover:scale-105 cursor-pointer" to="/donate">
                  Donate Now
                </Link>

                <Link
                  to="/contact-us"
                  className="w-fit px-6 py-3 rounded-md text-sm text-gray-700 hover:text-gray-900 border border-gray-300 bg-white hover:bg-ray-200 transform transition-transform duration-300 hover:scale-105 cursor-pointer"
                >
                  Contact Us
                </Link>
            </div>

            {/* Slider */}
            <div className="px-5">
               <div className="relative w-full h-[250px] sm:h-[350px] md:h-[450px] mx-auto overflow-hidden rounded-3xl shadow-xl">
                  <div className="relative">
                    <img
                      src={images[currentIndex].src}
                      alt={`Slide ${currentIndex + 1}`}
                      className="w-full md:w-[1200px] h-[250px] sm:h-[350px] md:h-[600px] rounded-3xl object-cover transition-transform duration-500 ease-in-out"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-3xl"></div>
                    <div className="absolute inset-0 flex justify-center items-center text-white text-3xl font-bold text-center px-5">
                      <p className="italic">{images[currentIndex].text}</p>
                    </div>
                  </div>

                  {/* Navigation */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-5 top-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75"
                  >
                    ❮
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-5 top-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75"
                  >
                    ❯
                  </button>

                  {/* Dots */}
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, index) => (
                      <div
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-4 h-2 rounded-full transition-all ${
                          index === currentIndex ? "bg-white" : "bg-gray-400"
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
            </div>
           
          </div>
        </div>
      </section>

      {/* Recent Projects */}
      <section className="w-full bg-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 py-16 mt-12">
          <div className="pb-8 flex flex-col gap-2 items-center">
            <h1 className="text-4xl text-gray-800 chewy">Recent Projects</h1>
            <p className="text-center text-gray-800">Here are some of our latest initiatives dedicated to supporting women, families, and communities in need.</p>
          </div>

          <div className="w-full flex items-center justify-center flex-wrap gap-4">
            {recentProjects.map((project, index) => (
              <div
                key={index}
                data-aos="fade-down"
                className="relative w-full md:w-[500px] h-80 rounded-lg overflow-hidden group"
              >
                <img
                  src={project.image ? `${baseURL}${project.image}` : activity1}
                  alt="image"
                  className="w-full h-full object-cover object-center transition-transform duration-500 ease-in-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></div>

                <div className="absolute bottom-0 left-0 w-full text-white p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-xl font-bold">{project.title}</p>
                  <p className="text-xs">
                    {project.description.length > 150
                      ? project.description.slice(0, 150) + "..."
                      : project.description}
                  </p>
                  <div className="mt-3">
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
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <img src={getInvolvedImg} alt="img" className="w-full h-auto md:w-[500px] rounded-3xl" />
            <div className="flex flex-col items-center md:items-start gap-5">
              <p className="text-4xl text-gray-800 font-bold chewy text-center md:text-left">
                Give food and bring Hope.
              </p>
              <p className="text-xl text-gray-700 font-light text-center md:text-left">
                Every meal matters. Every donation counts. Start giving today.
              </p>
              <Link
                to="/donate"
                className="w-fit px-6 py-3 rounded-md text-sm text-white hover:text-white bg-orange-600 transform transition-transform duration-300 hover:scale-105 cursor-pointer"
              >
                Donate Now
              </Link>
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
                text: "I don’t think you ever stop giving. I really don’t. I think it’s an on-going process...",
                author: "Oprah Winfrey",
              },
              {
                text: "At the end of the day it’s not about what you have... it’s about what you’ve given back.",
                author: "Denzel Washington",
              },
              {
                text: "Volunteers are the only human beings... who reflect this nation’s compassion.",
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
                <p className="pt-4 text-right text-xl chewy">-{quote.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Get Involved */}
      <section className="w-full py-20">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex flex-col space-y-6 items-center text-center">
            <h1 className="text-4xl chewy text-gray-800">Get Involved</h1>
            <p className="text-lg text-gray-700 poppins-regular">
              We are always looking for volunteers to help us with our projects. If you are interested in helping out, please contact us.
            </p>
            <Link
              to="/contact-us"
              className="w-fit px-6 py-3 rounded-md text-sm text-white bg-orange-600 hover:bg-orange-700"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <ChatButton />
    </div>
  );
};

export default Home;

