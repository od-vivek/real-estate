const errorHandling = (statusCode, message) => {
    const error = new Error();
    error.statusCode = statusCode;
    error.message = message;

    return error; // Return the error object, not 'err'
}

module.exports = errorHandling;
