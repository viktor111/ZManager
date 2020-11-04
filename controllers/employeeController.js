const DbContext = require('../config/dbContext');
const AuthService = require('../services/AuthService')


const AddEmployee = (req, res) => {
    let dbContext = new DbContext().Initialize("employee");

    dbContext.add({
        
    })
}