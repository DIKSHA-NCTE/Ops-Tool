const express = require('express'),
  fs = require('fs'),
  request = require('request'),
  compression = require('compression'),
  MobileDetect = require('mobile-detect'),
  _ = require('lodash'),
  path = require('path'),
  envHelper = require('../helpers/environmentVariablesHelper'),
  oneDayMS = 86400000,
  pathMap = {},
  cdnIndexFileExist = "";

const setZipConfig = (req, res, type, encoding, dist = '../../../') => {
  if (pathMap[req.path + type] && pathMap[req.path + type] === 'notExist') {
    return false;
  }
  if (pathMap[req.path + '.' + type] === 'exist' ||
    fs.existsSync(path.join(__dirname, dist) + req.path + '.' + type)) {
    if (req.path.endsWith('.css')) {
      res.set('Content-Type', 'text/css');
    } else if (req.path.endsWith('.js')) {
      res.set('Content-Type', 'text/javascript');
    }
    req.url = req.url + '.' + type;
    res.set('Content-Encoding', encoding);
    pathMap[req.path + type] = 'exist';
    return true
  } else {
    pathMap[req.path + type] = 'notExist';
    logger.info({
      msg: 'zip file not exist',
      additionalInfo: {
        url: req.url,
        type: type
      }
    })
    return false;
  }
}

module.exports = (app, keycloak, isEmailDomainAllowed) => {
  app.set('view engine', 'ejs')

  app.get(['*.js', '*.css'], (req, res, next) => {
    res.setHeader('Cache-Control', 'public, max-age=' + oneDayMS * 30)
    res.setHeader('Expires', new Date(Date.now() + oneDayMS * 30).toUTCString())
    if (req.get('Accept-Encoding') && req.get('Accept-Encoding').includes('br')) { // send br files
      if (!setZipConfig(req, res, 'br', 'br') && req.get('Accept-Encoding').includes('gzip')) {
        setZipConfig(req, res, 'gz', 'gzip') // send gzip if br file not found
      }
    } else if (req.get('Accept-Encoding') && req.get('Accept-Encoding').includes('gzip')) {
      setZipConfig(req, res, 'gz', 'gzip')
    }
    next();
  });

  app.get(['/dist/*.ttf', '/dist/*.woff2', '/dist/*.woff', '/dist/*.eot', '/dist/*.svg',
    '/*.ttf', '/*.woff2', '/*.woff', '/*.eot', '/*.svg', '/*.html'], compression(),
    (req, res, next) => {
      res.setHeader('Cache-Control', 'public, max-age=' + oneDayMS * 30)
      res.setHeader('Expires', new Date(Date.now() + oneDayMS * 30).toUTCString())
      next()
    })

  app.use(express.static(path.join(__dirname, '../../../Ops-Tool-Client/dist/ops-tool-client'), { extensions: ['ejs'], index: false }))

  app.use('/dist', express.static(path.join(__dirname, '../../../Ops-Tool-Client/dist/ops-tool-client'), { extensions: ['ejs'], index: false }))

  app.get('/assets/images/*', (req, res, next) => {
    res.setHeader('Cache-Control', 'public, max-age=' + oneDayMS)
    res.setHeader('Expires', new Date(Date.now() + oneDayMS).toUTCString())
    next()
  })

  app.all(['/dashboard', '/certificates/list', '/certificates/user', '/certificates/course', '/contents/list', '/contents/bulk-upload', '/forms', '/framework', '/framework/list', '/framework/extract',
  '/organizations', '/organizations/list', '/organizations/create', '/organizations/update', '/reports/list', '/reports/course', '/reports/self-signup-user', '/reports', '/reports/course', '/reports/self-signup-users', 
    '/users', '/users/list', '/users/create', '/users/update', '/users/roleAssign', '/users/locationUpdate', '/users/blockunblock', '/users/bulk-upload/list', 
    '/users/bulk-upload/upload', '/users/bulk-upload/upload-status', '/users/bulk-upload/batch-upload-list', '/contents/bulk-upload/list', '/contents/bulk-upload/upload', 
    '/contents/bulk-upload/upload-status', '/contents/bulk-upload/batch-upload-list', '/contents/broadcast/list', '/contents/broadcast/upload', '/contents/broadcast/upload-status', 
    '/contents/broadcast/batch-upload-list', '/course-certificates/list', '/admin/configurations/list', '/admin/constants/list', '/admin/modules/list', '/admin/support-users/list',
    '/contents/shallow-copy/list', '/contents/shallow-copy/upload', '/contents/shallow-copy/upload-status', '/contents/shallow-copy/batch-upload-list',
  '/subrole', '/forms/list'],

    keycloak.protect(isEmailDomainAllowed), async (req, res) => {

      const { session, sessionStore } = req;
      const sessionData = await new Promise((resolve, reject) => {
        sessionStore.get(req.sessionID, (err, sessionData) => {
          if (err) {
            reject(null);
          }

          resolve(sessionData);
        });
      });

      if (JSON.parse(sessionData['keycloak-token'])['access_token']) {
        res.cookie("c_on", Date.now());
        res.cookie("expires_in", JSON.parse(sessionData['keycloak-token'])['expires_in']);
        res.cookie("auth", JSON.parse(sessionData['keycloak-token'])['access_token']);
        res.cookie("uid", session.userId);
        res.cookie("refresh_token", session.refresh_token);
        res.render(path.join(__dirname, '../../../Ops-Tool-Client/dist/ops-tool-client', 'index.ejs'))
      } else {

      }

    });

}

const indexPage = (loggedInRoute) => {
  return async (req, res) => {
    let session = req.session;
    if (JSON.parse(session['keycloak-token'])['access_token']) {
      res.cookie("auth", JSON.parse(session['keycloak-token'])['access_token']);
      renderDefaultIndexPage(req, res);
    } else {

    }

  }
};

const renderDefaultIndexPage = (req, res) => {
  res.render(path.join(__dirname, '../../../Ops-Tool-Client/dist/ops-tool-client', 'index.ejs'))
};