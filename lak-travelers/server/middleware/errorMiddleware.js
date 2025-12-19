/**
 * @desc    පවතින Route එකක් නොවන URL එකක් සඳහා 404 Error එකක් ලබා දීම
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // මෙහි 'next' හරහා දෝෂය පහත ඇති errorHandler වෙත යොමු කරයි
};

/**
 * @desc    සියලුම දෝෂ (Errors) පාලනය කිරීම සහ පරිශීලකයාට පණිවිඩයක් ලබා දීම
 * @important Express විසින් මෙය Error Middleware එකක් ලෙස හඳුනා ගැනීමට (err, req, res, next) යන පරාමිතීන් 4ම අනිවාර්යයෙන්ම තිබිය යුතුය.
 */
const errorHandler = (err, req, res, next) => {
  // වර්තමාන Status code එක 200 (Success) නම් එය 500 (Internal Server Error) ලෙස සලකයි
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // MongoDB ObjectId එක වැරදි ලෙස ලැබුණහොත් (CastError) එය 404 ලෙස සලකයි
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found';
  }

  // සර්වර් එකේ Debugging සඳහා දෝෂය Console එකේ පෙන්වීම
  console.error(`🚨 Backend Error (${statusCode}): ${message}`);
  console.error(err.stack); // Full error stack ද බලන්න

  // දෝෂය JSON එකක් ලෙස Frontend එකට යැවීම
  res.status(statusCode).json({
    success: false,
    message: message,
    // Production (Vercel) හිදී ආරක්ෂාව සඳහා stack trace එක සඟවයි
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export { notFound, errorHandler };