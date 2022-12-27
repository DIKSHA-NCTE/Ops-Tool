var multer = require('multer');
var path = require('path');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    var extension = path.extname(file.originalname);
    var filePath = path.basename(file.originalname,extension);
    var id = filePath +'_'+ Date.now() + extension;
    cb(null,id);
  }
});

var upload = multer({
  storage: storage,
  limits: {
    files: 1,
    fileSize: 1 * 1024 * 1024 // 1mb, in bytes
  }
});

module.exports = upload;