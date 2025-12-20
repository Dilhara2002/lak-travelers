import React, { useEffect } from 'react';
import wijesinghe from "../assets/wijesinghe.png"; 

const AboutUs = () => {
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#fcfcfc] min-h-screen py-16 md:py-24 font-sans overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* --- Hero Section --- */}
        <div className="text-center mb-20 opacity-100 transition-opacity duration-1000">
          <span className="text-blue-600 font-bold tracking-[0.3em] uppercase text-xs mb-4 block underline decoration-blue-200 decoration-2 underline-offset-8">Our Journey</span>
          <h1 className="text-4xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight">
            We Create Memories <br /> 
            <span className="text-blue-600">Across Sri Lanka</span>
          </h1>
          <p className="text-slate-500 text-base md:text-xl max-w-3xl mx-auto leading-relaxed">
            Founded by <strong>Mr. Wijesinghe</strong>, Lak Travelers is more than a travel agency. 
            We are your local partner in exploring the hidden gems of our island paradise.
          </p>
        </div>

        {/* --- Mission & Vision --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="bg-white p-10 rounded-[3rem] shadow-[0_15px_40px_rgba(0,0,0,0.03)] border border-slate-100 transition-transform hover:-translate-y-2 duration-300">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl mb-6 shadow-lg shadow-blue-200">🎯</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h3>
            <p className="text-slate-500 leading-relaxed">
              To provide authentic, sustainable, and luxury travel experiences in Sri Lanka while ensuring the highest level of safety and local expertise for every traveler.
            </p>
          </div>
          <div className="bg-white p-10 rounded-[3rem] shadow-[0_15px_40px_rgba(0,0,0,0.03)] border border-slate-100 transition-transform hover:-translate-y-2 duration-300">
            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-2xl mb-6 shadow-lg">👁️</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Vision</h3>
            <p className="text-slate-500 leading-relaxed">
              To be the most trusted name in Sri Lankan tourism, connecting the world with the rich culture and natural beauty of our motherland.
            </p>
          </div>
        </div>

        {/* --- Stats Section --- */}
        <div className="bg-blue-600 rounded-[4rem] p-12 mb-20 text-white flex flex-wrap justify-around gap-10 shadow-2xl">
          <div className="text-center">
            <h4 className="text-4xl font-black mb-2">500+</h4>
            <p className="text-blue-100 text-sm uppercase tracking-widest">Happy Travelers</p>
          </div>
          <div className="text-center">
            <h4 className="text-4xl font-black mb-2">50+</h4>
            <p className="text-blue-100 text-sm uppercase tracking-widest">Luxury Hotels</p>
          </div>
          <div className="text-center">
            <h4 className="text-4xl font-black mb-2">100%</h4>
            <p className="text-blue-100 text-sm uppercase tracking-widest">Safe Tours</p>
          </div>
          <div className="text-center">
            <h4 className="text-4xl font-black mb-2">24/7</h4>
            <p className="text-blue-100 text-sm uppercase tracking-widest">AI Support</p>
          </div>
        </div>

        {/* --- Who is Mr. Wijesinghe Card --- */}
        <div className="bg-slate-900 rounded-[4rem] p-8 md:p-16 text-white flex flex-col md:flex-row items-center gap-12 shadow-2xl shadow-blue-900/10">
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-[2.5rem] overflow-hidden bg-slate-800 flex-shrink-0 border-4 border-slate-700 shadow-inner">
            <img 
              src={wijesinghe} 
              alt="Mr. Wijesinghe" 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" 
              onError={(e) => { e.target.src = "https://via.placeholder.com/300?text=Mr.+Wijesinghe" }}
            />
          </div>
          <div className="space-y-6 text-center md:text-left">
            <span className="bg-blue-600 text-[10px] px-3 py-1 rounded-full uppercase font-bold tracking-widest">Founder & CEO</span>
            <h2 className="text-3xl md:text-5xl font-black italic">"Travel is the only thing you buy that makes you richer."</h2>
            <p className="text-slate-400 text-lg font-medium">- Mr. Wijesinghe, Founder of Lak Travelers.</p>
            <p className="text-slate-300 leading-relaxed max-w-xl text-base md:text-lg">
              Based in <strong>Kandy</strong>, I started Lak Travelers to showcase the hospitality and beauty of Sri Lanka. My team and I are dedicated to making every booking seamless and every trip unforgettable.
            </p>
          </div>
        </div>

        {/* --- Location & Contact --- */}
        <div className="mt-24 text-center">
          <div className="inline-block p-1 px-4 mb-6 bg-slate-100 rounded-full text-slate-500 text-[10px] font-bold uppercase tracking-widest italic border border-slate-200">
            Founded by Mr. Wijesinghe
          </div>
          <p className="text-slate-600 font-bold text-lg md:text-xl mb-4 italic">73/D Walagedara, Wattappola, Sri Lanka.</p>
          <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8 font-black text-blue-600 text-lg">
            <a href="tel:+94723201365" className="hover:text-blue-800 transition-colors underline decoration-blue-200 decoration-2 underline-offset-4">+94 72 320 1365</a>
            <span className="hidden md:block text-slate-300">|</span>
            <a href="mailto:laktravelers@gmail.com" className="hover:text-blue-800 transition-colors underline decoration-blue-200 decoration-2 underline-offset-4">laktravelers@gmail.com</a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutUs;