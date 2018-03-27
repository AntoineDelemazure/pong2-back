/**
 * @file Fichier contenant toutes les routes de l'application
 */

const api = require('../api/api');
const jwt = require('jsonwebtoken'); // La librairie qui permet de générer des tokens

/**
 * Envoie les routes et fonctions liées au routeur
 * @param {object} router - Routeur express
 */
exports.doRouting = function(router) {
    router.get('/players', api.fetchPlayers);
    router.get('/players/:id', api.fetchPlayer);
    router.post('/signup', api.sendNewPlayer);
    router.post('/signin', api.authenticate);

    /*
    Verification du token, les routes définies après cette fonction sont soumises à ce traitement
    */
    router.use(function(req, res, next){
        const token = req.body.token || req.headers['token']
        if(token){
            jwt.verify(token, process.env.SECRET,function(err, decoded) {
                if (err) {
                    return res.status(403).json({error: 'Failed to authenticate token.'});
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    console.log(decoded)
                    next();
                }});
        }else{
            return res.status(403).json({error: 'No token provided'});
        }
    });

    // router.get('/tournaments', api.fetchTournaments);
    // router.post('/tournaments', api.createNewTournament);
    // router.get('/tournaments/:id', api.fetchTournament);
    // router.put('/tournaments/:id/open', api.openTournament);
    // router.put('/tournaments/:id/start', api.startTournament);
    // router.put('/tournaments/:id/close', api.closeTournanment);
    // router.put('/tournaments/:id/assign', api.assignJudgeToTournament);
    // router.put('/tournaments/:id/finish', api.finishTournament);
    // router.put('/tournaments/:id/nextround', api.nextRoundTournament);
    // router.get('/tournaments/:id_t/matches', api.fetchTournamentMatches);
    // router.put('/tournaments/:id_t/matches/:id_m', api.fetchTournamentMatch);
    // router.get('/tournaments/players', api.fetchPlayers);
    // router.post('/tournaments/players', api.enrollNewPlayer);
    // router.delete('/tournaments/players', api.excludePlayer);
    
};