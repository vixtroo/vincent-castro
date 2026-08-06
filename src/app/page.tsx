import {faKey} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-slate-50 text-slate-100">
      <div className="p-5">
        <div className="flex fixed top-0 h-[72px] justify-between items-center w-full bg-white rounded-lg px-6 shadow-lg mt-5">
          <div>
            <h1 className="text-4xl font-bold text-slate-950">V<span className="text-blue-500">C.</span></h1>
          </div>
          <div className="flex text-slate-950">
            <ul className="flex gap-16">
              <li><a href="#about">About</a></li>
              <li><a href="#projects">Projects</a></li>
              <li><a href="#skills">Skills</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <Button variant="default" size="default" className="bg-blue-500 text-white hover:bg-blue-600"><FontAwesomeIcon icon={faKey}/>Login</Button>
        </div>
      </div>
      <div className="h-[500px]">1</div>
      <div className="h-[500px]">1</div>
      <div className="h-[500px]">1</div>
      <footer className="bg-white text-slate-950 p-6 shadow-lg inset-x-0 bottom-0">
        <p>&copy; {new Date().getFullYear()} Vincent Castro. All rights reserved.</p>
      </footer>
    </main>
  );
}
