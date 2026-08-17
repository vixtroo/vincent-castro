"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import {faKey, faArrowRight, faCloudDownload, faBarsStaggered, 
        faCircleCheck, faCalendarAlt, faBoxesPacking, faCode, 
        faUsers, faArrowUp, faDesktopAlt, faCodePullRequest, 
        faDatabase, faTools, faEnvelope, faPhone, faMapLocation,
        faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import ThemeToggle from "@/components/ui/toggle_button";
import scrollToSection from "@/lib/utils";

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setTheme("dark");
    }
  }, []);

  const currentlyBuilding = {
    "title": "CEO Dashboard",
    "descriptions": ["Company Project Showcase", "Secure Authenticcation", "Project CRUD Management", "Modern & Responsive Interface"],
    "stack": "PHP • CodeIgniter"
  }

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
    "frontend": [
      "React.js",
      "Next.js",
      "TypeScript",
      "FlutterFlow",
      "Tailwind CSS",
      "HTML5",
      "CSS3"
    ],
    "backend": [
      "Node.js",
      "Express.js",
      "REST API",
      "PHP",
      "CodeIgniter"
    ],
      "database": [
      "PostgreSQL",
      "Supabase",
      "MySQL",
      "SQL Server",
      "Firebase"
    ],
    "tools": [
      "Git",
      "GitHub",
      "Vercel",
      "ChatGPT",
      "Claude",
      "GitHub Copilot"
    ]
  }

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
    <main className="flex min-h-screen flex-col bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-100 items-center">
      <div className="flex flex-col items-center">

        {/* NAVBAR */}
        
        <div className="flex fixed top-0 h-[72px] justify-between items-center w-[97%] bg-white/40 backdrop-blur-xl rounded-lg px-6 shadow-lg mt-6 z-1000 dark:bg-slate-900/40">
          <a href="#">
            <div>
              <h1 className="text-5xl text-slate-950 dark:text-slate-100 font-bold ms-2">V<span className="text-blue-500">C.</span></h1>
            </div>
          </a>
          <div className="flex">
            <ul className="flex gap-4 font-semibold">
              <li><a href="#about" className="px-6 py-3 hover:bg-blue-500 hover:text-white hover:dark:bg-blue-600 rounded-lg">About</a></li>
              <li><a href="#projects" className="px-6 py-3 hover:bg-blue-500 hover:text-white hover:dark:bg-blue-600 rounded-lg">Projects</a></li>
              <li><a href="#skills" className="px-6 py-3 hover:bg-blue-500 hover:text-white hover:dark:bg-blue-600 rounded-lg">Skills</a></li>
              <li><a href="#contact" className="px-6 py-3 hover:bg-blue-500 hover:text-white hover:dark:bg-blue-600 rounded-lg">Contact</a></li>
            </ul>
          </div>
          <Button variant="default" size="default" className="bg-blue-500 text-white dark:bg-blue-600 hover:bg-blue-600"><FontAwesomeIcon icon={faKey}/>Login</Button>
        </div>
      </div>

      {/* ABOUT SECTION*/}

      <section id="about" className="flex flex-col justify-center px-16 pt-38 gap-6 bg-slate-50 dark:bg-slate-900 w-full">
        <div className="hero flex gap-12">
          <div className="flex flex-col gap-4 max-w-xl z-10">
            <div className="px-3 py-2 bg-blue-50 rounded-3xl w-32 dark:bg-blue-900 dark:text-blue-300">
              <h1 className="text-md font-bold text-blue-500">👋 Hello, I'm</h1>
            </div>
            <h1 className="text-7xl font-bold">Vincent <span className="text-blue-500 dark:text-blue-600">Castro</span></h1>
            <h1 className="text-3xl font-semibold dark:text-slate-400">Frontend Developer building scalable web and mobile applications with modern technologies.</h1>
            <p className="text-md text-slate-600 dark:text-slate-400">I build responsive, production-ready web and mobile applications focused on performance, clean architecture, and exceptional user experience. With experience developing enterprise systems and cross-platform applications, I enjoy transforming complex business requirements into intuitive digital products.</p>
            <div className="flex gap-6 mt-4">
              <Button variant="default" size="default" className="bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600" onClick={() => {scrollToSection('projects')}}>View My Projects <FontAwesomeIcon icon={faArrowRight}/></Button>
              <Button variant="outline" size="default" className="border-slate-200 dark:bg-slate-800 dark:border-slate-600">Download Resume <FontAwesomeIcon icon={faCloudDownload}/></Button>
            </div>
          </div>
          <div className="flex flex-col gap-4 z-10 bg-white w-[224px] shadow-lg p-4 rounded-lg mt-16 h-fit dark:bg-slate-800">
            <h1 className="text-md font-semibold text-blue-500">Currently Building</h1>
            <div className="flex gap-2 text-lg items-center">
              <div className="p-2 bg-blue-50 rounded-lg dark:bg-blue-900">
                <FontAwesomeIcon icon={faBarsStaggered} className="text-blue-500 h-4 dark:text-blue-300"/>
              </div>
              <h1 className="font-bold">{currentlyBuilding.title}</h1>
            </div>
            <ul className="flex flex-col gap-4">
              {currentlyBuilding.descriptions.map((description, index) => (
                <li key={index} className="flex gap-2 text-sm"><FontAwesomeIcon icon={faCircleCheck} className="text-blue-500 h-4 mt-1"/>{description}</li>
              ))}
            </ul>
            <div className="flex bg-slate-100 px-3 py-2 rounded-2xl text-xs w-fit mb-1 dark:bg-slate-600">{currentlyBuilding.stack}</div>
          </div>
          <div className="absolute right-0 animate-float">
            <Image src="/assets/laptop_display.png" alt="Image" width={800} height={500}/>
          </div>
        </div>
        <div className="flex max-w-3xl gap-4 flex-wrap mt-4 mb-6">
          {skills.map((skill, index) =>(
            <div key={index} className="flex w-fit rounded-lg bg-white border border-slate-200 gap-2 p-3 shadow-sm dark:bg-slate-800 dark:border-slate-600">
              <Image src={skill.icon} alt={skill.name} width={20} height={20} className="rounded-sm"/>
              <p className="text-sm">{skill.name}</p>
            </div>
          ))}
        </div>
      </section>
      <div className="flex items-start px-16 py-8">
          <div className="flex gap-6 w-1/2">
            <div className="flex-shrink-0">
              <Image src={theme === "dark" ? "/assets/teng_dark.png" : "/assets/teng_light.JPG"} alt="Vincent Castro" width={100} height={120} className="rounded-lg shadow-lg"/>
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-md text-blue-500 font-semibold">ABOUT ME</h1>
              <p className="text-sm text-sm max-w-lg dark:text-slate-400">I am a Frontend Developer with more than 2 years of professional experience building enterprise web and mobile applications. I specialize in React, Next.js, TypeScript, and Flutterflow, while also developing backend services with Node.js and Supabase. I enjoy creating clean, maintainable software that delivers real business value.</p>
            </div>
          </div>
          <div className="flex text-center space-between w-1/2">

            {/* YEARS OF EXPERIENCE */}

            <div className="flex flex-col items-center gap-2 px-12 py-4 border-l border-slate-200">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-500 text-3xl"/>
              <h1 className="text-3xl font-semibold mt-2 dark:text-slate-400">2+</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">Years<br></br>Experience</p>
            </div>

            {/* PROJECTS COMPLETED */}

            <div className="flex flex-col items-center gap-2 px-12 py-4 border-l border-slate-200">
              <FontAwesomeIcon icon={faBoxesPacking} className="text-blue-500 text-3xl"/>
              <h1 className="text-3xl font-semibold mt-2 dark:text-slate-400">5+</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">Projects<br></br>Completed</p>
            </div>

            {/* TECHNOLOGIES USED */}

            <div className="flex flex-col items-center gap-2 px-12 py-4 border-l border-slate-200">
              <FontAwesomeIcon icon={faCode} className="text-blue-500 text-3xl"/>
              <h1 className="text-3xl font-semibold mt-2 dark:text-slate-400">10+</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">Technologies<br></br>Used</p>
            </div>

            {/* USERS IMPACTED */}

            <div className="flex flex-col items-center gap-2 px-12 py-4 border-l border-slate-200">
              <FontAwesomeIcon icon={faUsers} className="text-blue-500 text-3xl"/>
              <h1 className="text-3xl font-semibold mt-2 dark:text-slate-400">100+</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">Users<br></br>Impacted</p>
            </div>
            
          </div>
      </div>

      {/* PROJECTS SECTION */}

      <section id="projects" className="flex flex-col items-center gap-2 px-16 w-full h-[500px]">
        <h1 className="text-md tracking-wider text-blue-500 font-bold">PROJECTS</h1>
        <h1 className="text-3xl font-bold text-slate-950 dark:text-slate-400">Featured Projects</h1>
        <p className="text-md text-slate-600 dark:text-slate-400">A selection of applications I've built and contributed to.</p>
      </section>

      {/* SKILLS SECTIONS */}

      <section id="skills" className="flex flex-col items-center gap-2 w-full px-16 pb-8">
        <h1 className="text-md tracking-wider text-blue-500 font-bold">SKILLS</h1>
        <h1 className="text-3xl font-bold text-slate-950 dark:text-slate-400">Skills & Technologies</h1>
        <p className="text-md text-slate-600 dark:text-slate-400">Technologies I use to build high-quality applications.</p>
        <div className="flex gap-4 w-full">

          {/* FRONTEND */}

          <div className="flex flex-col gap-2 border border-slate-200 rounded-lg h-fit p-4 dark:border-slate-600 w-1/4 shadow-lg">
            <div className="flex gap-2 items-center">
              <FontAwesomeIcon icon={faDesktopAlt} className="text-4xl text-blue-500" />
              <h2 className="text-md font-semibold dark:text-slate-400">Frontend</h2>
            </div>
            <ul className="flex flex-col gap-2 list-disc pl-4 flex-wrap h-24">
              {skillset.frontend.map((skill, index) => (
                <li key={index} className="text-sm dark:text-slate-400">
                  {skill}
                </li>
              ))}
            </ul>
          </div>

          {/* BACKEND */}

          <div className="flex flex-col gap-2 border border-slate-200 rounded-lg h-fit p-4 dark:border-slate-600 w-1/4 shadow-lg">
            <div className="flex gap-2 items-center">
              <FontAwesomeIcon icon={faCodePullRequest} className="text-4xl text-green-500" />
              <h2 className="text-md font-semibold dark:text-slate-400">Backend</h2>
            </div>
            <ul className="flex flex-col gap-2 list-disc pl-4 flex-wrap h-24">
              {skillset.backend.map((skill, index) => (
                <li key={index} className="text-sm dark:text-slate-400">
                  {skill}
                </li>
              ))}
            </ul>
          </div>

          {/* DATABASE */}

          <div className="flex flex-col gap-2 border border-slate-200 rounded-lg h-fit p-4 dark:border-slate-600 w-1/4 shadow-lg">
            <div className="flex gap-2 items-center">
              <FontAwesomeIcon icon={faDatabase} className="text-4xl text-violet-500" />
              <h2 className="text-md font-semibold dark:text-slate-400">Database</h2>
            </div>
            <ul className="flex flex-col gap-2 list-disc pl-4 flex-wrap h-24">
              {skillset.database.map((skill, index) => (
                <li key={index} className="text-sm dark:text-slate-400">
                  {skill}
                </li>
              ))}
            </ul>
          </div>
          
          {/* TOOLS AND OTHERS */}
          
          <div className="flex flex-col gap-2 border border-slate-200 rounded-lg h-fit p-4 dark:border-slate-600 w-1/4 shadow-lg">
            <div className="flex gap-2 items-center">
              <FontAwesomeIcon icon={faTools} className="text-4xl text-orange-300" />
              <h2 className="text-md font-semibold dark:text-slate-400">Tools & Others</h2>
            </div>
            <ul className="flex flex-col gap-2 list-disc pl-4 flex-wrap h-24">
              {skillset.tools.map((skill, index) => (
                <li key={index} className="text-sm dark:text-slate-400">
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}

      <section id="contact" className="flex flex-col items-center gap-2 w-full px-16 pb-8">
        <h1 className="text-md tracking-wider text-blue-500 font-bold">CONTACT</h1>
        <h1 className="text-3xl font-bold text-slate-950 dark:text-slate-400">Let's Work Together</h1>
        <p className="text-md text-slate-600 dark:text-slate-400">I'm always open to discussing new opportunities and interesting projects.</p>     
        <div className="flex w-full pl-6 dark:text-slate-400">

          {/* INFO */}

          <div className="flex flex-col gap-4 w-1/4">
            <div className="flex gap-2 items-center">
              <FontAwesomeIcon icon={faEnvelope} className="text-xl text-blue-500"/>
              <p className="text-sm">vincentxpatrick@gmail.com</p>
            </div>
            <div className="flex gap-2 items-center">
              <FontAwesomeIcon icon={faPhone} className="text-xl text-blue-500"/>
              <p className="text-sm">0967-296-0756</p>
            </div>
            <div className="flex gap-2 items-center">
              <FontAwesomeIcon icon={faMapLocation} className="text-xl text-blue-500"/>
              <p className="text-sm">Quezon City, Philippines</p>
            </div>
            <div className="flex gap-2 items-center">
              <Image src="/assets/GitHub.png" alt="GitHub" width={24} height={24} className="dark:invert"/>
              <p className="text-sm">github.com/vixtroo</p>
            </div>
            <div className="flex gap-2 items-center">
              <Image src="/assets/LinkedIn.png" alt="GitHub" width={24} height={24}/>
              <p className="text-sm">linkedin.com/in/vpmcastro</p>
            </div>
          </div>
          
          {/* CONTACT FORM */}

          <div className="flex w-1/2 border border-slate-200 rounded-lg dark:border-slate-600 p-6 shadow-lg">
            <form onSubmit={handleSubmit} className="flex flex-col w-full gap-3">
              <div className="flex gap-6">
                <div className="flex flex-col gap-1 text-sm w-1/2">
                  <label htmlFor="name" className="font-semibold">Name</label>
                  <input id="name" type="text" placeholder="Your name" className="border border-slate-200 px-3 py-2 rounded-lg outline-none dark:border-slate-600 placeholder:text-slate-500 dark:placeholder:text-slate-600 w-full" required onChange={handleChange} value={formData.name}/>
                </div>
                <div className="flex flex-col gap-1 text-sm w-1/2">
                  <label htmlFor="email" className="font-semibold">Email</label>
                  <input id="email" type="text" placeholder="your.email@example.com" className="border border-slate-200 px-3 py-2 rounded-lg outline-none dark:border-slate-600 placeholder:text-slate-500 dark:placeholder:text-slate-600 w-full" required onChange={handleChange} value={formData.email}/>
                </div>
              </div>
              <div className="flex flex-col text-sm gap-1">
                <label htmlFor="message" className="font-semibold">Message</label>
                <textarea id="message" className="border border-slate-200 px-3 py-2 rounded-lg outline-none dark:border-slate-600 placeholder:text-slate-500 dark:placeholder:text-slate-600" placeholder="Tell me about your project/company" required value={formData.message} onChange={handleChange}></textarea>
              </div>
              <Button type="submit" variant="default" size="default" className="bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600">Send Message <FontAwesomeIcon icon={faPaperPlane}/></Button>
            </form>
          </div>
          <div className="flex w-1/4 items-start justify-center animate-revolve">
            <Image src="/assets/display_2.png" alt="Image" height={250} width={250} />
          </div>
        </div>
      </section>

      {/* DARK MODE TOGGLE */}

      <ThemeToggle theme={theme} onThemeChange={setTheme} />

      <footer className="flex justify-between items-center bg-white text-slate-500 px-16 py-4 inset-x-0 bottom-0 text-sm border-t border-slate-200 dark:text-slate-400 dark:bg-slate-900 dark:border-slate-700 w-full">
        <p>&copy; {new Date().getFullYear()} Vincent Castro. All rights reserved.</p>
        <div className="flex gap-6 items-center">
          <a href="https://github.com/vixtroo" target="_blank" rel="noopener noreferrer">
            <Image src="/assets/GitHub.png" alt="GitHub" width={30} height={30} className="dark:invert"/>
          </a>
          <a href="https://www.linkedin.com/in/vpmcastro" target="_blank" rel="noopener noreferrer">
            <Image src="/assets/LinkedIn.png" alt="LinkedIn" width={30} height={30}/>
          </a>
          <a href="#" className="flex items-center border border-slate-200 text-md px-2 py-[10px] rounded-full dark:border-slate-700">
            <FontAwesomeIcon icon={faArrowUp}/>
          </a>
        </div>
      </footer>
    </main>
  );
}
