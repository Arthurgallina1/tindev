const express = require('express');
const routes = express.Router();
const DevController = require('./controllers/DevController');
const LikeController = require('./controllers/LikeController');
const DislikeController = require('./controllers/DislikeController');
const MatchesController = require('./controllers/MatchesController');


// routes.get('/', (req, res) => {
//     return res.json({ message: `sss ${req.query.name}`})
// });

routes.get('/devs', DevController.index);
routes.get('/devs/:id', DevController.show);
routes.get('/matches/:user', MatchesController.index);
routes.post('/devs', DevController.store);
routes.post('/devs/:devId/likes', LikeController.store);
routes.post('/devs/:devId/dislikes', DislikeController.store);

module.exports = routes;