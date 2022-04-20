const jwt = require('jsonwebtoken');

exports.verifyToken = async function(req, res, next) {
    //get auth header value
    const bearerHeader = req.headers['authorization'];
    //check if bearer is undefined
    if(typeof bearerHeader !== 'undefined') 
    {
        //split at the space
        const bearer = bearerHeader.split(' ');
        //get token from array
        const bearerToken = bearer[1];
        //set the token
        req.token = bearerToken;
        jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err) {
          next(err)
        }});
        //next middleware
        next();
    } 
    else 
    {
      //Forbidden
      res.status(401).send("Forbidden");
    }
}

