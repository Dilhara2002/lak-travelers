import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import html2pdf from "html2pdf.js";
import { toast } from 'react-toastify';

const SmartPlanner = () => {
    // 1. Initial State එක localStorage එකෙන් ලබා ගැනීම
    const [formData, setFormData] = useState(() => {
        const savedForm = localStorage.getItem("plannerForm");
        return savedForm ? JSON.parse(savedForm) : {
            location: "",
            duration: "",
            preferences: "",
            transportType: "Private",
        };
    });

    const [itinerary, setItinerary] = useState(() => {
        return localStorage.getItem("plannerResult") || "";
    });

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // 2. දත්ත වෙනස් වන විට ඒවා localStorage එකේ Save කිරීම
    useEffect(() => {
        localStorage.setItem("plannerForm", JSON.stringify(formData));
    }, [formData]);

    useEffect(() => {
        if (itinerary) {
            localStorage.setItem("plannerResult", itinerary);
        }
    }, [itinerary]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post("http://localhost:5001/api/ai/chat", {
                message: `I want to plan a ${formData.duration} day trip to ${formData.location}. 
                  My preferences are: ${formData.preferences}. 
                  I prefer ${formData.transportType} transport.
                  
                  CRITICAL INSTRUCTION: For every hotel, resort, or vehicle you recommend, you MUST include its Database ID at the end of the sentence like this: (ID: 24_CHARACTER_ID_HERE). 
                  Provide the itinerary in a HIGHLY VISUAL format with numbered lists and bold headings.`,
                history: []
            });
            setItinerary(data.reply);
            toast.success("Itinerary generated successfully! ✨");
        } catch (err) {
            console.error("AI Error:", err);
            toast.error("Failed to generate plan. Check server connection.");
        } finally {
            setLoading(false);
        }
    };

    // ✅ සැලසුම Database එකට Save කිරීම
    const handleSavePlan = async () => {
        const userInfoString = localStorage.getItem('userInfo');
        if (!userInfoString) {
            toast.warning("Please login to save your plan! 🔐");
            return;
        }

        const userInfo = JSON.parse(userInfoString);
        const token = userInfo?.token;

        if (!token) {
            toast.error("Session expired. Please login again.");
            return;
        }

        setSaving(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };
            
            await axios.post("http://localhost:5001/api/ai/save-plan", {
                location: formData.location,
                duration: formData.duration,
                preferences: formData.preferences,
                itinerary: itinerary
            }, config);
            
            toast.success("Plan saved to your profile! 💾🎉");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save plan.");
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        if (window.confirm("Are you sure you want to reset all data?")) {
            localStorage.removeItem("plannerForm");
            localStorage.removeItem("plannerResult");
            setFormData({ location: "", duration: "", preferences: "", transportType: "Private" });
            setItinerary("");
            toast.info("Planner reset successful.");
        }
    };

    // ✅ 🤖 Real-time Booking Logic (ID Detection & UI Enhancement)
    const MarkdownComponents = {
        p: ({ children }) => {
            const content = React.Children.toArray(children).join("");
            
            // MongoDB ID එකක් ඇත්දැයි බැලීම (24 characters hex)
            const idRegex = /([0-9a-fA-F]{24})/;
            const match = content.match(idRegex);

            if (match) {
                const id = match[1];
                const lowerContent = content.toLowerCase();
                
                // එය හෝටලයක් ද වාහනයක් ද යන්න තීරණය කිරීම
                const isHotel = lowerContent.includes('hotel') || lowerContent.includes('resort') || lowerContent.includes('stay') || lowerContent.includes('villa');
                const isVehicle = lowerContent.includes('vehicle') || lowerContent.includes('car') || lowerContent.includes('transport') || lowerContent.includes('van');

                return (
                    <div className="mb-8 p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                        <p className="mb-4 text-slate-700 leading-relaxed font-medium">
                            {/* ID එක පෙළෙන් ඉවත් කර පිරිසිදු පෙනුමක් සඳහා පෙන්වීම */}
                            {content.replace(`(ID: ${id})`, "").replace(`ID: ${id}`, "").replace(`(${id})`, "")}
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {isHotel && (
                                <Link to={`/hotels/${id}`} className="bg-orange-500 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all flex items-center gap-2 shadow-lg shadow-orange-200">
                                    🏨 Book This Hotel
                                </Link>
                            )}
                            {isVehicle && (
                                <Link to={`/vehicles/${id}`} className="bg-blue-600 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all flex items-center gap-2 shadow-lg shadow-blue-200">
                                    🚗 Rent This Vehicle
                                </Link>
                            )}
                        </div>
                    </div>
                );
            }
            return <p className="mb-6 leading-relaxed text-slate-600 font-medium">{children}</p>;
        }
    };

    const shareOnWhatsApp = () => {
        if (!itinerary) return;
        const title = `*🌴 My Sri Lankan Trip Plan - Lak Travelers* \n\n`;
        const details = `📍 *Destination:* ${formData.location} \n⏳ *Duration:* ${formData.duration} Days \n\n`;
        const message = encodeURIComponent(title + details + "Plan yours at: http://localhost:5173/smart-planner");
        window.open(`https://wa.me/?text=${message}`, "_blank");
    };

    const downloadPDF = () => {
        const element = document.getElementById('printable-pdf-area');
        element.style.display = 'block';
        const opt = {
            margin: [0.5, 0.5, 0.5, 0.5],
            filename: `LakTravelers_Itinerary_${formData.location || 'Plan'}.pdf`,
            image: { type: 'jpeg', quality: 1.0 },
            html2canvas: { scale: 3, useCORS: true, letterRendering: true },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        html2pdf().set(opt).from(element).save().then(() => {
            element.style.display = 'none';
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* HERO SECTION */}
            <div className="relative h-[400px] flex items-center justify-center overflow-hidden bg-slate-900">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://ml6tb8qifjjl.i.optimole.com/cb:qpCN.88a/w:1920/h:1247/q:mauto/f:best/https://www.technology-innovators.com/wp-content/uploads/2023/05/Smart-Tourism-Enhancing-Visitor-Experiences-and-Sustainable-Travel_13_11zon.jpg"
                        className="w-full h-full object-cover opacity-40 scale-105"
                        alt="Hero Background"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-slate-50 z-10"></div>
                </div>
                <div className="relative z-20 text-center space-y-4 px-6">
                    <h1 className="text-4xl md:text-7xl font-black text-white tracking-tight">Smart <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500">Planner</span></h1>
                    <p className="text-slate-200 text-sm md:text-xl font-light max-w-2xl mx-auto tracking-wide leading-relaxed">Your island journey architect, now with memory.</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 -mt-20 relative z-30 pb-20">
                <div className="grid lg:grid-cols-12 gap-10">

                    {/* INPUT PANEL */}
                    <div className="lg:col-span-4">
                        <div className="bg-white/90 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white shadow-2xl sticky top-28">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-black flex items-center gap-2">
                                    <span className="bg-yellow-400 p-2 rounded-xl text-lg shadow-sm">🖋️</span> Details
                                </h2>
                                <button onClick={handleReset} className="text-[10px] font-black text-red-500 uppercase hover:underline">Reset</button>
                            </div>
                            <form onSubmit={handleGenerate} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Destination</label>
                                    <input name="location" value={formData.location} placeholder="e.g. Ella" className="w-full p-4 bg-slate-100/50 rounded-2xl border-none font-bold text-sm focus:ring-2 focus:ring-orange-400 outline-none transition-all" onChange={handleChange} required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Duration (Days)</label>
                                    <input name="duration" type="number" value={formData.duration} placeholder="Days" className="w-full p-4 bg-slate-100/50 rounded-2xl border-none font-bold text-sm focus:ring-2 focus:ring-orange-400 outline-none transition-all" onChange={handleChange} required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Preferences</label>
                                    <textarea name="preferences" value={formData.preferences} placeholder="Vegan, Luxury, Hiking..." className="w-full p-4 bg-slate-100/50 rounded-2xl border-none font-bold h-28 text-sm focus:ring-2 focus:ring-orange-400 outline-none transition-all" onChange={handleChange}></textarea>
                                </div>
                                <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black shadow-xl hover:bg-orange-500 transition-all transform active:scale-95 disabled:bg-slate-300">
                                    {loading ? "AI is Thinking..." : "Create My Journey"}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* RESULT PANEL */}
                    <div className="lg:col-span-8">
                        {itinerary ? (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
                                <div className="bg-white p-10 md:p-14 rounded-[3.5rem] border border-white shadow-2xl relative overflow-hidden">
                                    <div className="relative z-10">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-slate-100">
                                            <h2 className="text-2xl font-black tracking-tight text-slate-800">Your Escape Plan</h2>
                                            <div className="flex flex-wrap gap-2">
                                                <button onClick={handleSavePlan} disabled={saving} className="bg-blue-600 text-white px-5 py-3 rounded-2xl text-[10px] font-black hover:bg-blue-700 transition shadow-lg disabled:bg-blue-300">
                                                    {saving ? "SAVING..." : "💾 SAVE"}
                                                </button>
                                                <button onClick={shareOnWhatsApp} className="bg-emerald-500 text-white px-5 py-3 rounded-2xl text-[10px] font-black hover:bg-emerald-600 transition shadow-lg">
                                                    💬 SHARE
                                                </button>
                                                <button onClick={downloadPDF} className="bg-slate-900 text-white px-5 py-3 rounded-2xl text-[10px] font-black hover:bg-orange-500 transition shadow-lg">
                                                    📄 PDF
                                                </button>
                                            </div>
                                        </div>
                                        <div className="prose prose-slate max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-p:font-medium prose-p:text-slate-600 prose-li:font-bold prose-img:rounded-[2rem] prose-img:shadow-lg leading-relaxed">
                                            {/* ✅ Custom Components භාවිතා කිරීම */}
                                            <ReactMarkdown components={MarkdownComponents}>{itinerary}</ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white/40 backdrop-blur-md border-2 border-dashed border-slate-200 h-[500px] rounded-[3rem] flex flex-col items-center justify-center text-center p-10 shadow-inner">
                                <span className="text-5xl mb-6 animate-bounce">✨</span>
                                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Your island plan starts here</h3>
                                <p className="text-slate-400 mt-2 font-medium">Fill in the details to generate a custom itinerary.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- 📄 PROFESSIONAL HIDDEN PDF TEMPLATE --- */}
            <div id="printable-pdf-area" style={{ display: 'none', padding: '50px', backgroundColor: 'white' }}>
                <div style={{ borderBottom: '5px solid #f97316', paddingBottom: '20px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '36px', fontWeight: '900', color: '#1e293b' }}>LAK TRAVELERS</h1>
                        <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px' }}>Personalized Island Itinerary</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: 0, fontSize: '12px', fontWeight: 'bold' }}>DATE: {new Date().toLocaleDateString()}</p>
                        <p style={{ margin: 0, fontSize: '10px', color: '#cbd5e1' }}>PLAN ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                    </div>
                </div>
                
                <div style={{ backgroundColor: '#f8fafc', padding: '25px', borderRadius: '20px', marginBottom: '35px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '20px', color: '#0f172a', fontWeight: '900' }}>TRIP TO {formData.location?.toUpperCase()}</h3>
                    <p style={{ margin: 0, fontSize: '14px', color: '#64748b', fontWeight: 'bold' }}>DURATION: {formData.duration} Days | TYPE: {formData.transportType} Transport</p>
                    <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>Notes: {formData.preferences || 'General exploration'}</p>
                </div>

                <div className="pdf-markdown-content" style={{ color: '#334155', lineHeight: '1.8', fontSize: '14px' }}>
                    <ReactMarkdown>{itinerary}</ReactMarkdown>
                </div>

                <div style={{ marginTop: '60px', paddingTop: '25px', borderTop: '2px solid #f1f5f9', textAlign: 'center' }}>
                    <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e293b' }}>LAK TRAVELERS SMART PLANNER AI</p>
                    <p style={{ fontSize: '10px', color: '#94a3b8', marginTop: '5px' }}>Explore the beauty of Sri Lanka with our intelligent planning system. | www.laktravelers.lk</p>
                </div>
            </div>
        </div>
    );
};

export default SmartPlanner;