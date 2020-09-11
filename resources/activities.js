const Activity = require('../models/activity');
const activityPerPage = require('../utils/config').activityPerPage;

async function get(req, res, next) {
    let page;

    req.query.page ? page = Number(req.query.page) : page = 1;
    const start = (page - 1) * activityPerPage;
    const limit = page * activityPerPage;

    try {
        const activities = await Activity.get(req.user._id, start, limit);
        const total = await Activity.count(req.user._id);
        res.status(200).json({
            data:{
                activities:activities,
                totalActivities:total
            }
        })
    }
    catch(error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        return next(error);
    }

}

exports.get = get;