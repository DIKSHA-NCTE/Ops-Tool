module.exports = async function (req, res, next) {
  const { sessionStore } = req;
  const sessionData = await new Promise((resolve, reject) => {
    sessionStore.get(req.sessionID, (err, sessionData) => {
      if (err) {
        reject(null);
      }

      resolve(sessionData);
    });
  });

  if (!sessionData || !sessionData["keycloak-token"]) {
    res.statusCode = 401;
    res.setHeader("Content-Type", "application/json");
    res.json({
      statusCode: 401,
      error: "Session Expired",
      message: "Please log in again.",
      response: { session: "expired" },
    });
  } else {
    next();
  }
};
