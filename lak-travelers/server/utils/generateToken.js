import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  // Vercel (Production) සහ Localhost (Development) දෙකටම ගැලපෙන විදියට Cookie Settings
  // Production හිදී Secure: true සහ SameSite: none අනිවාර්ය වේ.
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development', // Production එකේදී True වෙයි
    sameSite: process.env.NODE_ENV !== 'development' ? 'none' : 'strict', // Cross-site සඳහා 'none'
    maxAge: 30 * 24 * 60 * 60 * 1000, // දවස් 30
  });
};

export default generateToken;