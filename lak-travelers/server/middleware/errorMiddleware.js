/**
 * @desc    පවතින Route එකක් නොවන URL එකක් සඳහා 404 Error එකක් ලබා දීම
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * @desc    සියලුම දෝෂ (Errors) පාලනය කිරීම සහ පරිශීලකයාට පණිවිඩයක් ලබා දීම
 */
const errorHandler = (err, req, res, next) => {
  // වර්තමාන Status code එක 200 නම් එය 500 (Internal Server Error) ලෙස සලකයි
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // MongoDB ObjectId එක වැරදි ලෙස ලැබුණහොත් එය 404 ලෙස සලකයි
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found';
  }

  // දෝෂය Console එකේ පෙන්වීම (Debugging සඳහා වැදගත් වේ)
  console.error(`Error (${statusCode}): ${message}`);

  res.status(statusCode).json({
    message: message,
    // Production (Vercel) හිදී stack trace එක සඟවයි (ආරක්ෂාව සඳහා)
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export { notFound, errorHandler };