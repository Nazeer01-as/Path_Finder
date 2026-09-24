import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ExternalLink, ShieldCheck, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Path<span className="text-cyan-400">Finder</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              Explore Your Education, Exams, Skills & Career Opportunities. Helping students from Class 10 to Higher Education discover clear, verified pathways for their future.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs text-emerald-400 bg-slate-800/60 p-3 rounded-xl border border-slate-700/50 max-w-sm">
              <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-400" />
              <span>
                100% verified links to official government and conducting body websites.
              </span>
            </div>
          </div>

          {/* Pathways */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Education Stages
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/opportunities?educationLevel=Class 10" className="hover:text-white transition-colors">
                  After Class 10
                </Link>
              </li>
              <li>
                <Link to="/opportunities?educationLevel=Intermediate / 11th–12th" className="hover:text-white transition-colors">
                  Intermediate / 11th–12th
                </Link>
              </li>
              <li>
                <Link to="/opportunities?educationLevel=Diploma / Polytechnic" className="hover:text-white transition-colors">
                  Diploma & Polytechnic
                </Link>
              </li>
              <li>
                <Link to="/opportunities?educationLevel=ITI" className="hover:text-white transition-colors">
                  ITI & Vocational Trades
                </Link>
              </li>
              <li>
                <Link to="/opportunities?educationLevel=Undergraduate" className="hover:text-white transition-colors">
                  Undergraduate & Degree
                </Link>
              </li>
              <li>
                <Link to="/opportunities?educationLevel=Engineering" className="hover:text-white transition-colors">
                  Engineering & Tech
                </Link>
              </li>
            </ul>
          </div>

          {/* Discovery Portals */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Discovery
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/opportunities" className="hover:text-white transition-colors">
                  Opportunity Explorer
                </Link>
              </li>
              <li>
                <Link to="/exams" className="hover:text-white transition-colors">
                  Entrance Examinations
                </Link>
              </li>
              <li>
                <Link to="/scholarships" className="hover:text-white transition-colors">
                  Scholarships & Grants
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-white transition-colors">
                  Degree & Skill Courses
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-white transition-colors">
                  Career Pathways & Flow
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Quick Help */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              PathFinder
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About the Platform
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Student Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  Create Student Profile
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Personalized Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Note */}
        <div className="pt-8 border-t border-slate-800 text-xs text-slate-500 leading-relaxed flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="max-w-2xl text-center md:text-left">
            <strong className="text-slate-400">Important Disclaimer: </strong>
            PathFinder provides educational pathways and structured discovery. We do not invent official exam dates, fees, or eligibility criteria. Students are advised to verify details with official conducting bodies before applying.
          </p>
          <p className="text-center md:text-right shrink-0">
            © {new Date().getFullYear()} PathFinder Platform. Built for Student Success.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
