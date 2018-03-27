/**
 * @file Fichier définissant les fonctions de connexion et de création de la base de données
 */

const mysql = require('mysql');
const execsql = require('exec-sql');
const winston = require('winston');

//TODO : Propre
let directory_name = "./resources/ping_db.sql";

/** 
 * Singleton d'instance de connexion
*/
let Connection = (function(){
    let instance;

    function createInstance(){
        connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'ping_db'
        });
        return connection;
    }
    return{
        getInstance: function(){
            if(!instance){
                instance = createInstance();
            }
            return instance;
        }
    };
})();
exports.Connection = Connection;

/**
 * Se connecte à la bdd et créé les tables si nécessaire
 * @throws {ECONNREFUSED} Connexion à la base de données impossible
 */
exports.init = function(callback){
    Connection.getInstance().connect(
        function (err) {
            if (err) {
                winston.log('error', 'La connexion à la db a échoué');
                callback(err);
            } else {

                winston.log('info', 'Connexion db initialisée');
                callback(null);
            }
        });
};

//TODO comments
exports.checkDBTables = function(callback) {
    Connection.getInstance().query("SELECT * FROM p_players;",
        function(err) {
            if(err){
                winston.log('info', 'Table p_players inaccessible, création de la bdd');
                create(callback);
            }
        });
};

/**
 * Execute le fichier de création des tables
 * @throws Le fichier de création sql est illisible
 */
create = function(callback){

    execsql.connect({
        'database': 'ping_db',
        'user': 'root',
        'password': ''
    });

    execsql.executeFile(directory_name, function(err) {
        if (err) {
            winston.log('error', 'Erreur exécution fichier sql');
            callback(err);
        } else {
            winston.log('info', 'Tables créées');
            callback(null);
        }
    })

};