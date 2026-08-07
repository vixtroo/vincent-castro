import {faKey, faArrowRight, faCloudDownload, faBarsStaggered, faCircleCheck} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {

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

  return (
    <main className="flex min-h-screen flex-col bg-white text-slate-100">
      <div className="flex flex-col items-center">
        <div className="flex fixed top-0 h-[72px] justify-between items-center w-[97%] bg-white rounded-lg px-6 shadow-lg mt-6 z-1000">
          <div>
            <h1 className="text-5xl font-bold text-slate-950 ms-2">V<span className="text-blue-500">C.</span></h1>
          </div>
          <div className="flex text-slate-950">
            <ul className="flex gap-16 font-semibold">
              <li><a href="#about">About</a></li>
              <li><a href="#projects">Projects</a></li>
              <li><a href="#skills">Skills</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <Button variant="default" size="default" className="bg-blue-500 text-white hover:bg-blue-600"><FontAwesomeIcon icon={faKey}/>Login</Button>
        </div>
      </div>
      <section id="about" className="flex flex-col justify-center px-16 pt-38 gap-6 bg-slate-50">
        <div className="hero flex gap-12">
          <div className="flex flex-col gap-4 max-w-xl z-10">
            <div className="px-3 py-2 bg-blue-50 rounded-3xl w-32">
              <h1 className="text-md font-bold text-blue-500">👋 Hello, I'm</h1>
            </div>
            <h1 className="text-7xl font-bold text-slate-950">Vincent <span className="text-blue-500">Castro</span></h1>
            <h1 className="text-3xl font-semibold text-slate-950">Frontend Developer building scalable web and mobile applications with modern technologies.</h1>
            <p className="text-md text-slate-600">I build responsive, production-ready web and mobile applications focused on performance, clean architecture, and exceptional user experience. With experience developing enterprise systems and cross-platform applications, I enjoy transforming complex business requirements into intuitive digital products.</p>
            <div className="flex gap-6 mt-4">
              <Button variant="default" size="default" className="bg-blue-500 text-white hover:bg-blue-600">View My Projects <FontAwesomeIcon icon={faArrowRight}/></Button>
              <Button variant="outline" size="default" className="border-slate-200 text-slate-950">Download Resume <FontAwesomeIcon icon={faCloudDownload}/></Button>
            </div>
          </div>
          <div className="flex flex-col gap-4 z-10 bg-white w-[224px] shadow-lg p-4 rounded-lg mt-16 h-fit">
            <h1 className="text-md font-semibold text-blue-500">Currently Building</h1>
            <div className="flex gap-2 text-lg items-center">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FontAwesomeIcon icon={faBarsStaggered} className="text-blue-500 h-4"/>
              </div>
              <h1 className="font-bold text-slate-950">{currentlyBuilding.title}</h1>
            </div>
            <ul className="flex flex-col gap-4">
              {currentlyBuilding.descriptions.map((description, index) => (
                <li key={index} className="flex gap-2 text-sm text-slate-950"><FontAwesomeIcon icon={faCircleCheck} className="text-blue-500 h-4 mt-1"/>{description}</li>
              ))}
            </ul>
            <div className="flex bg-slate-100 px-3 py-2 rounded-2xl text-xs text-slate-950 w-fit mb-1">{currentlyBuilding.stack}</div>
          </div>
          <div className="absolute right-0">
            <Image src="/assets/laptop_display.png" alt="Vincent Castro" width={800} height={500}/>
          </div>
        </div>
        <div className="flex max-w-3xl gap-4 flex-wrap mt-4 mb-6" id="skills">
          {skills.map((skill, index) =>(
            <div key={index} className="flex w-fit rounded-lg bg-white border border-slate-200 gap-2 p-3 shadow-sm">
              <Image src={skill.icon} alt={skill.name} width={20} height={20}/>
              <p className="text-sm text-slate-950">{skill.name}</p>
            </div>
          ))}
        </div>
      </section>
      <footer className="bg-white text-slate-500 px-16 py-4 inset-x-0 bottom-0 text-sm border-t border-slate-200">
        <p>&copy; {new Date().getFullYear()} Vincent Castro. All rights reserved.</p>
      </footer>
    </main>
  );
}
