const allowedOrigins = [
  "https://main--regal-pika-79db80.netlify.app",
  "https://main--regal-pika-79db80.netlify.app/",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg =
        "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
