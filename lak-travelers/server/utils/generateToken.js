import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  // 👇 මෙම සැකසුම් (Settings) ඉතා වැදගත් වේ
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: true,        // 👈 HTTPS හරහා පමණක් යැවීමට (Vercel සඳහා අනිවාර්යයි)
    sameSite: 'none',    // 👈 Domain දෙකක් අතර Cookies හුවමාරුවට (අනිවාර්යයි)
    maxAge: 30 * 24 * 60 * 60 * 1000, 
    path: '/',           // මුළු සයිට් එකේම Cookie එක වැඩ කිරීමට
  });
};

export default generateToken;