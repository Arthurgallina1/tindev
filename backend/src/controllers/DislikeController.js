const Dev = require('../models/Dev');
module.exports = {
    async store(req, res){
        // console.log(req.params.devId);
        // console.log(req.headers.user)
        //stores new likes. params: Dev that liked (user) and dev being liked (devId)
        const { devId } = req.params;
        const { user } = req.headers;
        
        const loggedDev = await Dev.findById(user);
        const targetDev = await Dev.findById(devId);

        //check if dev exists
        if (!targetDev) {
            return res.status(400).json({ error: 'Dev not exists' })
        }

        loggedDev.dislikes.push(targetDev._id);
        await loggedDev.save();

        return res.json(loggedDev);

    }
}