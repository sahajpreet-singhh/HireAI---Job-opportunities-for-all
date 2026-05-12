/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Briefcase, 
  Building2, 
  Users, 
  Sparkles, 
  ArrowRight, 
  MapPin, 
  Clock, 
  DollarSign,
  ChevronRight,
  Menu,
  X,
  Globe,
  TrendingUp,
  Award,
  BarChart3,
  CheckCircle2,
  Zap,
  LogOut,
  Mail,
  Lock
} from 'lucide-react';
import { Job, Company, UserProfile, Application } from './types';
import { JOBS, COMPANIES, SUCCESS_METRICS, TALENT_HIGHLIGHTS } from './constants';
import { auth } from './lib/firebase';
import { 
  createUserProfile, 
  getUserProfile, 
  getJobs, 
  getEmployerJobs, 
  applyForJob, 
  getSeekerApplications, 
  getEmployerApplications,
  createJob
} from './lib/firestore';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  User
} from 'firebase/auth';

// --- Components ---

const Navbar = ({ activeView, setView, user, profile }: { activeView: string, setView: (v: string) => void, user: User | null, profile: UserProfile | null }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setView('home');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { label: 'Explore', view: 'home' },
    { label: 'Find Jobs', view: 'jobs' },
    { label: 'Companies', view: 'companies' },
    { label: 'About', view: 'about' }
  ];

  if (profile) {
    navItems.push({ label: 'Dashboard', view: 'dashboard' });
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => setView('home')}
        >
          <div className="w-10 h-10 bg-secondary-accent rounded-xl flex items-center justify-center text-white">
            <Sparkles size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tight text-accent">
            Hire<span className="text-secondary-accent">AI</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => { setView(item.view); setIsOpen(false); }}
              className={`text-sm font-medium transition-colors ${
                activeView === item.view ? 'text-accent' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {item.label}
            </button>
          ))}
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-pastel-blue rounded-full">
                <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-[10px] text-white font-bold">
                  {profile?.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col -space-y-1">
                  <span className="text-xs font-bold text-accent truncate max-w-[100px]">{profile?.name || 'User'}</span>
                  <span className="text-[9px] text-accent/60 uppercase font-black tracking-widest">{profile?.role || 'Setting up...'}</span>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-accent transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setView('login')}
              className="button-primary text-sm py-2.5"
            >
              Join Portal
            </button>
          )}
        </div>

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white border-b border-gray-100 px-6 py-8 flex flex-col gap-6"
          >
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => { setView(item.view); setIsOpen(false); }}
                className={`text-lg font-medium text-left ${
                  activeView === item.view ? 'text-accent' : 'text-gray-500'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button 
              onClick={() => { setView('join'); setIsOpen(false); }}
              className="button-primary w-full"
            >
              Join Portal
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ onSearch, search, onSearchChange }: { onSearch: () => void, search: string, onSearchChange: (v: string) => void }) => {
  return (
    <section className="pt-40 pb-20 px-6 overflow-hidden relative bg-gradient-to-b from-pastel-blue to-transparent">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 border border-secondary-accent/30 text-xs font-semibold text-accent mb-6 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-secondary-accent animate-pulse"></span>
            AI Matching System Online
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.1] mb-8 text-[#1A302D]">
            Find your next career milestone <br/><span className="text-secondary-accent">powered by HireAI</span>
          </h1>
          <p className="text-lg text-gray-600 mb-10 max-w-xl leading-relaxed">
            Discover opportunities that align with your talent and values. Our AI-driven platform connects forward-thinking individuals with innovative companies.
          </p>
          
          <div className="flex bg-white p-2 rounded-2xl shadow-xl shadow-secondary-accent/10 border border-gray-100 max-w-2xl">
            <div className="flex-1 flex items-center px-4 border-r border-gray-100">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <input 
                type="text" 
                placeholder="Job title or skill" 
                className="w-full outline-none text-sm bg-transparent"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSearch()}
              />
            </div>
            <button 
              onClick={onSearch}
              className="px-8 py-4 bg-accent text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
            >
              Find Jobs
            </button>
          </div>

          <div className="mt-12 flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <img 
                  key={i}
                  src={`https://i.pravatar.cc/150?u=${i}`} 
                  className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                  alt="Avatar"
                />
              ))}
            </div>
            <div className="text-sm">
              <span className="font-bold text-accent">Join 50k+</span> members in the talent network
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative"
        >
          <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl shadow-accent/10 border-8 border-white">
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80" 
              alt="Team productivity"
              className="w-full aspect-[4/3] object-cover"
            />
          </div>
          
          {/* Floating Stats Card */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -right-6 z-20 glass p-6 rounded-2xl max-w-[200px]"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-pastel-green flex items-center justify-center text-green-600">
                <CheckCircle2 size={24} />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Match Rate</div>
            </div>
            <div className="text-3xl font-bold text-gray-900">98.4%</div>
            <div className="text-[10px] text-green-500 font-medium mt-1">AI Verified accuracy</div>
          </motion.div>

          {/* Floating Role Card */}
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -bottom-6 -left-6 z-20 glass p-6 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-pastel-purple flex items-center justify-center text-accent">
              <Briefcase size={24} />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900">Senior UX Designer</div>
              <div className="text-xs text-gray-500">Lumina Design • New York</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const StatsSection = () => {
  return (
    <section className="py-24 px-6 bg-white border-y border-gray-50">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-8">
        {SUCCESS_METRICS.map((stat, idx) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="flex-1 min-w-[200px] p-8 bg-soft-bg rounded-2xl text-center border border-gray-100"
          >
            <h3 className="text-4xl font-black text-secondary-accent mb-2">
              {stat.value}{stat.suffix}
            </h3>
            <div className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const JobCard: React.FC<{ job: Job, company: Company, onClick: () => void }> = ({ job, company, onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="glass p-8 rounded-3xl cursor-pointer transition-all hover:bg-white hover:shadow-xl hover:shadow-accent/5 group"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <img 
            src={job.companyLogo || company?.logo} 
            alt={job.companyName || company?.name} 
            className="w-14 h-14 rounded-2xl object-cover shadow-sm"
          />
          <div>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-accent transition-colors">{job.title}</h3>
            <p className="text-gray-500 font-medium">{job.companyName || company?.name}</p>
          </div>
        </div>
        <div className="px-3 py-1 bg-[#F0FDF4] text-[#166534] text-[10px] font-bold rounded-full border border-[#DCFCE7] flex items-center gap-1">
          <TrendingUp size={14} />
          {job.aiMatchScore}% Match
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-1.5 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-xl">
          <MapPin size={16} /> {job.location}
        </div>
        <div className="flex items-center gap-1.5 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-xl">
          <Clock size={16} /> {job.postedAt}
        </div>
        <div className="flex items-center gap-1.5 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-xl">
          <DollarSign size={16} /> {job.salary}
        </div>
      </div>

      <p className="text-gray-600 mb-8 line-clamp-2 leading-relaxed">
        {job.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="px-4 py-1.5 bg-gray-50 text-gray-500 text-[11px] font-bold rounded">
          {job.category}
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          className="px-6 py-2 bg-pastel-blue text-accent font-bold rounded-lg text-sm hover:opacity-80 transition-opacity"
        >
          Apply Now
        </button>
      </div>
    </motion.div>
  );
};

const JobBrowser = ({ onJobSelect, search, setSearch }: { onJobSelect: (j: Job) => void, search: string, setSearch: (s: string) => void }) => {
  const [filter, setFilter] = useState('All');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const firestoreJobs = await getJobs();
        setJobs(firestoreJobs || []);
      } catch (err) {
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const categories = ['All', 'Engineering', 'Design', 'Consulting', 'Marketing'];

  const filteredJobs = useMemo(() => {
    const allJobs = [...JOBS, ...jobs];
    return allJobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) || 
                            job.companyName?.toLowerCase().includes(search.toLowerCase()) ||
                            COMPANIES.find(c => c.id === job.companyId)?.name.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'All' || job.category === filter;
      return matchesSearch && matchesFilter;
    });
  }, [search, filter, jobs]);

  if (loading) return (
    <div className="min-h-screen pt-40 text-center">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full mx-auto" />
    </div>
  );

  return (
    <section className="py-24 px-6 bg-soft-bg min-h-screen pt-32">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <h2 className="text-5xl font-bold mb-6">Explore the Future</h2>
          <p className="text-gray-500 text-lg">Browse curated roles from the world's most progressive tech stacks and creative hubs.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-12 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
            <input 
              type="text" 
              placeholder="Search by role or company..." 
              className="w-full pl-16 pr-6 h-16 rounded-3xl bg-white border border-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all text-gray-700"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 h-16 rounded-3xl font-medium transition-all whitespace-nowrap ${
                  filter === cat 
                  ? 'bg-accent text-white shadow-lg shadow-accent/20' 
                  : 'bg-white text-gray-500 border border-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <AnimatePresence mode='popLayout'>
            {filteredJobs.map((job) => (
              <JobCard 
                key={job.id} 
                job={job} 
                company={COMPANIES.find(c => c.id === job.companyId)!} 
                onClick={() => onJobSelect(job)}
              />
            ))}
          </AnimatePresence>
        </div>
        
        {filteredJobs.length === 0 && (
          <div className="text-center py-24">
            <p className="text-gray-400 text-lg">No roles found matching your search. Try broadening your criteria.</p>
          </div>
        )}
      </div>
    </section>
  );
};

const CompanyList = ({ onSelect }: { onSelect: (c: Company) => void }) => {
  return (
    <section className="py-24 px-6 pt-32">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-12">Industry Leaders</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {COMPANIES.map(company => (
            <motion.div
              key={company.id}
              whileHover={{ y: -5 }}
              onClick={() => onSelect(company)}
              className="glass p-10 rounded-[40px] cursor-pointer group text-center"
            >
              <img src={company.logo} alt={company.name} className="w-24 h-24 rounded-3xl mx-auto mb-8 shadow-md" />
              <h3 className="text-2xl font-bold mb-3 group-hover:text-accent transition-colors">{company.name}</h3>
              <p className="text-gray-500 mb-6 line-clamp-2">{company.description}</p>
              <div className="flex items-center justify-center gap-4 py-4 border-y border-gray-50">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                  {company.industry}
                </div>
                <div className="w-1 h-1 bg-gray-200 rounded-full" />
                <div className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                  {company.employees} Employees
                </div>
              </div>
              <button className="mt-8 text-accent font-bold flex items-center gap-2 mx-auto">
                View Profile <ArrowRight size={18} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AboutSection = () => {
  return (
    <section className="py-24 px-6 pt-32">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-bold mb-12 text-center text-serif italic">Our Mission</h2>
          <div className="prose prose-lg text-gray-600 leading-loose mx-auto">
            <p className="mb-8">
              At <strong className="text-black">HireAI</strong>, we believe that the traditional job market is fundamentally broken. Resume-keyword matching is outdated, impersonal, and often misses the nuance of human talent.
            </p>
            <p className="mb-8">
              We've built a system that looks deeper. Our proprietary AI matching engine analyzes over 200 data points—from technical proficiency to core cultural values—to find the intersections where people and companies truly thrive.
            </p>
            <div className="grid sm:grid-cols-2 gap-8 my-16">
              <div className="p-8 rounded-3xl bg-pastel-blue/30 border border-pastel-blue">
                <BarChart3 className="text-blue-600 mb-4" size={32} />
                <h4 className="text-xl font-bold mb-2">Data-Driven</h4>
                <p className="text-sm text-gray-500">Neutralizing bias through objective competency mapping and psychometric alignment.</p>
              </div>
              <div className="p-8 rounded-3xl bg-pastel-pink/30 border border-pastel-pink">
                <Users className="text-pink-600 mb-4" size={32} />
                <h4 className="text-xl font-bold mb-2">Human-Centric</h4>
                <p className="text-sm text-gray-500">Every match is reviewed for context, ensuring culture fit remains a priority.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const JoinPortal = () => {
  return (
    <section className="py-24 px-6 pt-32 bg-white flex items-center justify-center min-h-screen">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-12 bg-soft-bg rounded-[48px] overflow-hidden shadow-2xl shadow-gray-200">
        <div className="p-16 flex flex-col justify-center">
          <h2 className="text-4xl font-bold mb-6">Choose your path.</h2>
          <p className="text-gray-500 mb-12">Whether you're looking for your next breakthrough role or the talent to build it, we have the tools you need.</p>
          
          <div className="space-y-6">
            <button className="flex items-center gap-6 p-6 rounded-3xl bg-white border border-gray-100 hover:border-accent hover:shadow-lg transition-all w-full text-left group">
              <div className="w-14 h-14 rounded-2xl bg-pastel-purple flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                <Users size={32} />
              </div>
              <div>
                <h4 className="text-xl font-bold">For Talents</h4>
                <p className="text-sm text-gray-400">Join the network and get discovered.</p>
              </div>
              <ChevronRight className="ml-auto text-gray-300" />
            </button>

            <button className="flex items-center gap-6 p-6 rounded-3xl bg-white border border-gray-100 hover:border-accent hover:shadow-lg transition-all w-full text-left group">
              <div className="w-14 h-14 rounded-2xl bg-pastel-green flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                <Building2 size={32} />
              </div>
              <div>
                <h4 className="text-xl font-bold">For Companies</h4>
                <p className="text-sm text-gray-400">Hire better, faster with AI insight.</p>
              </div>
              <ChevronRight className="ml-auto text-gray-300" />
            </button>
          </div>
        </div>
        <div className="hidden md:block relative">
          <img 
            src="https://images.unsplash.com/photo-1549692520-acc6669e2f0c?w=800&q=80" 
            className="absolute inset-0 w-full h-full object-cover"
            alt="Collaboration"
          />
          <div className="absolute inset-0 bg-accent/20" />
          <div className="absolute inset-x-12 bottom-12 p-8 glass rounded-3xl">
            <p className="text-lg font-bold text-gray-900 mb-2 italic">"The process was seamless."</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-pastel-pink overflow-hidden">
                <div className="w-full h-full bg-pastel-pink" />
              </div>
              <div className="text-sm font-medium">Elena Voss, Senior Consultant</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const TalentHighlights = () => {
  return (
    <section className="py-24 px-6 bg-pastel-blue/10 overflow-hidden relative">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-16 text-center">Wall of Talent</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {TALENT_HIGHLIGHTS.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white p-12 rounded-[40px] shadow-sm relative group"
            >
              <div className="absolute -top-6 -left-6 text-accent opacity-20 group-hover:opacity-100 transition-opacity">
                <Sparkles size={64} />
              </div>
              <p className="text-2xl text-gray-700 font-medium mb-12 italic leading-relaxed">"{item.quote}"</p>
              <div className="flex items-center gap-4">
                <img src={item.avatar} className="w-16 h-16 rounded-full border-4 border-pastel-blue/30" alt={item.name} />
                <div>
                  <h4 className="text-xl font-bold text-gray-900">{item.name}</h4>
                  <p className="text-accent font-medium">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = ({ setView }: { setView: (v: string) => void }) => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white">
                <Sparkles size={24} />
              </div>
              <span className="text-2xl font-bold tracking-tighter text-gray-900">
                Hire<span className="text-accent">AI</span>
              </span>
            </div>
            <p className="text-gray-500 max-w-sm text-lg leading-relaxed mb-8">
              Crafting meaningful human connections through the power of intelligent technology.
            </p>
            <div className="flex gap-4">
              {['Twitter', 'LinkedIn', 'Instagram'].map(social => (
                <button key={social} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-accent hover:bg-accent/10 transition-all">
                  <Globe size={20} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-6">Platform</h4>
            <ul className="space-y-4 text-gray-500">
              <li><button onClick={() => setView('jobs')} className="hover:text-accent transition-colors">Find Jobs</button></li>
              <li><button onClick={() => setView('companies')} className="hover:text-accent transition-colors">Browse Companies</button></li>
              <li><button onClick={() => setView('about')} className="hover:text-accent transition-colors">Our Approach</button></li>
              <li><button onClick={() => setView('home')} className="hover:text-accent transition-colors">Latest Highlights</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Community</h4>
            <ul className="space-y-4 text-gray-500">
              <li><a href="#" className="hover:text-accent transition-colors">Talent Network</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Events</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Success Stories</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Join as Mentor</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-12 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-gray-400">© 2024 HireAI Platforms Inc. All rights reserved.</p>
          <div className="flex gap-8 text-sm text-gray-400">
            <a href="#" className="hover:text-accent">Privacy Policy</a>
            <a href="#" className="hover:text-accent">Terms of Service</a>
            <a href="#" className="hover:text-accent">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const AuthModal = ({ initialMode, onAuthSuccess }: { initialMode: 'login' | 'signup', onAuthSuccess: () => void }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        try {
          await signInWithEmailAndPassword(auth, email, password);
          onAuthSuccess();
        } catch (err: any) {
          setError('Email or password is incorrect.');
        }
      } else if (mode === 'signup') {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          onAuthSuccess();
        } catch (err: any) {
          if (err.code === 'auth/email-already-in-use') {
            setError('User already exists. Please sign in.');
          } else {
            setError(err.message);
          }
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 px-6 pt-32 bg-soft-bg min-h-screen flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white p-12 rounded-[48px] shadow-2xl shadow-accent/5 border border-gray-100"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-pastel-blue rounded-3xl flex items-center justify-center text-accent mx-auto mb-6">
            <Sparkles size={32} />
          </div>
          <h2 className="text-3xl font-bold mb-2">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-gray-500">{mode === 'login' ? 'Enter your details to access your portal' : 'Start your journey with AI-powered matching'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-pastel-pink text-red-600 text-sm font-medium rounded-2xl border border-pink-100 italic">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="email" 
                required
                className="w-full pl-12 pr-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-accent/20 focus:outline-none transition-all"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="password" 
                required
                className="w-full pl-12 pr-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-accent/20 focus:outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="button-primary w-full py-4 text-lg disabled:opacity-50"
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-10 text-center text-gray-500 font-medium">
          {mode === 'login' ? (
            <p>Don't have an account? <button onClick={() => setMode('signup')} className="text-accent hover:underline">Sign up</button></p>
          ) : (
            <p>Already have an account? <button onClick={() => setMode('login')} className="text-accent hover:underline">Sign in</button></p>
          )}
        </div>
      </motion.div>
    </section>
  );
};

const RoleSelection = ({ onComplete }: { onComplete: (role: 'seeker' | 'employer', name: string) => void }) => {
  const [role, setRole] = useState<'seeker' | 'employer' | null>(null);
  const [name, setName] = useState('');

  return (
    <section className="py-24 px-6 pt-32 bg-soft-bg min-h-screen flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full bg-white p-16 rounded-[48px] shadow-2xl border border-gray-100"
      >
        <h2 className="text-4xl font-bold mb-4 text-center">Complete your profile</h2>
        <p className="text-gray-500 mb-12 text-center">How do you plan to use HireAI?</p>

        <div className="space-y-6 mb-12">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">Full Name</label>
            <input 
              type="text" 
              className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-accent/20 focus:outline-none transition-all"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <button
              onClick={() => setRole('seeker')}
              className={`p-8 rounded-3xl border-2 transition-all text-left group ${
                role === 'seeker' ? 'border-accent bg-accent/5' : 'border-gray-50 hover:border-accent/20'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl mb-4 flex items-center justify-center transition-colors group-hover:scale-110 ${
                role === 'seeker' ? 'bg-secondary-accent text-white' : 'bg-pastel-blue text-accent'
              }`}>
                <Users size={32} />
              </div>
              <h4 className="text-xl font-bold">Job Seeker</h4>
              <p className="text-sm text-gray-400">Apply for top roles.</p>
            </button>

            <button
              onClick={() => setRole('employer')}
              className={`p-8 rounded-3xl border-2 transition-all text-left group ${
                role === 'employer' ? 'border-accent bg-accent/5' : 'border-gray-50 hover:border-accent/20'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl mb-4 flex items-center justify-center transition-colors group-hover:scale-110 ${
                role === 'employer' ? 'bg-pastel-green text-green-600' : 'bg-pastel-green text-green-600'
              }`}>
                <Building2 size={32} />
              </div>
              <h4 className="text-xl font-bold">Employer</h4>
              <p className="text-sm text-gray-400">Post and manage jobs.</p>
            </button>
          </div>
        </div>

        <button
          disabled={!role || !name}
          onClick={() => role && name && onComplete(role, name)}
          className="button-primary w-full py-5 text-lg disabled:opacity-50"
        >
          Enter Portal
        </button>
      </motion.div>
    </section>
  );
};

const Dashboard = ({ profile, onJobSelect, setView }: { profile: UserProfile, onJobSelect: (j: Job) => void, setView: (v: string) => void }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateJob, setShowCreateJob] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (profile.role === 'employer') {
          const [j, a] = await Promise.all([
            getEmployerJobs(profile.uid),
            getEmployerApplications(profile.uid)
          ]);
          setJobs(j || []);
          setApplications(a || []);
        } else {
          const a = await getSeekerApplications(profile.uid);
          setApplications(a || []);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [profile]);

  const findJob = async (jobId: string) => {
    // Check static jobs first
    let job = JOBS.find(j => j.id === jobId);
    if (!job) {
      // In a real app we'd fetch the specific job from Firestore
      // For now we'll check our local state
      job = jobs.find(j => j.id === jobId);
    }
    return job;
  };

  const handleViewDetails = async (jobId: string) => {
    const job = await findJob(jobId);
    if (job) onJobSelect(job);
    else alert('Job details no longer available.');
  };

  if (loading) return (
    <div className="py-40 text-center">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full mx-auto mb-4" />
      <p className="text-gray-400">Loading your profile...</p>
    </div>
  );

  return (
    <section className="py-40 px-6 bg-soft-bg min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h1 className="text-5xl font-bold mb-4">Welcome, {profile.name}</h1>
            <p className="text-gray-500 text-lg">Manage your {profile.role === 'employer' ? 'active postings and candidates' : 'applications and career progress'}.</p>
          </div>
          {profile.role === 'employer' && (
            <button 
              onClick={() => setShowCreateJob(true)}
              className="button-primary flex items-center gap-2"
            >
              <Zap size={20} /> Post New Job
            </button>
          )}
        </div>

        {profile.role === 'employer' ? (
          <div className="grid lg:grid-cols-[1fr_400px] gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-8">Active Postings ({jobs.length})</h2>
              <div className="space-y-6">
                {jobs.map(job => (
                  <div key={job.id} onClick={() => onJobSelect(job)} className="glass p-8 rounded-3xl flex justify-between items-center group cursor-pointer hover:border-accent/20 transition-all">
                    <div>
                      <h3 className="text-xl font-bold group-hover:text-accent transition-colors">{job.title}</h3>
                      <p className="text-sm text-gray-500">{job.location} • {job.category}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-2xl font-bold">{applications.filter(a => a.jobId === job.id).length}</div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Applied</div>
                      </div>
                      <ChevronRight className="text-gray-300" />
                    </div>
                  </div>
                ))}
                {jobs.length === 0 && (
                  <div className="p-12 border-2 border-dashed border-gray-200 rounded-[40px] text-center">
                    <p className="text-gray-400">No active job posts yet.</p>
                  </div>
                )}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-8">Recent Applications</h2>
              <div className="space-y-4">
                {applications.map(app => (
                  <div key={app.id} className="bg-white p-6 rounded-3xl border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-pastel-blue" />
                        <div>
                          <div className="text-sm font-bold">Candidate</div>
                          <div className="text-[10px] text-gray-400">{app.jobTitle}</div>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-pastel-yellow text-yellow-700 text-[10px] font-bold rounded uppercase">
                        {app.status}
                      </span>
                    </div>
                    <button onClick={() => handleViewDetails(app.jobId)} className="text-xs font-bold text-accent hover:underline">Review Application</button>
                  </div>
                ))}
                {applications.length === 0 && (
                  <p className="text-gray-400 text-center">No applications received yet.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-8">Your Applications ({applications.length})</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {applications.map(app => (
                <div key={app.id} className="glass p-8 rounded-[40px]">
                  <div className="flex justify-between mb-8">
                    <div className="w-14 h-14 bg-pastel-blue rounded-2xl flex items-center justify-center text-accent">
                      <Sparkles size={28} />
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${
                      app.status === 'pending' ? 'bg-pastel-yellow text-yellow-700 border-yellow-100' :
                      app.status === 'accepted' ? 'bg-pastel-green text-green-700 border-green-100' :
                      'bg-gray-100 text-gray-500 border-gray-200'
                    }`}>
                      {app.status.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{app.jobTitle}</h3>
                  <p className="text-gray-500 mb-6">{app.companyName}</p>
                  <div className="pt-6 border-t border-gray-50 flex justify-between items-center">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Applied recently
                    </div>
                    <button onClick={() => handleViewDetails(app.jobId)} className="text-accent font-bold text-sm hover:underline">Details</button>
                  </div>
                </div>
              ))}
              {applications.length === 0 && (
                <div className="col-span-full p-20 border-2 border-dashed border-gray-200 rounded-[60px] text-center">
                  <p className="text-gray-400 text-lg mb-6">You haven't applied to any roles yet.</p>
                  <button onClick={() => setView('jobs')} className="button-secondary">Explore Jobs</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showCreateJob && (
        <CreateJobModal 
          employerId={profile.uid} 
          onClose={() => setShowCreateJob(false)} 
          onSuccess={() => {
            setShowCreateJob(false);
            // In a real app we'd trigger a reload or use a listener
            window.location.reload();
          }}
        />
      )}
    </section>
  );
};

const CreateJobModal = ({ employerId, onClose, onSuccess }: { employerId: string, onClose: () => void, onSuccess: () => void }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: 'Engineering',
    type: 'Full-time' as const,
    salary: '',
    companyName: 'Lumina Labs',
    companyLogo: 'https://images.unsplash.com/photo-1572044162444-ad60f128bde3?w=128&h=128&fit=crop'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createJob({
        ...formData,
        ownerId: employerId,
        companyId: employerId,
        aiMatchScore: Math.floor(Math.random() * 20) + 80
      });
      onSuccess();
    } catch (err) {
      console.error('Error creating job:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-2xl bg-white rounded-[48px] p-12 overflow-y-auto max-h-[90vh]"
      >
        <h2 className="text-3xl font-bold mb-8">Post a new role</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Job Title</label>
              <input type="text" required className="w-full px-6 py-4 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-accent/20" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Category</label>
              <select className="w-full px-6 py-4 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-accent/20" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option>Engineering</option>
                <option>Design</option>
                <option>Marketing</option>
                <option>Consulting</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Description</label>
            <textarea rows={4} required className="w-full px-6 py-4 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-accent/20" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Location</label>
              <input type="text" required className="w-full px-6 py-4 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-accent/20" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Salary Range</label>
              <input type="text" required className="w-full px-6 py-4 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-accent/20" placeholder="$100k - $150k" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} />
            </div>
          </div>
          <button type="submit" className="button-primary w-full py-4 text-lg">Post Role</button>
        </form>
      </motion.div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState('home');
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProfile = async (uid: string) => {
    const p = await getUserProfile(uid);
    setProfile(p);
    if (!p) setView('role-selection');
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser.uid);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleRoleSelection = async (role: 'seeker' | 'employer', name: string) => {
    if (!user) return;
    try {
      await createUserProfile(user.uid, {
        email: user.email!,
        name,
        role
      });
      await fetchProfile(user.uid);
      setView('dashboard');
    } catch (err) {
      console.error('Error creating profile:', err);
    }
  };

  const handleApply = async (job: Job) => {
    if (!user || !profile) {
      setView('login');
      return;
    }
    if (profile.role !== 'seeker') {
      alert('Only job seekers can apply for roles.');
      return;
    }
    try {
      await applyForJob({
        jobId: job.id,
        seekerId: user.uid,
        employerId: job.ownerId || 'system',
        jobTitle: job.title,
        companyName: job.companyName || COMPANIES.find(c => c.id === job.companyId)?.name || 'Unknown Company'
      });
      alert('Application submitted successfully!');
      setView('dashboard');
    } catch (err) {
      console.error('Error applying for job:', err);
    }
  };

  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
    setView('job-detail');
    window.scrollTo(0, 0);
  };

  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company);
    setView('company-detail');
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-soft-bg">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar activeView={view} setView={setView} user={user} profile={profile} />
      
      <main>
        <AnimatePresence mode="wait">
          {view === 'role-selection' && (
            <motion.div key="role-selection" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <RoleSelection onComplete={handleRoleSelection} />
            </motion.div>
          )}

          {view === 'dashboard' && profile && (
            <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Dashboard profile={profile} onJobSelect={handleJobSelect} setView={setView} />
            </motion.div>
          )}

          {(view === 'home') && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Hero onSearch={() => setView('jobs')} search={searchQuery} onSearchChange={setSearchQuery} />
              <StatsSection />
              
              <section className="py-24 px-6 bg-soft-bg">
                <div className="max-w-7xl mx-auto">
                  <div className="flex justify-between items-end mb-12">
                    <div>
                      <h2 className="text-4xl font-bold mb-4">Latest Roles</h2>
                      <p className="text-gray-500">Fresh opportunities from our partner ecosystem.</p>
                    </div>
                    <button 
                      onClick={() => setView('jobs')}
                      className="text-accent font-bold flex items-center gap-2 hover:gap-3 transition-all"
                    >
                      View all jobs <ArrowRight size={20} />
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
                    {JOBS.slice(0, 2).map((job) => (
                      <JobCard 
                        key={job.id} 
                        job={job} 
                        company={COMPANIES.find(c => c.id === job.companyId)!} 
                        onClick={() => handleJobSelect(job)}
                      />
                    ))}
                  </div>
                </div>
              </section>

              <TalentHighlights />
            </motion.div>
          )}

          {(view === 'login' || view === 'signup') && (
            <AuthModal 
              initialMode={view === 'login' ? 'login' : 'signup'} 
              onAuthSuccess={() => setView('home')} 
            />
          )}

          {view === 'jobs' && (
            <motion.div
              key="jobs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <JobBrowser onJobSelect={handleJobSelect} search={searchQuery} setSearch={setSearchQuery} />
            </motion.div>
          )}

          {view === 'companies' && (
            <motion.div
              key="companies"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CompanyList onSelect={handleCompanySelect} />
            </motion.div>
          )}

          {view === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AboutSection />
            </motion.div>
          )}

          {view === 'join' && (
            <motion.div
              key="join"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <JoinPortal />
            </motion.div>
          )}

          {view === 'job-detail' && selectedJob && (
            <motion.div
              key="job-detail"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="pt-40 pb-24 px-6 md:px-0 max-w-4xl mx-auto"
            >
              <button 
                onClick={() => setView('jobs')}
                className="flex items-center gap-2 text-gray-400 hover:text-accent transition-colors mb-12 font-medium"
              >
                <ArrowRight size={20} className="rotate-180" /> Back to listings
              </button>

              <div className="glass p-12 rounded-[48px] shadow-2xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                  <div className="flex items-center gap-6">
                    <img 
                      src={COMPANIES.find(c => c.id === selectedJob.companyId)!.logo} 
                      className="w-20 h-20 rounded-3xl object-cover" 
                      alt="Logo"
                    />
                    <div>
                      <h1 className="text-4xl font-bold text-gray-900 mb-2">{selectedJob.title}</h1>
                      <button 
                        onClick={() => handleCompanySelect(COMPANIES.find(c => c.id === selectedJob.companyId)!)}
                        className="text-xl text-gray-500 hover:text-accent"
                      >
                        {COMPANIES.find(c => c.id === selectedJob.companyId)!.name}
                      </button>
                    </div>
                  </div>
                  <div className="px-6 py-3 bg-pastel-green text-green-700 font-bold rounded-2xl border border-green-100 inline-flex items-center gap-2">
                    <Sparkles size={20} />
                    {selectedJob.aiMatchScore}% AI Match
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 py-8 border-y border-gray-50">
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Salary</div>
                    <div className="text-lg font-bold text-gray-900">{selectedJob.salary}</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Type</div>
                    <div className="text-lg font-bold text-gray-900">{selectedJob.type}</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Location</div>
                    <div className="text-lg font-bold text-gray-900">{selectedJob.location}</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Posted</div>
                    <div className="text-lg font-bold text-gray-900">{selectedJob.postedAt}</div>
                  </div>
                </div>

                <div className="prose prose-lg max-w-none mb-12">
                  <h3 className="text-2xl font-bold mb-6">About the role</h3>
                  <p className="text-gray-600 leading-relaxed text-lg mb-8">{selectedJob.description}</p>
                  
                  <h4 className="text-xl font-bold mb-4">Key Responsibilities</h4>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3 text-gray-600">
                      <div className="w-6 h-6 rounded-full bg-pastel-blue flex-shrink-0 flex items-center justify-center text-blue-600 mt-1"><ChevronRight size={14} /></div>
                      Design and implement scalable systems using state-of-the-art technologies.
                    </li>
                    <li className="flex items-start gap-3 text-gray-600">
                      <div className="w-6 h-6 rounded-full bg-pastel-blue flex-shrink-0 flex items-center justify-center text-blue-600 mt-1"><ChevronRight size={14} /></div>
                      Collaborate with cross-functional teams to deliver exceptional user experiences.
                    </li>
                    <li className="flex items-start gap-3 text-gray-600">
                      <div className="w-6 h-6 rounded-full bg-pastel-blue flex-shrink-0 flex items-center justify-center text-blue-600 mt-1"><ChevronRight size={14} /></div>
                      Analyze complex data sets to derive actionable insights for business growth.
                    </li>
                  </ul>
                </div>

                <button 
                  onClick={() => handleApply(selectedJob)}
                  className="button-primary w-full text-lg py-5"
                >
                  Apply Now via HireAI Portal
                </button>
              </div>
            </motion.div>
          )}

          {view === 'company-detail' && selectedCompany && (
            <motion.div
              key="company-detail"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="pt-40 pb-24 px-6 md:px-0 max-w-5xl mx-auto"
            >
              <button 
                onClick={() => setView('companies')}
                className="flex items-center gap-2 text-gray-400 hover:text-accent transition-colors mb-12 font-medium"
              >
                <ArrowRight size={20} className="rotate-180" /> Back to companies
              </button>

              <div className="grid lg:grid-cols-[1fr_320px] gap-12">
                <div>
                  <div className="flex items-center gap-8 mb-12">
                    <img src={selectedCompany.logo} className="w-32 h-32 rounded-[40px] shadow-lg" alt="Logo" />
                    <div>
                      <h1 className="text-5xl font-bold mb-4">{selectedCompany.name}</h1>
                      <div className="flex items-center gap-4">
                        <span className="px-4 py-1.5 bg-pastel-blue text-blue-600 rounded-full text-xs font-bold uppercase">{selectedCompany.industry}</span>
                        <div className="flex items-center gap-1.5 text-gray-400 text-sm font-medium">
                          <Globe size={16} /> {selectedCompany.website}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="prose prose-xl mb-16">
                    <h2 className="text-3xl font-bold mb-6">About Us</h2>
                    <p className="text-gray-600 leading-loose">{selectedCompany.description}</p>
                  </div>

                  <h2 className="text-3xl font-bold mb-8">Milestones</h2>
                  <div className="space-y-6 mb-16">
                    {selectedCompany.milestones.map((m, i) => (
                      <div key={i} className="flex gap-8 group">
                        <div className="text-2xl font-bold text-accent min-w-[80px]">{m.year}</div>
                        <div className="relative pl-8 border-l-2 border-pastel-blue pb-8 group-last:border-transparent">
                          <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-accent ring-4 ring-white" />
                          <p className="text-xl font-medium text-gray-900">{m.event}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <h2 className="text-3xl font-bold mb-8">Open Positions</h2>
                  <div className="space-y-4">
                    {JOBS.filter(j => j.companyId === selectedCompany.id).map(job => (
                      <div 
                        key={job.id}
                        onClick={() => handleJobSelect(job)}
                        className="p-6 rounded-3xl border border-gray-100 bg-white hover:border-accent hover:shadow-lg transition-all cursor-pointer flex justify-between items-center group"
                      >
                        <div>
                          <h4 className="text-xl font-bold group-hover:text-accent transition-colors">{job.title}</h4>
                          <p className="text-sm text-gray-500">{job.location} • {job.salary}</p>
                        </div>
                        <ChevronRight className="text-gray-300 group-hover:text-accent" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="glass p-8 rounded-[40px] sticky top-32">
                    <h3 className="font-bold mb-6 text-xl">Quick Facts</h3>
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-pastel-pink flex items-center justify-center text-pink-600">
                          <Users size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-gray-400">Team</p>
                          <p className="font-bold">{selectedCompany.employees}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-pastel-green flex items-center justify-center text-green-600">
                          <MapPin size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-gray-400">HQ</p>
                          <p className="font-bold">{selectedCompany.headquarters}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-pastel-yellow flex items-center justify-center text-yellow-600">
                          <Award size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-gray-400">Awards</p>
                          <p className="font-bold">Top 5 Places to Work</p>
                        </div>
                      </div>
                    </div>
                    <button className="button-primary w-full mt-10">
                      Follow Company
                    </button>
                    <p className="text-center text-[10px] text-gray-400 mt-4 uppercase font-bold tracking-widest">Receive updates on new roles</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer setView={setView} />
    </div>
  );
}
