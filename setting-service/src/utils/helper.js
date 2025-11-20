class Helper {
    returnResponse = (success = true, message = "Success", status = 404) => {
        return { success, message, status };
    };
}

module.exports = Helper;
