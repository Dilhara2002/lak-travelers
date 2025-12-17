import path from 'path';
import express from 'express';
import multer from 'multer';

const router = express.Router();

// 1. පින්තූරය Save වෙන තැන (Vercel Fix)
const storage = multer.diskStorage({
  destination(req, file, cb) {
    // 👇 වෙනස: 'uploads/' වෙනුවට '/tmp' භාවිතා කරන්න.
    // Vercel එකේදී අපිට ලියන්න පුළුවන් '/tmp' ෆෝල්ඩර් එකට විතරයි.
    cb(null, '/tmp'); 
  },
  filename(req, file, cb) {
    // ෆයිල් එකට අලුත් නමක් දෙනවා
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// 2. ෆයිල් එක පින්තූරයක්ද කියලා බලන Function එක
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!');
  }
}

// 3. Upload Middleware එක
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// 4. Upload Route එක
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  // Frontend එකට පින්තූරයේ Path එක ආපහු යවනවා
  // Vercel එකේදි මෙය තාවකාලික විසඳුමක් පමණි.
  // හරියටම පින්තූර පෙන්වන්න නම් අපි Cloudinary භාවිතා කළ යුතුයි.
  res.send(`/uploads/${req.file.filename}`);
});

export default router;