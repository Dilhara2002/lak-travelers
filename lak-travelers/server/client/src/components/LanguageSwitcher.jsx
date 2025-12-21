import React, { useEffect, useState, useRef } from "react";

const LanguageSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Google Translate Initialize කිරීම
    if (!window.googleTranslateElementInit) {
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          "google_translate_element"
        );
      };

      const addScript = document.createElement("script");
      addScript.setAttribute(
        "src",
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      );
      document.body.appendChild(addScript);
    }

    // මෙනුවෙන් පිටත ක්ලික් කළහොත් මෙනුව වසා දැමීමට
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* 🌐 LANGUAGE Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-[11px] font-black text-gray-700 hover:bg-white hover:shadow-md transition-all duration-300 focus:outline-none uppercase tracking-widest"
      >
        <span>🌐 LANGUAGE</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={3}
          stroke="currentColor"
          className={`w-3 h-3 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {/* Dropdown Menu - බටන් එක ක්ලික් කළ විට පමණක් පෙන්වයි */}
      <div
        className={`absolute right-0 z-[9999] mt-3 min-w-[240px] origin-top-right rounded-2xl border border-gray-100 bg-white p-5 shadow-2xl transition-all duration-300 ${
          isOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-2 invisible"
        }`}
      >
        <p className="text-[10px] font-black text-blue-600 uppercase mb-3 tracking-widest px-1">
          Select Your Language
        </p>
        
        {/* Google dropdown එක පෙන්වන ස්ථානය */}
        <div id="google_translate_element" className="custom-google-box"></div>
      </div>
    </div>
  );
};

export default LanguageSwitcher;