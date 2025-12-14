import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  // Token එක හදනවා (UserId එක ඇතුළත් කරලා)
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d', // දවස් 30ක් වලංගුයි
  });

  // Token එක HTTP-Only Cookie එකක් විදියට save කරනවා (වැඩි ආරක්ෂාවට)
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development', // Production එකේදි විතරක් secure (https)
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // දවස් 30 milliseconds වලින්
  });
};

export default generateToken;