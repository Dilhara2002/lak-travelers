import path from 'path';
import express from 'express';
import multer from 'multer';

const router = express.Router();

// 1. පින්තූරය Save වෙන තැන සහ නම හදන හැටි
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // 'uploads' ෆෝල්ඩර් එකට දාන්න
  },
  filename(req, file, cb) {
    // ෆයිල් එකට අලුත් නමක් දෙනවා (වෙලාව + extension එක)
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
    cb('Images only!'); // පින්තූර නෙවෙයි නම් Error එකක්
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
  // Frontend එකට පින්තූරයේ Path එක ආපහු යවනවා
  res.send(`/${req.file.path}`);
});

export default router;