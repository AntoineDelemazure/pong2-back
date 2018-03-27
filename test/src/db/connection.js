
const p_request = require('../../../src/db/player_request');

describe('Test de la connexion', () => {

    let connection;
    let player;

    before((done) => {
        connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'ping_db'
        });

        player = {
            lastname  : "Abitbol",
            firstname : "Georges",
            rank      : 1,
            email     : "laclasse@incarne.com",
            username  : "LHommeLePlusClasseDuMonde",
            password  : "1234",
            admin     : 1
        };

        p_request.createNewPlayer(player, (error, result) => {
            if (error) {
                done(new Error('Erreur création joueur; interruption'));
            }
            done();
        });
    });

    //TODO : tests de la connexion, avec nock ?

    after((done) => {
        p_request.deletePlayer(player.username, function(error, rows){
            if (error) {
                done(new Error('Erreur suppression joueur'));
            }
            done();
        });
    });

});