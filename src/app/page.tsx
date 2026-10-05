"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import {faKey, faArrowRight, faCloudDownload, faBarsStaggered, faXmark,
        faCircleCheck, faCalendarAlt, faBoxesPacking, faCode, 
        faUsers, faArrowUp, faDesktopAlt, faCodePullRequest, 
        faDatabase, faTools, faEnvelope, faPhone, faMapLocation,
        faPaperPlane, faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@/components/buttons/button";
import { LoginModal } from "@/components/modals/login_modal";
import Image from "next/image";
import ThemeToggle from "@/components/buttons/toggle_button";
import scrollToSection from "@/lib/utils";
import { ProjectsCarousel } from "@/components/carousels/projects_carousel";
import { getAllProjects, getCurrentlyBuildingProject, CurrentlyBuildingProject } from "@/lib/api/projects";
import { getAllSkills, PaginatedSkills } from "@/lib/api/skills";
import type { ProjectsCardProps } from "@/components/cards/projects_card";
import { SplashScreen } from "@/components/splash/splash_screen";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth_provider";

export default function Home() {
  const router = useRouter();
  const { status, signIn } = useAuth();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInitialDataLoading, setIsInitialDataLoading] = useState(true);
  const [isProjectsLoading, setIsProjectsLoading] = useState(true);
  const [hasMetMinimumDisplayTime, setHasMetMinimumDisplayTime] = useState(false);
  const [readyProjects, setReadyProjects] = useState<ProjectsCardProps[]>([]);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  const [apiSkills, setApiSkills] = useState<PaginatedSkills>({ skills: [], total: 0, page: 1, limit: 100 });
  const [isSkillsLoading, setIsSkillsLoading] = useState(true);
  const [skillsError, setSkillsError] = useState<string | null>(null);

  useEffect(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);

  const [currentlyBuilding, setCurrentlyBuilding] = useState<CurrentlyBuildingProject | null>(null);

  useEffect(() => {
    const minimumDisplayTimer = window.setTimeout(() => {
      setHasMetMinimumDisplayTime(true);
    }, 900);

    return () => window.clearTimeout(minimumDisplayTimer);
  }, []);

  useEffect(() => {
    getCurrentlyBuildingProject()
      .then(setCurrentlyBuilding)
      .catch((error) => {
        console.log("Error fetching currently building project", error);
      })
      .finally(() => setIsInitialDataLoading(false));
  }, []);

  useEffect(() => {
    getAllProjects({ page: 1, limit: 50 })
      .then((result) => setReadyProjects(result.projects))
      .catch((error) => {
        console.error("Error fetching ready projects", error);
        setProjectsError("Unable to load projects right now.");
      })
      .finally(() => setIsProjectsLoading(false));
  }, []);

  useEffect(() => {
    getAllSkills({ page: 1, limit: 100 })
      .then(setApiSkills)
      .catch((error) => {
        console.error("Error fetching skills", error);
        setSkillsError("Unable to load skills right now.");
      })
      .finally(() => setIsSkillsLoading(false));
  }, []);

  const handleLogin = async (credentials: {
    email: string;
    password: string;
  }) => {
    try {
      await signIn(credentials);
      setIsLoginOpen(false);
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error("Unable to sign in right now. Please try again later.");
      }

      throw error instanceof Error
        ? error
        : new Error("Unable to sign in. Please try again.");
    }
  };

  const skills = [
    {"name": "React", "icon": "/assets/React.png"},
    {"name": "Next.js", "icon": "/assets/Next.js.png"},
    {"name": "TypeScript", "icon": "/assets/TypeScript.png"},
    {"name": "Node.js", "icon": "/assets/Node.js.png"},
    {"name": "FlutterFlow", "icon": "/assets/FlutterFlow.jpeg"},
    {"name": "PHP", "icon": "/assets/PHP.png"},
    {"name": "CodeIgniter", "icon": "/assets/CodeIgniter.png"},
    {"name": "PostgreSQL", "icon": "/assets/PostgresSQL.png"},
    {"name": "Supabase", "icon": "/assets/Supabase.png"},
  ]

  const skillset = {
    frontend: apiSkills.skills.filter((skill) => skill.category === "FRONTEND").map((skill) => skill.name),
    backend: apiSkills.skills.filter((skill) => skill.category === "BACKEND").map((skill) => skill.name),
    database: apiSkills.skills.filter((skill) => skill.category === "DATABASE").map((skill) => skill.name),
    tools: apiSkills.skills.filter((skill) => skill.category === "TOOLS").map((skill) => skill.name),
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      console.log("Email sent successfully");
      alert("Email sent successfully");
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending email", error);
      alert("Error sending email");
    }
  };

  return (
    <>
      <SplashScreen isVisible={isInitialDataLoading || isProjectsLoading || !hasMetMinimumDisplayTime} />
      <main className="flex min-h-screen w-full flex-col items-center overflow-x-clip bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex w-full flex-col items-center">

        {/* NAVBAR */}
        
        <div className="navbar fixed top-0 z-1000 mt-3 w-full max-w-[1600px] px-3 sm:mt-6 sm:px-6">
          <div className="navbar-content relative flex h-16 items-center justify-between rounded-lg bg-white/40 px-4 shadow-lg backdrop-blur-xl dark:bg-slate-900/40 sm:h-[72px] sm:px-6 lg:px-10">
            <a href="#">
              <div>
                <h1 className="text-4xl text-slate-950 dark:text-slate-100 font-bold sm:text-5xl">V<span className="text-blue-500 text-blue-500 dark:text-blue-600">C.</span></h1>
              </div>
            </a>
            <nav
              id="primary-navigation"
              aria-label="Primary navigation"
              className={`${isMenuOpen ? "flex" : "hidden"} absolute left-0 right-0 top-full mt-2 flex-col gap-1 rounded-lg bg-white/95 p-2 shadow-lg backdrop-blur-xl dark:bg-slate-900/95 md:static md:mt-0 md:flex md:flex-row md:gap-4 md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-none md:dark:bg-transparent`}
            >
              <a href="#about" onClick={() => setIsMenuOpen(false)} className="rounded-lg px-4 py-3 font-semibold hover:bg-blue-500 hover:text-white hover:dark:bg-blue-600 md:px-3 lg:px-5">About</a>
              <a href="#projects" onClick={() => setIsMenuOpen(false)} className="rounded-lg px-4 py-3 font-semibold hover:bg-blue-500 hover:text-white hover:dark:bg-blue-600 md:px-3 lg:px-5">Projects</a>
              <a href="#skills" onClick={() => setIsMenuOpen(false)} className="rounded-lg px-4 py-3 font-semibold hover:bg-blue-500 hover:text-white hover:dark:bg-blue-600 md:px-3 lg:px-5">Skills</a>
              <a href="#contact" onClick={() => setIsMenuOpen(false)} className="rounded-lg px-4 py-3 font-semibold hover:bg-blue-500 hover:text-white hover:dark:bg-blue-600 md:px-3 lg:px-5">Contact</a>
            </nav>
            <button
              type="button"
              aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMenuOpen}
              aria-controls="primary-navigation"
              onClick={() => setIsMenuOpen((open) => !open)}
              className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-700 hover:bg-blue-50 dark:text-slate-200 dark:hover:bg-slate-800 md:hidden"
            >
              <FontAwesomeIcon icon={isMenuOpen ? faXmark : faBarsStaggered} />
            </button>
            {status === "loading" ? (
              <Button variant="default" size="default" disabled className="bg-blue-500 text-white dark:bg-blue-600 hover:bg-blue-600">...</Button>
            ) : status === "authenticated" ? (
              <Button variant="default" size="default" className="bg-blue-500 text-white dark:bg-blue-600 hover:bg-blue-600" onClick={() => router.push("/dashboard")}><FontAwesomeIcon icon={faHome}/>Dashboard</Button>
            ) : (
              <Button variant="default" size="default" className="bg-blue-500 text-white dark:bg-blue-600 hover:bg-blue-600" onClick={() => setIsLoginOpen(true)}><FontAwesomeIcon icon={faKey}/>Login</Button>
            )}
          </div>
        </div>
      </div>

      {/* ABOUT SECTION*/}

      <section id="about" className="w-full bg-slate-50 dark:bg-slate-900">
        <div className="site-container flex flex-col justify-center gap-6 pt-28 sm:pt-32 xl:pt-38">
        <div className="hero relative flex flex-col gap-8 xl:flex-row xl:gap-12">
          <div className="z-10 flex max-w-xl flex-col gap-4">
            <div className="px-3 py-2 bg-blue-50 rounded-3xl w-32 dark:bg-blue-900 dark:text-blue-300">
              <h1 className="text-md font-bold text-blue-500">👋 Hello, I'm</h1>
            </div>
            <h1 className="text-4xl font-bold sm:text-5xl xl:text-7xl">Vincent <span className="text-blue-500 dark:text-blue-600">Castro</span></h1>
            <h1 className="text-2xl font-semibold dark:text-slate-400 sm:text-3xl">Frontend Developer building scalable web and mobile applications with modern technologies.</h1>
            <p className="text-md text-slate-600 dark:text-slate-400">I build responsive, production-ready web and mobile applications focused on performance, clean architecture, and exceptional user experience. With experience developing enterprise systems and cross-platform applications, I enjoy transforming complex business requirements into intuitive digital products.</p>
            <div className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:gap-4 lg:gap-6">
              <Button variant="default" size="default" className="bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600" onClick={() => {scrollToSection('projects')}}>View My Projects <FontAwesomeIcon icon={faArrowRight}/></Button>
              <Button asChild variant="outline" size="default" className="border-slate-200 dark:bg-slate-800 dark:border-slate-600">
                <a href="/assets/VINCENT-CASTRO-RESUME.pdf" download="VINCENT-CASTRO-RESUME.pdf">
                  Download Resume <FontAwesomeIcon icon={faCloudDownload}/>
                </a>
              </Button>
            </div>
          </div>
          {currentlyBuilding && (
            <div className="z-10 mt-0 flex h-fit w-full max-w-[20rem] flex-col gap-4 rounded-lg bg-white p-4 shadow-lg dark:bg-slate-800 xl:mt-16 xl:w-[224px]">
              <h1 className="text-md font-semibold text-blue-500">Currently Building</h1>
              <div className="flex gap-2 text-lg items-center">
                <div className="p-2 bg-blue-50 rounded-lg dark:bg-blue-900">
                  <FontAwesomeIcon icon={faBarsStaggered} className="text-blue-500 h-4 dark:text-blue-300"/>
                </div>
                <h1 className="font-bold">{currentlyBuilding.project_name}</h1>
              </div>
              <ul className="flex flex-col gap-4">
                {(currentlyBuilding.features ?? []).map((feature, index) => (
                  <li key={index} className="flex gap-2 text-sm"><FontAwesomeIcon icon={faCircleCheck} className="text-blue-500 h-4 mt-1"/>{feature}</li>
                ))}
              </ul>
              <div className="flex gap-2 flex-wrap">
                {currentlyBuilding.tech_stack.map((technology) => (
                  <div key={technology} className="flex bg-slate-100 px-2 p-1 rounded-2xl text-xs w-fit mb-1 dark:bg-slate-600">{technology}</div>
                ))}
              </div>
            </div>
          )}
          <div className="relative mx-auto mt-2 w-full max-w-[32rem] animate-float xl:absolute xl:right-0 xl:top-0 xl:mt-0 xl:w-1/2 xl:max-w-[800px]">
            <Image src="/assets/hero_display.png" alt="" width={800} height={500} className="h-auto w-full" />
          </div>
        </div>
        <div className="flex max-w-3xl gap-4 flex-wrap mt-4 mb-6">
          {skills.map((skill, index) =>(
            <div key={index} className="flex w-fit rounded-lg bg-white border border-slate-200 gap-2 p-3 shadow-sm dark:bg-slate-800 dark:border-slate-600 hover:scale-105 transition duration-300">
              <Image src={skill.icon} alt={skill.name} width={20} height={20} className="rounded-sm"/>
              <p className="text-sm">{skill.name}</p>
            </div>
          ))}
        </div>
        </div>
      </section>
        <div className="site-container flex flex-col items-start gap-8 py-8 lg:flex-row lg:gap-0">
          <div className="flex w-full gap-4 sm:gap-6 lg:w-1/2">
            <div className="flex-shrink-0">
              <Image src={theme === "dark" ? "/assets/teng_dark.png" : "/assets/teng_light.JPG"} alt="Vincent Castro" width={100} height={120} className="rounded-lg shadow-lg"/>
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-md text-blue-500 font-semibold">ABOUT ME</h1>
              <p className="text-sm text-sm max-w-lg dark:text-slate-400">I am a Frontend Developer with more than 2 years of professional experience building enterprise web and mobile applications. I specialize in React, Next.js, TypeScript, and Flutterflow, while also developing backend services with Node.js and Supabase. I enjoy creating clean, maintainable software that delivers real business value.</p>
            </div>
          </div>
          <div className="grid w-full grid-cols-2 text-center sm:grid-cols-4 lg:w-1/2 lg:justify-end">

            {/* YEARS OF EXPERIENCE */}

            <div className="flex flex-col items-center gap-2 border-l border-slate-200 px-4 py-4 sm:px-6 xl:px-12">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-500 text-3xl"/>
              <h1 className="text-3xl font-semibold mt-2 dark:text-slate-400">2+</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">Years<br></br>Experience</p>
            </div>

            {/* PROJECTS COMPLETED */}

            <div className="flex flex-col items-center gap-2 border-l border-slate-200 px-4 py-4 sm:px-6 xl:px-12">
              <FontAwesomeIcon icon={faBoxesPacking} className="text-blue-500 text-3xl"/>
              <h1 className="text-3xl font-semibold mt-2 dark:text-slate-400">5+</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">Projects<br></br>Completed</p>
            </div>

            {/* TECHNOLOGIES USED */}

            <div className="flex flex-col items-center gap-2 border-l border-slate-200 px-4 py-4 sm:px-6 xl:px-12">
              <FontAwesomeIcon icon={faCode} className="text-blue-500 text-3xl"/>
              <h1 className="text-3xl font-semibold mt-2 dark:text-slate-400">10+</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">Technologies<br></br>Used</p>
            </div>

            {/* USERS IMPACTED */}

            <div className="flex flex-col items-center gap-2 border-l border-slate-200 px-4 py-4 sm:px-6 xl:px-12">
              <FontAwesomeIcon icon={faUsers} className="text-blue-500 text-3xl"/>
              <h1 className="text-3xl font-semibold mt-2 dark:text-slate-400">1000+</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">Users<br></br>Impacted</p>
            </div>
            
          </div>
      </div>

      {/* PROJECTS SECTION */}

      <section id="projects" className="site-container flex flex-col items-center gap-2 pb-8 text-center">
        <h1 className="text-md tracking-wider text-blue-500 font-bold">PROJECTS</h1>
        <h1 className="text-3xl font-bold text-slate-950 dark:text-slate-400">Featured Projects</h1>
        <p className="text-md text-slate-600 dark:text-slate-400">A selection of applications I've built and contributed to.</p>
        {isProjectsLoading ? (
          <p className="py-6 text-sm text-slate-600 dark:text-slate-400">Loading projects...</p>
        ) : projectsError ? (
          <p className="py-6 text-sm text-red-500">{projectsError}</p>
        ) : readyProjects.length === 0 ? (
          <p className="py-6 text-sm text-slate-600 dark:text-slate-400">No ready projects available.</p>
        ) : (
          <ProjectsCarousel projects={readyProjects} />
        )}
      </section>

      {/* SKILLS SECTIONS */}

      <section id="skills" className="site-container flex flex-col items-center gap-2 pb-8 text-center">
        <h1 className="text-md tracking-wider text-blue-500 font-bold">SKILLS</h1>
        <h1 className="text-3xl font-bold text-slate-950 dark:text-slate-400">Skills & Technologies</h1>
        <p className="text-md text-slate-600 dark:text-slate-400">Technologies I use to build high-quality applications.</p>
        {isSkillsLoading ? (
          <p className="py-6 text-sm text-slate-600 dark:text-slate-400">Loading skills...</p>
        ) : skillsError ? (
          <p className="py-6 text-sm text-red-500">{skillsError}</p>
        ) : apiSkills.skills.length === 0 ? (
          <p className="py-6 text-sm text-slate-600 dark:text-slate-400">No skills available.</p>
        ) : (
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* FRONTEND */}

          {skillset.frontend.length > 0 && <div className="flex h-auto w-full flex-col gap-2 rounded-lg border border-slate-200 p-4 text-left shadow-lg dark:border-slate-600">
            <div className="flex gap-2 items-center">
              <FontAwesomeIcon icon={faDesktopAlt} className="text-4xl text-blue-500" />
              <h2 className="text-md font-semibold dark:text-slate-400">Frontend</h2>
            </div>
            <ul className="grid grid-cols-1 list-disc gap-x-3 gap-y-2 pl-4 md:grid-cols-2">
              {skillset.frontend.map((skill, index) => (
                <li key={index} className="min-w-0 break-words text-sm dark:text-slate-400">
                  {skill}
                </li>
              ))}
            </ul>
          </div>}

          {/* BACKEND */}

          {skillset.backend.length > 0 && <div className="flex h-auto w-full flex-col gap-2 rounded-lg border border-slate-200 p-4 text-left shadow-lg dark:border-slate-600">
            <div className="flex gap-2 items-center">
              <FontAwesomeIcon icon={faCodePullRequest} className="text-4xl text-green-500" />
              <h2 className="text-md font-semibold dark:text-slate-400">Backend</h2>
            </div>
            <ul className="grid grid-cols-1 list-disc gap-x-3 gap-y-2 pl-4 md:grid-cols-2">
              {skillset.backend.map((skill, index) => (
                <li key={index} className="min-w-0 break-words text-sm dark:text-slate-400">
                  {skill}
                </li>
              ))}
            </ul>
          </div>}

          {/* DATABASE */}

          {skillset.database.length > 0 && <div className="flex h-auto w-full flex-col gap-2 rounded-lg border border-slate-200 p-4 text-left shadow-lg dark:border-slate-600">
            <div className="flex gap-2 items-center">
              <FontAwesomeIcon icon={faDatabase} className="text-4xl text-violet-500" />
              <h2 className="text-md font-semibold dark:text-slate-400">Database</h2>
            </div>
            <ul className="grid grid-cols-1 list-disc gap-x-3 gap-y-2 pl-4 md:grid-cols-2">
              {skillset.database.map((skill, index) => (
                <li key={index} className="min-w-0 break-words text-sm dark:text-slate-400">
                  {skill}
                </li>
              ))}
            </ul>
          </div>}
          
          {/* TOOLS AND OTHERS */}
          
          {skillset.tools.length > 0 && <div className="flex h-auto w-full flex-col gap-2 rounded-lg border border-slate-200 p-4 text-left shadow-lg dark:border-slate-600">
            <div className="flex gap-2 items-center">
              <FontAwesomeIcon icon={faTools} className="text-4xl text-orange-300" />
              <h2 className="text-md font-semibold dark:text-slate-400">Tools & Others</h2>
            </div>
            <ul className="grid grid-cols-1 list-disc gap-x-3 gap-y-2 pl-4 md:grid-cols-2">
              {skillset.tools.map((skill, index) => (
                <li key={index} className="min-w-0 break-words text-sm dark:text-slate-400">
                  {skill}
                </li>
              ))}
            </ul>
          </div>}
        </div>
        )}
      </section>

      {/* CONTACT SECTION */}

      <section id="contact" className="site-container flex flex-col items-center gap-2 pb-8 text-center">
        <h1 className="text-md tracking-wider text-blue-500 font-bold">CONTACT</h1>
        <h1 className="text-3xl font-bold text-slate-950 dark:text-slate-400">Let's Work Together</h1>
        <p className="text-md text-slate-600 dark:text-slate-400">I'm always open to discussing new opportunities and interesting projects.</p>     
        <div className="flex w-full flex-col gap-8 dark:text-slate-400 lg:flex-row lg:items-center lg:gap-0 lg:pl-6">

          {/* INFO */}

          <div className="flex w-full flex-col gap-4 text-left lg:w-1/4">
            <div className="flex min-w-0 items-center gap-4 sm:gap-6">
              <FontAwesomeIcon icon={faEnvelope} className="text-2xl text-blue-500"/>
              <p className="min-w-0 break-all text-sm">vincentxpatrick@gmail.com</p>
            </div>
            <div className="flex min-w-0 items-center gap-4 sm:gap-6">
              <FontAwesomeIcon icon={faPhone} className="text-2xl text-blue-500"/>
              <p className="text-sm">0967-296-0756</p>
            </div>
            <div className="flex min-w-0 items-center gap-4 sm:gap-6">
              <FontAwesomeIcon icon={faMapLocation} className="text-2xl text-blue-500"/>
              <p className="text-sm">Quezon City, Philippines</p>
            </div>
            <div className="flex min-w-0 items-center gap-4 sm:gap-6">
              <Image src="/assets/GitHub.png" alt="GitHub" width={30} height={30} className="dark:invert"/>
              <p className="min-w-0 break-all text-sm">github.com/vixtroo</p>
            </div>
            <div className="flex min-w-0 items-center gap-4 sm:gap-6">
              <Image src="/assets/LinkedIn.png" alt="GitHub" width={30} height={30}/>
              <p className="min-w-0 break-all text-sm">linkedin.com/in/vpmcastro</p>
            </div>
          </div>
          
          {/* CONTACT FORM */}

          <div className="flex w-full rounded-lg border border-slate-200 p-4 shadow-lg dark:border-slate-600 sm:p-6 lg:w-1/2">
            <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3 text-left">
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
                <div className="flex w-full flex-col gap-1 text-sm sm:w-1/2">
                  <label htmlFor="name" className="font-semibold">Name</label>
                  <input id="name" type="text" placeholder="Your name" className="border border-slate-200 px-3 py-2 rounded-lg outline-none dark:border-slate-600 placeholder:text-slate-500 dark:placeholder:text-slate-600 w-full" required onChange={handleChange} value={formData.name}/>
                </div>
                <div className="flex w-full flex-col gap-1 text-sm sm:w-1/2">
                  <label htmlFor="email" className="font-semibold">Email</label>
                  <input id="email" type="text" placeholder="your.email@example.com" className="border border-slate-200 px-3 py-2 rounded-lg outline-none dark:border-slate-600 placeholder:text-slate-500 dark:placeholder:text-slate-600 w-full" required onChange={handleChange} value={formData.email}/>
                </div>
              </div>
              <div className="flex flex-col text-sm gap-1">
                <label htmlFor="message" className="font-semibold">Message</label>
                <textarea id="message" className="border border-slate-200 px-3 py-2 rounded-lg outline-none dark:border-slate-600 placeholder:text-slate-500 dark:placeholder:text-slate-600" placeholder="Tell me about your project/company" required value={formData.message} onChange={handleChange}></textarea>
              </div>
              <Button type="submit" variant="default" size="default" className="w-full bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600">Send Message <FontAwesomeIcon icon={faPaperPlane}/></Button>
            </form>
          </div>
          <div className="mx-auto flex w-full max-w-[220px] items-start justify-center animate-revolve lg:max-w-none lg:w-1/4">
            <Image src="/assets/display_2.png" alt="" height={300} width={300} className="h-auto w-full" />
          </div>
        </div>
      </section>

      {/* DARK MODE TOGGLE */}

      <ThemeToggle onThemeChange={setTheme} />

      {/* LOGIN MODAL */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSubmit={handleLogin}
      />

      <footer className="w-full border-t border-slate-200 bg-white text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
        <div className="site-container flex flex-col items-center justify-between gap-4 py-4 text-center sm:flex-row sm:text-left">
          <p>&copy; {new Date().getFullYear()} Vincent Castro. All rights reserved.</p>
          <div className="flex items-center gap-4 sm:gap-6">
            <a className="flex h-10 w-10 items-center justify-center" href="https://github.com/vixtroo" target="_blank" rel="noopener noreferrer">
              <Image src="/assets/GitHub.png" alt="GitHub" width={30} height={30} className="dark:invert"/>
            </a>
            <a className="flex h-10 w-10 items-center justify-center" href="https://www.linkedin.com/in/vpmcastro" target="_blank" rel="noopener noreferrer">
              <Image src="/assets/LinkedIn.png" alt="LinkedIn" width={30} height={30}/>
            </a>
            <a href="#" aria-label="Back to top" className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-md dark:border-slate-700">
              <FontAwesomeIcon icon={faArrowUp}/>
            </a>
          </div>
        </div>
      </footer>
      </main>
    </>
  );
}
