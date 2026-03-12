import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { _get } from "../api";
import {
  HeartHandshake,
  Sparkles,
  Globe2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Check,
  CalendarDays,
  MapPin,
  Users
} from "lucide-react";

import Header from "../components/headers/Header";
import Footer from "../components/Footer";
import ChatButton from "../components/chatbot/ChatButton";

import banner from "../assets/img/banner.png";
import activity1 from "../assets/img/activity1.png";
import activity2 from "../assets/img/activity2.png";
import getInvolvedImg from "../assets/img/involved.png";
import Picture1 from "../assets/img/Picture1.jpg";

const images = [
  { src: banner, text: "Think of giving not as a duty, but as a privilege." },
  { src: Picture1, text: "Lose yourself in the service of others." },
  { src: activity2, text: "No act of kindness, no matter how small, is ever wasted." },
];

const defaultProgramCards = [
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
];

const defaultEncouragementChecklist = [
  "Transparent tracking of where your support goes.",
  "Secure payment options including GCash and bank transfers.",
  "Direct impact on local communities and shelters.",
];

const defaultWordOfInspire = {
  title: "Words That Inspire",
  description: "Timeless reminders of compassion, purpose, and giving.",
  quotes: [
    {
      quote: "I don't think you ever stop giving. I really don't. I think it's an on-going process...",
      author: "Oprah Winfrey",
    },
    {
      quote: "At the end of the day it's not about what you have... it's about what you've given back.",
      author: "Denzel Washington",
    },
    {
      quote: "Volunteers are the only human beings... who reflect this nation's compassion.",
      author: "Erma Bombeck",
    },
  ],
};

const defaultInvolvementInfo = {
  title: "Get Involved",
  description:
    "Join us as a volunteer, donor, or partner. Every hand extended makes our community stronger.",
  involvements: [
    {
      title: "Volunteer",
      description: "Be on the ground for events, relief drives, and community sessions.",
      action: "Volunteer now",
      url: "/contact-us",
      icon: "volunteer",
    },
    {
      title: "Donate",
      description: "Support programs with one-time or recurring gifts through secure channels.",
      action: "Donate now",
      url: "/donate",
      icon: "donate",
    },
    {
      title: "Partner",
      description: "Collaborate as an organization or sponsor to scale our impact.",
      action: "Partner with us",
      url: "/contact-us",
      icon: "partner",
    },
  ],
};

