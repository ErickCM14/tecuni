class Controller {
    constructor() { }

    sendResponse(res, message = "", data = null, success = true, status = 200) {
        let response = {
            success,
            message
        };
        if (data) {
            response['data'] = data;
        }
        res.status(status).json(response);
    }

    sendError(res, message = "Something went wrong", status = 500, data = null) {
        let response = {
            success: false,
            message
        };
        if (data) {
            response['data'] = data;
        }
        res.status(status).json(response);
    }
}

module.exports = Controller;