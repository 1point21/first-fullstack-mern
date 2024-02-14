const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

// --- HELPER FUNCTION ---
// takes message and filename and writes new log to file
const logEvents = async (message, logFileName) => {
  // new datetime variable in correct format
  const dateTime = format(new Date(), "yyyyMMdd\tHH:mm:ss");

  // new log item with date, time, unique id, message
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  try {
    // check if dir exists and if not create
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    // append logFileName
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logFileName),
      logItem
    );
  } catch (err) {
    console.log(err);
  }
};

// create middleware function
const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, "reqLog.log");
  console.log(`${req.method} ${req.path}`);
  next();

  //TODO need some conditions in here to filter out logs!
};

module.exports = { logEvents, logger };
