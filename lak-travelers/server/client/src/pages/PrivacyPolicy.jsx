import React, { useEffect } from 'react';

const PrivacyPolicy = () => {
  const currentYear = new Date().getFullYear();

  // පිටුවට ආපු ගමන් ඉහළටම scroll වෙන්න
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#f8fafc] min-h-screen py-16 md:py-24 font-sans selection:bg-blue-100 selection:text-blue-600">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Rising Header Section */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-10 duration-700 ease-out">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
            Privacy <span className="text-blue-600">Policy</span>
          </h1>
          <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Your trust is our foundation. Learn how Lak Travelers protects your personal journey data.
          </p>
          <div className="mt-8 inline-flex items-center gap-2 bg-white border border-slate-200 shadow-sm text-slate-600 text-[11px] font-bold px-5 py-2 rounded-full uppercase tracking-[0.1em]">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
            Last Updated: Jan {currentYear}
          </div>
        </div>

        {/* Content Cards - Staggered Rising Effect */}
        <div className="space-y-8">
          
          {/* Card 1 */}
          <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-150 ease-out">
            <div className="flex items-center gap-4 mb-6">
              <span className="bg-blue-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center font-bold shadow-lg shadow-blue-200">01</span>
              <h2 className="text-2xl font-bold text-slate-900">Introduction</h2>
            </div>
            <p className="text-slate-600 leading-relaxed text-base md:text-lg">
              Welcome to <strong>Lak Travelers</strong>. We are committed to protecting the personal data of our users. Managed by <strong>Mr. Wijesinghe</strong>, our platform ensures your Sri Lankan adventure is safe and private.
            </p>
          </section>

          {/* Card 2 */}
          <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 ease-out">
            <div className="flex items-center gap-4 mb-6">
              <span className="bg-blue-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center font-bold shadow-lg shadow-blue-200">02</span>
              <h2 className="text-2xl font-bold text-slate-900">Information We Collect</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <p className="font-bold text-slate-800">Identity & Contact</p>
                <p className="text-slate-500 text-sm">Full name, Phone (+94 76 289 8945), and Email (laktravelers@gmail.com) for secure bookings.</p>
              </div>
              <div className="space-y-3">
                <p className="font-bold text-slate-800">Travel Data</p>
                <p className="text-slate-500 text-sm">Hotel preferences, tour itineraries, and vehicle rental requirements.</p>
              </div>
            </div>
          </section>

          {/* Card 3 - Security Highlight */}
          <section className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500 ease-out">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="text-blue-500 text-3xl">🛡️</span> Data Security
            </h2>
            <p className="text-slate-300 leading-relaxed text-base mb-8">
              We implement industry-standard encryption. Your payment details and personal chat history with our Lak Assistant AI are encrypted and never shared with unauthorized third parties.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-slate-800 pt-8">
              <div className="text-center"><p className="text-blue-400 font-bold">100%</p><p className="text-[10px] text-slate-500 uppercase tracking-widest">Encrypted</p></div>
              <div className="text-center"><p className="text-blue-400 font-bold">24/7</p><p className="text-[10px] text-slate-500 uppercase tracking-widest">Monitored</p></div>
              <div className="text-center"><p className="text-blue-400 font-bold">Secure</p><p className="text-[10px] text-slate-500 uppercase tracking-widest">Payments</p></div>
              <div className="text-center"><p className="text-blue-400 font-bold">Private</p><p className="text-[10px] text-slate-500 uppercase tracking-widest">Planning</p></div>
            </div>
          </section>

          {/* Card 4 - Contact */}
          <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 text-center animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-700 ease-out">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact Mr. Wijesinghe</h2>
            <p className="text-slate-500 mb-8 text-sm">Have questions about your data? Reach out to us directly.</p>
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-10">
               <div className="flex items-center gap-2 font-semibold text-slate-700 underline decoration-blue-200">
                 +94 76 289 8945
               </div>
               <div className="flex items-center gap-2 font-semibold text-slate-700 underline decoration-blue-200">
                 laktravelers@gmail.com
               </div>
            </div>
          </section>

        </div>

        {/* Final Footer Quote */}
        <div className="mt-16 text-center text-slate-400 text-sm animate-in fade-in duration-1000 delay-1000">
          <p>© {currentYear} Lak Travelers. 73/D Walagedara, Wattappola, Sri Lanka.</p>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;