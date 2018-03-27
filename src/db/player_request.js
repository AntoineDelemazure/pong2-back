/**
 * @file Le "répertoire" des requêtes en relation avec la table player
 * Les fonctions "query" étant asynchrones, elles prennent en paramètre un callback, fonction qui s'occupera du traitement du résulat
 * (dans le contexte, l'envoyer par exemple)
 */

const db = require('./db.js');
const winston = require('winston');
const crypt = require('../utils/crypt');


/**
 * Recupération d'un joueur par son id
 * @param {number} id - id du joueur recherché
 * @param {function} callback - fonction qui traitera les données retournées
 */
exports.getPlayerByID = function(id, callback){
    db.Connection.getInstance().query('SELECT * FROM p_players WHERE player_id = '+ id, function(err, rows) {
        if (err) {
            winston.log('error', `Récupération d'un joueur : ${err.message}`);
            callback(err);
        }
        winston.log('info', "Récupération d'un joueur");
        if (rows.length) {
            //TODO : tableau nécessaire ?
            callback(null,
                [{
                    lastname: rows[0].player_lastname,
                    firstname: rows[0].player_firstname,
                    rank: rows[0].player_rank,
                    email: rows[0].player_email,
                    username: rows[0].player_username,
                    admin: rows[0].player_admin
                }]
            );
        } else {
            callback(null, []);
        }
    });
};

/**
 * Recupération du mot de passe d'un joueur par son username (pour l'authentification)
 * @param {string} username - username du joueur recherché
 * @param {function} callback - fonction qui traitera les données retournées
 */
exports.getPlayerPasswordByUsername = function(username, callback){
    db.Connection.getInstance().query('SELECT player_password, player_salt FROM p_players WHERE p_players.player_username = "'+ username +'"', function(err, rows) {
        if (err) {
            winston.log('error', `Récupération du mot de passe d'un joueur : ${err.message}`);
            callback(err);
        }
        winston.log("info", "Récupération du mot de passe d'un joueur");
        if (rows.length) {
            callback(null,
                [{
                    password: rows.player_password,
                    salt: rows.player_salt
                }]
            );
        } else {
            callback(null, []);
        }
    });
};

/**
 * Recupération d'un joueur par son username (pour l'authentification)
 * @param {string} username - username du joueur recherché
 * @param {function} callback - fonction qui traitera les données retournées
 */
exports.getPlayerByUsername = function(username, callback){
    db.Connection.getInstance().query('SELECT * FROM p_players WHERE p_players.player_username = "'+ username +'"', function(err, rows) {
        if (err) {
            winston.log('error', `Récupération d'un joueur par username : ${err.message}`);
            callback(err);
        }
        winston.log('info', 'Récupération d\'un joueur');
        if (rows.length){
            callback(null,
                [{
                    lastname: rows[0].player_lastname,
                    firstname: rows[0].player_firstname,
                    rank: rows[0].player_rank,
                    email: rows[0].player_email,
                    password: rows[0].player_password,
                    salt: rows[0].player_salt,
                    username: rows[0].player_username,
                    admin: rows[0].player_admin}]
            );
        } else {
            callback(null, []);
        }
    });
};

/*
/**
 * Mise à jour d'un joueur, prend du json en entrée
 * @param Un joueur
 * @param {function} la fonction qui sera appelé après, pour faire quelque chose du résultat
 */
/*
//Cette fonction est pour l'instant inutile.
exports.updatePlayer = function(player, callback){
    db.Connection.getInstance().query(
        'UPDATE p_players SET player_lastname = "' + player.lastname + '",'+
        'player_firstname = "' + player.firstname + '",'+
        'player_rank = "' + player.rank + '",'+
        'player_username = "' + player.username + '",'+
        'player_email = "' + player.email + '",'+
        'player_password = "' + player.password + '",'+
        'player_admin = "' + player.admin + '",'+
        'WHERE player_id = "' + player.id + '"',
        function(err, rows){
            if (err) {
                winston.log("error", "Mise à jour d'un joueur");
                throw err;
            }
            winston.log("info", "Mise à jour d'un joueur");
            callback(rows);
        })
}
*/

/**
 * Création d'un nouveau joueur
 * @param {object} player - joueur, dans un objet javascript
 * @param {function} callback - fonction qui traitera les données retournées
 */
exports.createNewPlayer = function(player, callback){
    let credentials = crypt.hash(player.password);
    db.Connection.getInstance().query(
        `INSERT INTO p_players (player_lastname, player_firstname, player_rank, player_username, player_email, player_password, player_salt, player_admin) VALUES` +
        `("${player.lastname}", "${player.firstname}", "${player.rank}", "${player.username}", "${player.email}", "${credentials.hash}", "${credentials.salt}", "${player.admin}")`,
        function(err, rows){
            if (err) {
                winston.log('error', `Création d\'un joueur : ${err.message}`);
                callback(err);
            }
            winston.log('info', 'Creation d\'un joueur');
            callback(null, rows);
        })
};


/**
 * Retourne l'ensemble des joueurs stockés dans la base de l'application
 * @param {function} callback - fonction traitant les données de retour
 */
exports.getAllPlayers = function(callback) {
    db.Connection.getInstance().query('SELECT * FROM p_players', function(err, rows) {
        if (err) {
            winston.log('error', `Impossible de récupérer tous les joueurs : ${err.message}`);
            callback(err);
        }
        winston.log('info', 'Récupération de tous les joueurs');
        callback(null, rows.map((elem) => {
            return {lastname: elem.player_lastname,
                firstname: elem.player_firstname,
                rank: elem.player_rank,
                email: elem.player_email,
                username: elem.player_username,
                admin: elem.player_admin}
        }));
    });
};

/**
 * Supprime un joueur de la base de données
 * @param {string} username - username du joueur à supprimer
 * @param {function} callback - fonction qui traitera les données retournées
 */
exports.deletePlayer = function(username, callback){
    db.Connection.getInstance().query(`DELETE FROM p_players WHERE player_username = "${username}"`,
    function(err, rows){
        if(err){
            winston.log('error', `Erreur pendant la suppression d'un utilisateur : ${err.message}`);
            callback(err);
        }
        winston.log('info', 'Suppression d\'un joueur');
        callback(null, rows);
    })
}
