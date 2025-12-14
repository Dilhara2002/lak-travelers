// වැරදි URL එකක් ගැහුවොත් (404 Not Found)
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// අනිත් හැම Error එකක්ම handle කරන function එක
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // MongoDB වල ID එක වැරදි නම් (CastError)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found';
  }

  res.status(statusCode).json({
    message: message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

// ⚠️ මේ පේළිය අනිවාර්යයෙන්ම තියෙන්න ඕනේ!
export { notFound, errorHandler };