
module.exports = function(err, req, res, next) 
{
   if (err.message.indexOf('Cast to ObjectId failed') !== -1)
    {
        const statusCode = 404;
        res.status(statusCode).json({
            StatusCode: statusCode,
            message: 'Invalid ID'
        })
    }
    
    else if (err.isJoi === true)
    {
        const statusCode = 422;
        res.status(statusCode).json({
            StatusCode: statusCode,
            message: err.message
        })
    }

    else
    {
        const statusCode = err.statusCode || 500;
        res.status(statusCode).json({
        StatusCode: statusCode,
        message: err.message
        })
    }
};