const Home = () => {
  const baseURL = "https://api.kalingangkababaihan.com/storage/";

  const [currentIndex, setCurrentIndex] = useState(0);
  const [recentProjects, setRecentProjects] = useState([]);
  const [homepageInfo, setHomepageInfo] = useState(null);
  const [carouselImages, setCarouselImages] = useState([]);
  const [programsInfo, setProgramsInfo] = useState({
    title: "",
    description: "",
    programs: [],
  });
  const [encouragementInfo, setEncouragementInfo] = useState({
    title: "",
    description: "",
    checklist: [],
    image_path: "",
  });
  const [quotesInfo, setQuotesInfo] = useState({
    title: "",
    description: "",
    quotes: [],
  });
  const [involvementInfo, setInvolvementInfo] = useState({
    title: "",
    description: "",
    involvements: [],
  });
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);

  const sliderImages = carouselImages.length
    ? carouselImages.map((item) => ({
      src: item?.image_path ? (item.image_path.startsWith("http") ? item.image_path : `${baseURL}${item.image_path}`) : "",
      text: item?.text || "",
      key: item?.id ?? item?.image_path,
    }))
    : images;

  const hasCarouselImages = sliderImages.length > 0;
  const heroHeadline = homepageInfo?.welcome_message || "Welcome to Kalinga ng Kababaihan";
  const heroIntro =
    homepageInfo?.intro_text ||
    "Kalinga ng Kababaihan is dedicated to empowering women and families through comprehensive support programs, community building, and advocacy.";
  const activeEncouragementChecklist = Array.isArray(encouragementInfo.checklist) &&
    encouragementInfo.checklist.some((item) => String(item).trim() !== "")
      ? encouragementInfo.checklist
      : defaultEncouragementChecklist;
  const stats = [
    {
      label: homepageInfo?.women_supported_label || "Women supported",
      value: homepageInfo?.women_supported || "...",
      icon: <HeartHandshake className="w-5 h-5 text-orange-600" />,
    },
    {
      label: homepageInfo?.meals_served_label || "Meals served",
      value: homepageInfo?.meals_served || "...",
      icon: <Sparkles className="w-5 h-5 text-orange-600" />,
    },
    {
      label: homepageInfo?.communities_reached_label || "Communities reached",
      value: homepageInfo?.communities_reached || "...",
      icon: <MapPin className="w-5 h-5 text-orange-600" />,
    },
    {
      label: homepageInfo?.number_of_volunteers_label || "Number of volunteers",
      value: homepageInfo?.number_of_volunteers || "...",
      icon: <Users className="w-5 h-5 text-orange-600" />,
    },
  ];
  const hasProjects = recentProjects.length > 0;

  useEffect(() => {
    if (isCarouselPaused || sliderImages.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [isCarouselPaused, sliderImages.length]);

  const getInvolvementIcon = (item, idx) => {
    const iconKey = String(item?.icon || "").toLowerCase();
    if (iconKey === "volunteer" || idx === 0) {
      return <Users className="w-5 h-5 text-orange-600" />;
    }

    if (iconKey === "donate" || idx === 1) {
      return <HeartHandshake className="w-5 h-5 text-orange-600" />;
    }

    if (iconKey === "partner" || idx === 2) {
      return <CalendarDays className="w-5 h-5 text-orange-600" />;
    }

    return <Globe2 className="w-5 h-5 text-orange-600" />;
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? sliderImages.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === sliderImages.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    fetchPastProjects();
    fetchHomepageInfo();
    fetchCarouselImages();
    fetchProgramsInfo();
    fetchEncouragementInfo();
    fetchQuotesInfo();
    fetchInvolvementInfo();
  }, []);

  const fetchPastProjects = async () => {
    try {
      const response = await _get("/past-projects");
      setRecentProjects(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchCarouselImages = async () => {
    try {
      const response = await _get("/homepage-carousel");
      const payload = response.data || [];
      const list = Array.isArray(payload) ? payload : [];
      setCarouselImages(list);
      if (list.length) {
        setCurrentIndex(0);
      }
    } catch (error) {
      console.error("Error fetching homepage carousel:", error);
      setCarouselImages([]);
    }
  };

  const fetchHomepageInfo = async () => {
    try {
      const response = await _get("/homepage-info");
      setHomepageInfo(response.data);
    } catch (error) {
      console.error("Error fetching homepage info:", error);
    }
  };

  const fetchProgramsInfo = async () => {
    try {
      const response = await _get("/programs-info");
      const data = response.data || {};
      const incomingPrograms = Array.isArray(data.programs)
        ? data.programs.map((program) => ({
            title: program?.title || "",
            description: program?.description || "",
          }))
        : [];

      setProgramsInfo({
        title: data.title || "",
        description: data.description || "",
        programs: incomingPrograms,
      });
    } catch (error) {
      console.error("Error fetching programs info:", error);
      setProgramsInfo({
        title: "",
        description: "",
        programs: [],
      });
    }
  };

  const fetchEncouragementInfo = async () => {
    try {
      const response = await _get("/encouragement-info");
      const data = response.data || {};
      const incomingChecklist = Array.isArray(data.checklist)
        ? data.checklist.map((entry) => entry?.item || "")
        : [];
      setEncouragementInfo({
        title: data.title || "",
        description: data.description || "",
        checklist: incomingChecklist,
        image_path: data.image_path || "",
      });
    } catch (error) {
      console.error("Error fetching encouragement info:", error);
      setEncouragementInfo({
        title: "",
        description: "",
        checklist: [],
        image_path: "",
      });
    }
  };

  const fetchQuotesInfo = async () => {
    try {
      const response = await _get("/quotes-info");
      const data = response.data || {};
      const incomingQuotes = Array.isArray(data.quotes)
        ? data.quotes.map((entry) => ({
            quote: entry?.quote || "",
            author: entry?.author || "",
          }))
        : [];

      setQuotesInfo({
        title: data.title || "",
        description: data.description || "",
        quotes: incomingQuotes,
      });
    } catch (error) {
      console.error("Error fetching quotes info:", error);
      setQuotesInfo({
        title: "",
        description: "",
        quotes: [],
      });
    }
  };

  const fetchInvolvementInfo = async () => {
    try {
      const response = await _get("/involvement-info");
      const data = response.data || {};
      const incomingInvolvements = Array.isArray(data.involvements)
        ? data.involvements.map((entry) => ({
            title: entry?.title || "",
            description: entry?.description || "",
            action: entry?.action || "",
            url: entry?.url || "",
          }))
        : [];

      setInvolvementInfo({
        title: data.title || "",
        description: data.description || "",
        involvements: incomingInvolvements,
      });
    } catch (error) {
      console.error("Error fetching involvement info:", error);
      setInvolvementInfo({
        title: "",
        description: "",
        involvements: [],
      });
    }
  };

  const involvementCards = (
    involvementInfo.involvements.length > 0
      ? involvementInfo.involvements
      : defaultInvolvementInfo.involvements
  );

  return (
    <div className="w-full bg-white min-h-screen overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <section className="w-full py-16 md:py-20 bg-gradient-to-r from-orange-50 via-white to-orange-100">
        <div className="w-full max-w-[1200px] mx-auto px-4 pt-8 lg:pt-16 flex flex-col lg:flex-row items-center gap-10">
          <div className="w-full lg:w-1/2 flex flex-col space-y-6 text-left">
            <div className="flex flex-col gap-3">
              <p className="text-xs uppercase tracking-[0.18em] text-orange-500 font-semibold">Together, we uplift</p>
              <h1 className="text-4xl md:text-5xl text-gray-800 font-bold leading-[1.12] chewy max-w-[14ch] sm:max-w-none">
                {heroHeadline}
              </h1>
              <p className="text-gray-600 text-base md:text-lg poppins-regular max-w-[560px]">
                {heroIntro}
              </p>
            </div>

            <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Link
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-semibold text-white hover:text-white bg-orange-600 hover:bg-orange-700 shadow-sm"
                to={homepageInfo?.primary_button_url || "/donate"}
              >
                {homepageInfo?.primary_button_text || "Donate Now"}
              </Link>
              <Link
                to={homepageInfo?.secondary_button_url || "/contact-us"}
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-semibold text-orange-600 hover:text-orange-700 border border-orange-200 bg-white hover:border-orange-300 transition-colors"
              >
                {homepageInfo?.secondary_button_text || "Talk to Us"}
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {stats.map((item, idx) => (
                <div key={idx} className="relative bg-white border border-orange-100 rounded-xl p-4 shadow-sm flex flex-col justify-between min-h-[92px]">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">{item.label}</p>
                    {item.icon}
                  </div>
                  <p className="text-2xl font-bold text-orange-600">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <div
              className="relative w-full h-[260px] sm:h-[360px] md:h-[420px] overflow-hidden rounded-3xl shadow-xl border border-orange-100/40"
              onMouseEnter={() => setIsCarouselPaused(true)}
              onMouseLeave={() => setIsCarouselPaused(false)}
            >
              <img
                src={hasCarouselImages ? sliderImages[currentIndex]?.src : banner}
                alt={hasCarouselImages ? `Slide ${currentIndex + 1}` : `Slide ${currentIndex + 1}`}
                className="w-full h-full object-cover rounded-3xl transition-transform duration-700 ease-in-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-3xl"></div>

              <div className="absolute left-4 right-4 bottom-5">
                <div className="bg-black/35 backdrop-blur-sm border border-white/20 rounded-xl px-5 py-4 text-white">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-orange-100 mb-1.5">Featured Story</p>
                  <p className="text-base md:text-xl font-semibold leading-snug">
                    {sliderImages[currentIndex]?.text || "Community-first support, delivered with heart."}
                  </p>
                </div>
              </div>

              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/85 text-gray-800 p-2 hover:bg-white shadow flex items-center justify-center"
                aria-label="Previous slide"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/85 text-gray-800 p-2 hover:bg-white shadow flex items-center justify-center"
                aria-label="Next slide"
              >
                <ChevronRight size={20} />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {sliderImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`transition-all cursor-pointer ${
                      index === currentIndex
                        ? "w-8 h-2 rounded-full bg-white"
                        : "w-2.5 h-2.5 rounded-full bg-white/50"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  ></button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Help */}
      <section className="w-full bg-white py-16 md:py-20">
        <div className="max-w-[1200px] mx-auto px-4 flex flex-col gap-8">
          <div className="flex flex-col gap-2 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold">What we do</p>
            <h2 className="text-3xl md:text-4xl chewy text-gray-800">
              {programsInfo.title || "Programs that create lasting change"}
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-sm md:text-base">
              {programsInfo.description || "From immediate relief to long-term empowerment, our programs are designed to meet women and families where they are."}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {(programsInfo.programs.length ? programsInfo.programs : defaultProgramCards).map((item, idx) => (
              (() => {
                const fallbackProgram = defaultProgramCards[idx % defaultProgramCards.length];
                return (
              <div
                key={idx}
                className="bg-gray-50 border border-orange-100 rounded-2xl p-6 flex flex-col gap-3 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center border border-orange-100">
                  {defaultProgramCards[idx % defaultProgramCards.length].icon}
                </div>
                <p className="text-lg font-semibold text-gray-800">
                  {item.title || fallbackProgram.title}
                </p>
                <p className="text-sm text-gray-600">
                  {item.description || item.desc || fallbackProgram.desc}
                </p>
                <span className="mt-2 w-12 h-0.5 bg-gradient-to-r from-orange-400 to-orange-200 rounded-full" />
              </div>
                );
              })()
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
              <p className="text-gray-700 max-w-2xl text-sm md:text-base">
                Here are some of our latest initiatives dedicated to supporting women, families, and communities in need.
              </p>
            </div>
            <Link
              to="/our-projects"
              className="inline-flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 font-semibold"
            >
              View all projects <ArrowRight size={16} />
            </Link>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            {hasProjects
              ? recentProjects.map((project, index) => (
                <div
                  key={index}
                  data-aos="fade-down"
                  className="relative w-full h-80 rounded-2xl overflow-hidden group shadow-sm bg-white"
                >
                  <img
                    src={project.image ? `${baseURL}${project.image}` : activity1}
                    alt="image"
                    className="w-full h-full object-cover object-center transition-transform duration-500 ease-in-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-2xl"></div>

                  <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 text-[10px] rounded-full bg-white/20 border border-white/30 backdrop-blur-sm">
                        Project
                      </span>
                      {project.date && (
                        <span className="text-[10px] text-gray-200">{project.date}</span>
                      )}
                    </div>
                    <p className="text-xl font-bold">{project.title}</p>
                    <p className="text-xs mt-1 line-clamp-3">
                      {project.description?.length > 180
                        ? project.description.slice(0, 180) + "..."
                        : project.description}
                    </p>
                    <div className="mt-4">
                      <Link
                        to={`/our-projects/${project.id}`}
                        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-200 hover:text-white"
                      >
                        Read More <ArrowRight size={15} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
              : (
                <div className="col-span-full rounded-xl border border-orange-100 bg-white p-8">
                  <p className="text-sm text-gray-600">
                    Our team is preparing our latest project updates. Please check back soon.
                  </p>
                </div>
              )}
          </div>
        </div>
      </section>

      {/* Donate Section */}
      <section className="w-full bg-white py-20 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-10 p-6 md:p-8 rounded-3xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 shadow-sm">
            <img
              src={
                encouragementInfo.image_path
                  ? (encouragementInfo.image_path.startsWith("http")
                    ? encouragementInfo.image_path
                    : `${baseURL}${encouragementInfo.image_path}`)
                  : getInvolvedImg
              }
              alt={encouragementInfo.title || "img"}
              className="w-full h-auto md:w-[460px] rounded-2xl shadow-sm border border-white/80"
            />
            <div className="flex flex-col items-center md:items-start gap-5 max-w-xl">
              <p className="text-3xl md:text-4xl text-gray-800 font-bold chewy text-center md:text-left leading-tight">
                {encouragementInfo.title || "Give food. Bring hope. Fuel brighter futures."}
              </p>
              <p className="text-base md:text-lg text-gray-700 font-light text-center md:text-left">
                {encouragementInfo.description || "Your contribution turns into meals, medicine, and safe spaces for women and families who need it most."}
              </p>
              <ul className="text-sm text-gray-700 space-y-2 w-full max-w-lg">
                {activeEncouragementChecklist.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-0.5">
                      <Check size={15} className="text-orange-500" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <Link
                  to={homepageInfo?.primary_button_url || "/donate"}
                  className="px-6 py-3 rounded-md text-sm text-white hover:text-white bg-orange-600 transform transition-transform duration-300 hover:scale-105 cursor-pointer shadow"
                >
                  {homepageInfo?.primary_button_text || "Donate Now"}
                </Link>
                <Link
                  to={homepageInfo?.secondary_button_url || "/contact-us"}
                  className="px-6 py-3 rounded-md text-sm text-orange-600 hover:text-orange-700 border border-orange-200 bg-white hover:bg-orange-50 transform transition-transform duration-300 hover:scale-105 cursor-pointer"
                >
                  {homepageInfo?.secondary_button_text || "Talk to Us"}
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
            <span className="h-0.5 w-14 bg-white/70 rounded-full" />
            <h1 className="text-4xl chewy text-center">
              {quotesInfo.title || defaultWordOfInspire.title}
            </h1>
            <p className="text-center max-w-2xl text-white/95">
              {quotesInfo.description || defaultWordOfInspire.description}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {(quotesInfo.quotes.length ? quotesInfo.quotes : defaultWordOfInspire.quotes).map((quote, index) => (
              <div
                key={index}
                data-aos="fade-left"
                data-aos-delay={`${(index + 1) * 100}`}
                className="text-white w-full md:w-80 h-fit p-6 rounded-xl bg-white/15 backdrop-blur-md shadow-lg border border-white/25 flex flex-col"
              >
                <p className="text-base italic chewy">&ldquo;{quote.quote}&rdquo;</p>
                <p className="mt-5 text-right text-sm text-white/90 font-semibold">&mdash; {quote.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Get Involved */}
      <section className="w-full py-20 bg-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 flex flex-col gap-8">
          <div className="flex flex-col space-y-3 items-center text-center">
            <h1 className="text-3xl md:text-4xl chewy text-gray-800">
              {involvementInfo.title || defaultInvolvementInfo.title}
            </h1>
            <p className="text-lg text-gray-700 poppins-regular max-w-2xl">
              {involvementInfo.description || defaultInvolvementInfo.description}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {involvementCards.map((item, idx) => (
              (() => {
                const fallbackItem = defaultInvolvementInfo.involvements[idx];
                const title = item?.title || fallbackItem?.title || "";
                const cardDescription = item?.description || fallbackItem?.description || "";
                const cardAction = (
                  item?.action?.trim() ||
                  (title.toLowerCase() === "donate"
                    ? "Donate now"
                    : title.toLowerCase() === "partner"
                    ? "Partner with us"
                    : "Sign up")
                );
                const cardUrl = item?.url || (title.toLowerCase() === "donate" ? "/donate" : "/contact-us");

                return (
              <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col gap-3 group hover:-translate-y-1 hover:shadow-md transition-all">
                <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                  {getInvolvementIcon(item, idx)}
                </div>
                <p className="text-lg font-semibold text-gray-800">{title}</p>
                <p className="text-sm text-gray-600 flex-1">{cardDescription}</p>
                <Link
                  to={cardUrl}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 group-hover:text-orange-700"
                >
                  {cardAction} <ArrowRight size={16} />
                </Link>
                <span className="w-14 h-0.5 bg-gradient-to-r from-orange-500 to-orange-200 rounded-full" />
              </div>
                );
              })()
            ))}
          </div>
        </div>
      </section>

      <Footer className="mt-0" />
      <ChatButton />
    </div>
  );
};

export default Home;

