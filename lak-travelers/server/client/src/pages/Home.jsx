import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// 👇 Import your local images
import i1 from "../assets/i1.jpg";
import i2 from "../assets/i2.jpg";
import i3 from "../assets/i3.jpg";
import i4 from "../assets/i4.jpg";
import i5 from "../assets/i5.jpg";
import i6 from "../assets/i6.jpg";
import i7 from "../assets/i7.jpg";
import i8 from "../assets/i8.jpg";

const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const heroImages = [i1, i2, i3, i4, i5, i6, i7];

  // 1. පරිශීලකයා ලොග් වී ඇත්දැයි පරීක්ෂා කරන්න
  const user = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 8000);
    return () => clearInterval(intervalId);
  }, [heroImages.length]);

  // ============================================================
  // 👇 ලියාපදිංචි වූ පරිශීලකයින් සඳහා පෙන්වන කොටස (LOGIN USER UI)
  // ============================================================
  const LoggedInUI = () => (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 mt-[-20px]">
      <div className="relative h-[650px] lg:h-[800px] flex items-center justify-center px-50 overflow-hidden">
        <div className="absolute inset-0">
          {heroImages.map((imgUrl, index) => (
            <img
              key={index}
              src={imgUrl}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ease-in-out ${
                index === currentImageIndex ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-slate-50"></div>
        </div>

        <div className="relative z-20 max-w-5xl w-full text-center text-white space-y-8 animate-fade-in-up px-2 md:px-0 mt-20">
          <div className="inline-block">
            <span className="uppercase tracking-[0.2em] text-xs md:text-sm font-bold bg-white/10 px-6 py-2 rounded-full backdrop-blur-md border border-white/20 shadow-lg">
              WELCOME TO PARADISE
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tight drop-shadow-2xl leading-[1.1]">
            Experience <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500">
              Sri Lanka
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-100 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md">
            Your ultimate journey awaits. Start exploring your next destination today.
          </p>
          <div className="mt-10 bg-white/10 backdrop-blur-xl p-2 rounded-3xl border border-white/30 max-w-2xl mx-auto flex flex-col sm:flex-row gap-2 shadow-2xl">
            <div className="flex-grow flex items-center px-6">
                <svg className="w-6 h-6 text-white/70 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <input type="text" placeholder="Where to next?" className="w-full bg-transparent text-white placeholder-white/70 py-4 outline-none text-lg font-medium" />
            </div>
            <Link to="/hotels" className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-slate-900 px-10 py-4 rounded-3xl font-bold transition shadow-lg flex items-center justify-center gap-2">
              Explore
            </Link>
          </div>
        </div>
      </div>

      <section className="bg-slate-900 py-20 text-white overflow-hidden relative">
        <div className="container mx-auto px-4 relative z-10">
           <div className="text-center max-w-3xl mx-auto mb-16">
               <h2 className="text-3xl md:text-5xl font-bold mb-6">Why Travel with Us?</h2>
               <p className="text-slate-400 text-lg">We curate experiences that stay with you forever.</p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[{ title: "Verified Listings", icon: "✅" }, { title: "Secure Payments", icon: "🔒" }, { title: "24/7 Support", icon: "📞" }, { title: "Best Price", icon: "🏷️" }].map((item, idx) => (
                  <div key={idx} className="bg-white/5 p-8 rounded-2xl border border-white/10">
                      <div className="text-4xl mb-4">{item.icon}</div>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  </div>
              ))}
           </div>
        </div>
      </section>
    </div>
  );

  // ============================================================
  // 👇 ලියාපදිංචි නොවූ අමුත්තන් සඳහා පෙන්වන කොටස (GUEST USER UI)
  // ============================================================
  const GuestUI = () => (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 mt-[-96px]">
      <div className="relative h-[650px] lg:h-[850px] flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0">
          {heroImages.map((imgUrl, index) => (
            <img key={index} src={imgUrl} className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ease-in-out ${index === currentImageIndex ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`} />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-slate-50"></div>
        </div>
        <div className="relative z-20 max-w-5xl w-full text-center text-white space-y-8 animate-fade-in-up px-2 md:px-0 mt-20">
          <div className="inline-block"><span className="uppercase tracking-[0.2em] text-xs md:text-sm font-bold bg-white/10 px-6 py-2 rounded-full backdrop-blur-md border border-white/20">The Pearl of the Indian Ocean </span></div>
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tight leading-[1.1]">Explore <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-500">Lak Travelers</span></h1>
          <p className="text-lg md:text-2xl text-slate-100 max-w-2xl mx-auto font-light">The all-in-one platform for luxury hotels, expert tour guides, and reliable vehicle rentals.</p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 px-10 py-4 rounded-2xl font-bold transition shadow-lg text-lg">Get Started Free</Link>
            <Link to="/hotels" className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-10 py-4 rounded-2xl font-bold border border-white/30 transition text-lg">View Listings</Link>
          </div>
        </div>
      </div>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">How to Join Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
            <div className="group"><div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 transition">1</div><h3 className="text-xl font-bold mb-3">Create Account</h3><p className="text-slate-500">Register as a Traveler or Vendor with your email.</p></div>
            <div className="group"><div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 transition">2</div><h3 className="text-xl font-bold mb-3">Verify Profile</h3><p className="text-slate-500">Submit details for admin approval to ensure safety.</p></div>
            <div className="group"><div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 transition">3</div><h3 className="text-xl font-bold mb-3">Start Exploring</h3><p className="text-slate-500">Book your dream stay or start listing properties.</p></div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="bg-slate-900 rounded-[3rem] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 text-white">
            <div className="flex-1 space-y-6"><span className="text-yellow-400 font-bold uppercase tracking-wider">Become a Partner</span><h2 className="text-3xl md:text-5xl font-bold leading-tight">Are you a Hotel Owner or a Tour Guide?</h2><p className="text-slate-400">Reach thousands of international tourists every month.</p><Link to="/register?role=vendor" className="inline-block bg-yellow-400 text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-yellow-500 transition">
  Register as Vendor
</Link></div>
            <div className="flex-1"><img src={i8} alt="Vendor" className="rounded-2xl shadow-2xl" /></div>
          </div>
        </div>
      </section>
    </div>
  );

  // ============================================================
  // 3. යූසර් ලොග් වී ඇත්දැයි බලා අදාළ UI එක පෙන්වීම
  // ============================================================
  return user ? <LoggedInUI /> : <GuestUI />;
};

export default Home;