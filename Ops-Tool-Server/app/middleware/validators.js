module.exports = {
    validateExcel: function(req, res, next) {
      if (!req.file.filename) {
        res.statusCode = 400;
        return res.json({
          errors: ['File failed to upload']
        });
      }
    
      req.checkBody('frameworkId', 'Invalid framework ID').notEmpty();
      req.checkBody('channelId', 'Invalid channel ID').notEmpty();
      req.checkBody('userId', 'Invalid user ID').notEmpty();
    
      var errors = req.validationErrors();
      if (errors) {
        var response = { errors: [] };
        errors.forEach(function(err) {
          response.errors.push(err.msg);
        });
    
        res.statusCode = 400;
        return res.json(response);
      }
    
      return next();
    }
  }