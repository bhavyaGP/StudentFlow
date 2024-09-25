// const {   getResultStatus } = require('./resultStatus');
const {getResultStatus}=require('../controllers/manageresult.js')

const checkResultDeclared = (req, res, next) => {
  if (getResultStatus()) {
    next(); // Result is declared, proceed to the next middleware/route handler
  } else {
    res.status(403).json({ message: 'Result has not been declared yet' });
  }
};

module.exports = checkResultDeclared;