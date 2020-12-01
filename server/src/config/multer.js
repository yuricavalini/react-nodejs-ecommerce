const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  storage: multer.diskStorage({
    destination: path.join(__dirname, '..', '..', 'uploads'),
    filename: (req, file, cb) => {
      cb(null, `${uuidv4()}-${file.originalname}`);
    },
  }),
  limits: {
    fileSize: 4 * 1024 * 1024,
    files: 15,
  },
  fileFilter: (req, file, cb) => {
    const mimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];

    if (!mimeTypes.includes(file.mimetype)) {
      return cb(null, false);
    }

    return cb(null, true);
  },
};
