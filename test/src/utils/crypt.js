const crypt = require('../../../src/utils/crypt');

describe("Test des fonctions de crypto", function () {

    it('should generate two different salts one after another', function (done) {
        let salt1 = crypt.genSalt(20);
        let salt2 = crypt.genSalt(20);
        if (salt1 !== salt2) {
            done();
        } else {
            done(new Error("Les sels sont identiques"));
        }
    });

    it('should return the same hash when the password and the salt are identical', function(done) {
        let password = 'imapassword';
        let salt = '01234567890123456789';
        let hash1 = crypt.sha512(password, salt);
        let hash2 = crypt.sha512(password, salt);
        if (hash1 === hash2) {
            done();
        } else {
            done(new Error("Les hash sont différents"));
        }
    });

    it('should return different hashes when hashed with different salts', function(done) {
        let password = 'thatsapassword';
        let salt1 = 'azertyuiopqsdfghjklm';
        let salt2 = 'nbvcxwmlkjhgfdsqpoiu';
        let hash1 = crypt.sha512(password, salt1);
        let hash2 = crypt.sha512(password, salt2);
        if (hash1 !== hash2) {
            done();
        } else {
            done(new Error("Les hash sont identiques"));
        }
    });

    it('should compare password and hash properly', function(done) {
        let password = 'anotherpassword';
        let salt = 'pmolikujyhtgrfedzsaq';
        let hashedPassword = crypt.sha512(password, salt);
        if (crypt.compare(password, hashedPassword, salt)) {
            done();
        } else {
            done(new Error("Le hash ne correspond pas au mot de passe"))
        }
    });

});