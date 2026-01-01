import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  // ආරම්භක මුදල් ඒකකය LKR ලෙස සකසා ඇත
  const [currency, setCurrency] = useState('LKR');
  
  // මුලින්ම පෙන්වීමට default rates කිහිපයක් (API එක load වන තෙක්)
  const [rates, setRates] = useState({ LKR: 1, USD: 0.0033, EUR: 0.0031 });

  // ✅ Navbar එකේ පෙන්වීමට අවශ්‍ය කොඩි (Flags) URL මෙහි ඇතුළත් වේ
  const flags = {
    LKR: "https://flagcdn.com/w40/lk.png",
    USD: "https://flagcdn.com/w40/us.png",
    EUR: "https://flagcdn.com/w40/eu.png"
  };

  /**
   * සැබෑ කාලීන (Real-time) විදේශ විනිමය අනුපාත ලබා ගැනීම
   */
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await axios.get('https://open.er-api.com/v6/latest/LKR');
        if (res.data && res.data.rates) {
          setRates(res.data.rates);
        }
      } catch (err) {
        console.error("Currency fetch failed:", err);
      }
    };
    fetchRates();
  }, []);

  /**
   * 💰 ඕනෑම LKR මිලක් තෝරාගත් මුදල් ඒකකයට පරිවර්තනය කර Format කරන Function එක
   */
  const formatPrice = (lkrAmount) => {
    if (!lkrAmount) return "Rs. 0";
    
    const converted = lkrAmount * (rates[currency] || 1);
    
    // මුදල් ඒකකයට අදාළ සංකේතය (Symbol) තේරීම
    const symbol = currency === 'LKR' ? 'Rs.' : currency === 'USD' ? '$' : '€';
    
    // දශමස්ථාන රහිතව (හෝ අවශ්‍ය නම් පමණක් දශමස්ථාන සහිතව) පෙන්වීම
    return `${symbol} ${converted.toLocaleString(undefined, { 
      maximumFractionDigits: 0 
    })}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, flags }}>
      {children}
    </CurrencyContext.Provider>
  );
};

// පහසුවෙන් භාවිතා කිරීමට Custom Hook එකක්
export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};