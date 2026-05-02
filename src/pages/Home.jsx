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

const fallbackHeroImages = [
  { src: banner, text: "Think of giving not as a duty, but as a privilege." },
  { src: activity1, text: "Lose yourself in the service of others." },
  { src: activity2, text: "No act of kindness, no matter how small, is ever wasted." },
];

const defaultProgramCards = [
  {
    icon: <HeartHandshake className="w-8 h-8 text-slate-700" />,
    title: "Relief & Care",
    desc: "Food packs, hygiene kits, and safe spaces for women and children affected by crisis.",
  },
  {
    icon: <Sparkles className="w-8 h-8 text-slate-700" />,
    title: "Skills & Livelihood",
    desc: "Workshops and starter support that help women earn and build confidence.",
  },
  {
    icon: <Globe2 className="w-8 h-8 text-slate-700" />,
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
  const useFallbackHeroImages = true;

  const sliderImages = !useFallbackHeroImages && carouselImages.length
    ? carouselImages.map((item) => ({
      src: item?.image_path ? (item.image_path.startsWith("http") ? item.image_path : `${baseURL}${item.image_path}`) : "",
      text: item?.text || "",
      key: item?.id ?? item?.image_path,
    }))
    : fallbackHeroImages;

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
      Icon: HeartHandshake,
    },
    {
      label: homepageInfo?.meals_served_label || "Meals served",
      value: homepageInfo?.meals_served || "...",
      Icon: Sparkles,
    },
    {
      label: homepageInfo?.communities_reached_label || "Communities reached",
      value: homepageInfo?.communities_reached || "...",
      Icon: MapPin,
    },
    {
      label: homepageInfo?.number_of_volunteers_label || "Number of volunteers",
      value: homepageInfo?.number_of_volunteers || "...",
      Icon: Users,
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
      return <Users className="w-5 h-5 text-slate-700" />;
    }

    if (iconKey === "donate" || idx === 1) {
      return <HeartHandshake className="w-5 h-5 text-slate-700" />;
    }

    if (iconKey === "partner" || idx === 2) {
      return <CalendarDays className="w-5 h-5 text-slate-700" />;
    }

    return <Globe2 className="w-5 h-5 text-slate-700" />;
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
  const pageShell = "w-full max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-8";
  const eyebrowClass = "text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-600";
  const sectionTitleClass = "text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-slate-900";
  const sectionTextClass = "text-sm md:text-base leading-7 text-slate-600";
  const primaryButtonClass = "inline-flex items-center justify-center rounded-lg bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-700";
  const secondaryButtonClass = "inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50";
  const activeHeroSlide = sliderImages[currentIndex] || fallbackHeroImages[0];
  const heroSecondaryButtonClass = "inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/15";

  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-[#fcfcfb] text-slate-900">
      <Header />

      {/* Hero Section */}
      <section
        className="relative isolate w-full overflow-hidden border-b border-slate-200 bg-slate-950 text-white"
        onMouseEnter={() => setIsCarouselPaused(true)}
        onMouseLeave={() => setIsCarouselPaused(false)}
      >
        <div className="absolute inset-0">
          <img
            src={activeHeroSlide?.src || banner}
            alt={activeHeroSlide?.text || heroHeadline}
            className="h-full w-full object-cover transition-transform duration-700 ease-in-out"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/78 to-orange-700/55" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(251,146,60,0.12),transparent_22%)]" />
        </div>

        <div className={`${pageShell} relative flex min-h-[760px] flex-col justify-between py-24 md:min-h-[820px] md:py-28 lg:min-h-[860px] lg:py-32`}>
          <div className="max-w-4xl">
            <div className="flex flex-col gap-5">
              <span className="inline-flex w-fit rounded-full border border-white/18 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/88 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.75)] backdrop-blur-md">
                Kalinga Community
              </span>

              <div className="flex flex-col gap-4">
                <h1 className="w-full text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-white  md:text-6xl lg:text-[4.5rem]">
                  {heroHeadline}
                </h1>
                <p className="max-w-[60ch] text-base leading-8 text-white/82 md:text-xl">
                  {heroIntro}
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
                <Link
                  className={primaryButtonClass}
                  to={homepageInfo?.primary_button_url || "/donate"}
                >
                  {homepageInfo?.primary_button_text || "Donate Now"}
                </Link>
                <Link
                  to={homepageInfo?.secondary_button_url || "/contact-us"}
                  className={heroSecondaryButtonClass}
                >
                  {homepageInfo?.secondary_button_text || "Talk to Us"}
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 pt-12 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end xl:grid-cols-[minmax(0,1fr)_420px]">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map((item, idx) => (
                <div
                  key={idx}
                  className="flex min-h-[112px] flex-col justify-between rounded-[22px] border border-white/15 bg-white/10 p-4 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.7)] backdrop-blur-md"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-white/70">
                      {item.label}
                    </p>
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/14">
                      <item.Icon className="h-5 w-5 text-white" />
                    </span>
                  </div>
                  <p className="text-2xl font-semibold tracking-[-0.02em] text-white">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-[28px] border border-white/15 bg-white/10 p-5 shadow-[0_28px_70px_-40px_rgba(15,23,42,0.8)] backdrop-blur-md sm:p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-orange-200">
                Featured Reflection
              </p>
              <p className="mt-3 text-2xl font-semibold leading-snug text-white sm:text-[28px]">
                {activeHeroSlide?.text || "Community-first support, delivered with care."}
              </p>

              <div className="mt-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={prevSlide}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
                    aria-label="Next slide"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {sliderImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`cursor-pointer transition-all ${
                        index === currentIndex
                          ? "h-2 w-8 rounded-full bg-white"
                          : "h-2.5 w-2.5 rounded-full bg-white/50"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    ></button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Help */}
      <section className="w-full bg-white py-16 md:py-20">
        <div className={`${pageShell} flex flex-col gap-8`}>
          <div className="mx-auto flex max-w-3xl flex-col gap-3 text-center">
            <p className={eyebrowClass}>What we do</p>
            <h2 className={sectionTitleClass}>
              {programsInfo.title || "Programs that create lasting change"}
            </h2>
            <p className={sectionTextClass}>
              {programsInfo.description || "From immediate relief to long-term empowerment, our programs are designed to meet women and families where they are."}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
            {(programsInfo.programs.length ? programsInfo.programs : defaultProgramCards).map((item, idx) => (
              (() => {
                const fallbackProgram = defaultProgramCards[idx % defaultProgramCards.length];
                return (
              <div
                key={idx}
                className="flex flex-col gap-4 rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100">
                  {defaultProgramCards[idx % defaultProgramCards.length].icon}
                </div>
                <p className="text-lg font-semibold tracking-[-0.02em] text-slate-900">
                  {item.title || fallbackProgram.title}
                </p>
                <p className="text-sm leading-7 text-slate-600">
                  {item.description || item.desc || fallbackProgram.desc}
                </p>
                <span className="mt-auto h-px w-12 rounded-full bg-slate-200" />
              </div>
                );
              })()
            ))}
          </div>
        </div>
      </section>

      {/* Recent Projects */}
      <section className="w-full bg-[#f5f6f8] py-16 md:py-20">
        <div className={`${pageShell} flex flex-col gap-8`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex flex-col gap-2 text-left">
              <p className={eyebrowClass}>Recent work</p>
              <h2 className={sectionTitleClass}>Recent Projects</h2>
              <p className={`${sectionTextClass} max-w-2xl`}>
                Here are some of our latest initiatives dedicated to supporting women, families, and communities in need.
              </p>
            </div>
            <Link
              to="/our-projects"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-orange-600"
            >
              View all projects <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {hasProjects
              ? recentProjects.map((project, index) => (
                <div
                  key={index}
                  data-aos="fade-down"
                  className="group relative h-80 w-full overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm"
                >
                  <img
                    src={project.image ? `${baseURL}${project.image}` : activity1}
                    alt="image"
                    className="w-full h-full object-cover object-center transition-transform duration-500 ease-in-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/15 to-transparent"></div>

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
                <div className="col-span-full rounded-[24px] border border-slate-200 bg-white p-8">
                  <p className="text-sm text-slate-600">
                    Our team is preparing our latest project updates. Please check back soon.
                  </p>
                </div>
              )}
          </div>
        </div>
      </section>

      {/* Donate Section */}
      <section className="w-full bg-white py-16 md:py-20">
        <div className={pageShell}>
          <div className="grid grid-cols-1 items-stretch gap-8 rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm md:min-h-[340px] md:grid-cols-[0.95fr_1.05fr] md:p-8">
            <div className="w-full h-full min-h-[220px]">
              {encouragementInfo.image_path ? (
                <img
                  src={
                    encouragementInfo.image_path.startsWith("http")
                      ? encouragementInfo.image_path
                      : `${baseURL}${encouragementInfo.image_path}`
                  }
                  alt={encouragementInfo.title || "img"}
                  className="h-full w-full rounded-[24px] border border-slate-200 object-cover shadow-sm"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-[24px] border border-slate-200 bg-slate-100 p-4 text-center text-sm font-medium uppercase tracking-wide text-slate-500">
                  no image avaiable
                </div>
              )}
            </div>
            <div className="flex flex-col items-center gap-5 md:items-start">
              <p className={eyebrowClass}>Support that reaches people directly</p>
              <p className="text-center text-3xl font-semibold leading-tight tracking-[-0.02em] text-slate-900 md:text-left md:text-4xl">
                {encouragementInfo.title || "Give food. Bring hope. Fuel brighter futures."}
              </p>
              <p className="text-center text-base leading-7 text-slate-600 md:text-left md:text-lg">
                {encouragementInfo.description || "Your contribution turns into meals, medicine, and safe spaces for women and families who need it most."}
              </p>
              <ul className="w-full space-y-2 text-sm text-slate-600">
                {activeEncouragementChecklist.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                    <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-orange-100">
                      <Check size={15} className="text-orange-500" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <Link
                  to={homepageInfo?.primary_button_url || "/donate"}
                  className={primaryButtonClass}
                >
                  {homepageInfo?.primary_button_text || "Donate Now"}
                </Link>
                <Link
                  to={homepageInfo?.secondary_button_url || "/contact-us"}
                  className={secondaryButtonClass}
                >
                  {homepageInfo?.secondary_button_text || "Talk to Us"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Words That Inspire */}
      <section className="w-full bg-white py-16 md:py-20">
        <div className={pageShell}>
          <div className="rounded-[30px] border border-slate-200 bg-[#f7f5f1] p-6 shadow-sm md:p-10">
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 pb-8 text-center">
            <p className={eyebrowClass}>Stories and reminders</p>
            <h2 className={sectionTitleClass}>
              {quotesInfo.title || defaultWordOfInspire.title}
            </h2>
            <p className={`${sectionTextClass} max-w-2xl`}>
              {quotesInfo.description || defaultWordOfInspire.description}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {(quotesInfo.quotes.length ? quotesInfo.quotes : defaultWordOfInspire.quotes).map((quote, index) => (
              <div
                key={index}
                data-aos="fade-left"
                data-aos-delay={`${(index + 1) * 100}`}
                className="flex h-full flex-col rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <p className="text-base italic leading-7 text-slate-700">&ldquo;{quote.quote}&rdquo;</p>
                <p className="mt-5 text-right text-sm font-semibold text-slate-500">&mdash; {quote.author}</p>
              </div>
            ))}
          </div>
          </div>
        </div>
      </section>

      {/* Get Involved */}
      <section className="w-full bg-[#f5f6f8] py-16 md:py-20">
        <div className={`${pageShell} flex flex-col gap-8`}>
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 text-center">
            <p className={eyebrowClass}>Ways to help</p>
            <h2 className={sectionTitleClass}>
              {involvementInfo.title || defaultInvolvementInfo.title}
            </h2>
            <p className="max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
              {involvementInfo.description || defaultInvolvementInfo.description}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
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
              <div key={idx} className="group flex flex-col gap-4 rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100">
                  {getInvolvementIcon(item, idx)}
                </div>
                <p className="text-lg font-semibold tracking-[-0.02em] text-slate-900">{title}</p>
                <p className="flex-1 text-sm leading-7 text-slate-600">{cardDescription}</p>
                <Link
                  to={cardUrl}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition group-hover:text-orange-600"
                >
                  {cardAction} <ArrowRight size={16} />
                </Link>
                <span className="h-px w-14 rounded-full bg-slate-200" />
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

