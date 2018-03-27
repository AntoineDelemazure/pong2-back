/** 
 * @file Le fichier contenant les requetes relatives aux tournois
*/
const db = require('./db.js')
const winston = require('winston')

/**
 * Recherche un tournoi via son id
 * @param {number} id Le numéro du tournoi recherché
 */
exports.getTournamentByID = function(id){
    db.Connection.getInstance().query('SELECT * FROM p_tournois WHERE tournoi_id = '+ id, function(err, rows, fields) {
        if (err) {
            winston.log("error", "Récupération du tournoi n°" + id);
            throw err;
        }
        winston.log("info", "Récupération du tournoi n°" + id);
        return rows;
      });
}