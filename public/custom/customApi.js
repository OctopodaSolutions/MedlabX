// Example of custom backend API
const BaseController = require('../skeleton/baseController');

class CustomApi extends BaseController {
    getCustomData(req, res) {
        this.logMessage('Fetching custom data...');
        res.json({ data: 'This is custom plugin data' });
    }
}

module.exports = CustomApi;