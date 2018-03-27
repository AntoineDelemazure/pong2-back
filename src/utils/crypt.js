/**
 * @file Fonctions servant à chiffrer les mots de passe
 */

let crypto = require('crypto');

/**
 * Génère un sel aléatoire d'une certaine longueur
 * @param {number} length - Longueur du sel
 * @returns {number} Le sel de la longueur désirée
 */
function genSalt(length) {
    return crypto.randomBytes(Math.ceil(length/2))
        .toString('hex')
        .slice(0, length);
}

/**
 * Retourne un mot de passe chiffré et salé en sha512
 * @param {string} password - Le mot de passe
 * @param {string} salt - Le sel
 * @returns {string} Le hash
 */
function sha512(password, salt) {
    let hash = crypto.createHmac('sha512', salt);
    hash.update(password);

    return hash.digest('hex');
}

/**
 * Sale et chiffre un mot de passe
 * @param {string} password - Le mot de passe
 * @returns {{salt: number, hash: string}} Le sel généré et le hash
 */
function hash(password) {
    let salt = genSalt(20);
    let hashValue = sha512(password, salt);
    return {
        salt: salt,
        hash: hashValue
    };
}

/**
 * Compare un mot de passe en clair à sa version chiffrée
 * @param {string} password - Le mot de passe en clair
 * @param {string} hashedPassword - Le mot de passe chiffré
 * @param {string} salt - Le sel du chiffré
 * @returns {boolean} Le résultat de la comparaison
 */
function compare(password, hashedPassword, salt) {
    return (sha512(password, salt) === hashedPassword);
}

module.exports = {
    genSalt: genSalt,
    sha512: sha512,
    hash: hash,
    compare: compare
};