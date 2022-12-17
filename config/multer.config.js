const multer = require('multer');
const path   = require('path');

// File upload config
// ----------------------------------------------------------------------------

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (!['.png', '.jpg', '.jpeg'].includes(path.extname(file.originalname))) {
      return cb(new Error('Only images are allowed'));
    }

    cb(null, true);
  },

  limits: {
    fileSize: 1024 * 1024,
  },
});

module.exports = upload;
