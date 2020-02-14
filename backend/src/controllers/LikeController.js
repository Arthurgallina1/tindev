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
        // console.log(req.io, req.connectedUsers);
        
        //check if there's a match
        if (targetDev.likes.includes(loggedDev._id)){
            loggedDev.matches.push(targetDev._id);
            const loggedSocket = req.connectedUsers[user];
            const targetSocket = req.connectedUsers[devId];

            if(loggedSocket){
                req.io.to(loggedSocket).emit('match', targetDev);
            }
            if(targetSocket){
                req.io.to(targetSocket).emit('match', loggedDev);
            }
            
        }


        loggedDev.likes.push(targetDev._id);
        await loggedDev.save();

        return res.json(loggedDev);

    }
}