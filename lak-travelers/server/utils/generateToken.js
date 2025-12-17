import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  // 👇 Vercel පරිසරයක Cookies වැඩ කිරීමට මෙම සැකසුම් අනිවාර්ය වේ
  res.cookie('jwt', token, {
    httpOnly: true, // JavaScript මගින් Cookie එක කියවීම වැළැක්වීමට
    secure: true,   // HTTPS හරහා පමණක් යැවීමට (Vercel සඳහා අනිවාර්යයි)
    sameSite: 'none', // Cross-domain Cookies හඳුනා ගැනීමට (අනිවාර්යයි)
    maxAge: 30 * 24 * 60 * 60 * 1000, 
    path: '/',      // මුළු වෙබ් අඩවියේම Cookie එක වැඩ කිරීමට
  });
};

export default generateToken;