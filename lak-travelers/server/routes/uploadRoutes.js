import path from 'path';
import express from 'express';
import multer from 'multer';

const router = express.Router();

// 1. Storage සැකසුම
const storage = multer.diskStorage({
  destination(req, file, cb) {
    // Vercel හිදී ස්ථිරවම ගොනු ගබඩා කළ නොහැක. 
    // දේශීයව (Local) වැඩ කරන විට 'uploads/' භාවිතා කරන්න. 
    // Vercel වලදී පමණක් '/tmp' භාවිතා කරන්න.
    cb(null, process.env.NODE_ENV === 'production' ? '/tmp' : 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// 2. File Type එක පරීක්ෂා කිරීම
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp/; // webp ද ඇතුළත් කළා
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only (jpg, jpeg, png, webp)!'));
  }
}

// 3. Multer Middleware
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// 4. POST Route - තනි පින්තූරයක් Upload කිරීම
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  // Frontend එකට URL එක යැවීම
  // සටහන: Vercel හිදී ස්ථිර පින්තූර ගබඩාවකට (Cloudinary) මාරු වීම අනිවාර්ය වේ.
  res.send({
    message: 'Image uploaded successfully',
    image: `/${req.file.path}`, 
  });
});

export default router;