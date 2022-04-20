const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");

const advanceFunctionality = (model, populate) => async (req, res, next) => {

    if(model===Course)
    {
        //Sort and Select Functionality
        let Query = {};
        let mycourse = await model.find({ bootcamp_id: req.params.id, Query })
        .populate('bootcamp_id', 'name')
        .select('code title duration courseFee')
        .sort({ createdAt: -1 });

        //Pagination Functionality
        let page = parseInt(req.query.page);
        let limit = parseInt(req.query.limit);
        if(!page && !limit)
        {
            page=1;
            limit=10;
        }
        const startIndex = (page-1) * limit;
        const endIndex = page * limit;
        const result = mycourse.slice(startIndex, endIndex);
    
        //Displaying Result
        return res.status(200).send({
        message: "Successful",
        data:result
        });
    }

    if(model===Bootcamp)
    {
        //Sort and Select Functionality
        let Query1 = {};
        const mybootcamp = await model.find(Query1)
        .select('name')
        .sort({ createdAt: -1 });

        //Pagination Functionality
        let page = parseInt(req.query.page);
        let limit = parseInt(req.query.limit);
        if(!page && !limit)
        {
            page=1;
            limit=10;
        }
        const startIndex = (page-1) * limit;
        const endIndex = page * limit;
        const result1 = mybootcamp.slice(startIndex, endIndex);
    
        //Displaying Result
        return res.status(200).send({
        message: "Successful",
        data:result1
        });
    }
    next();
};
  
module.exports = advanceFunctionality;

