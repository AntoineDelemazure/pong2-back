var mysql = require('mysql');

// Ceci est un bon exemple de test unitaire avec mocha
// TODO: On le supprimera peut-être
// This is just for organisation and reporting
describe('Our application', function() {

    // This is the name of the test
    it('should understand basic mathematical principles', function(done) {
  
      // We want this test to pass.
      if (5 == 5) {
        // If the behavior is as expected, call done with no argument.
        done();
      } else {
        // Otherwise, call done with an error.
        done(new Error("Not sure what's happened."));
      }
  
    });
});

describe("Test de la bdd", function(){

    let connection

    before(function(done){
        connection = mysql.createConnection({
            host     : 'localhost',
            user     : 'root',
            password : '',
            database : 'ping_db'
        });
        done();
    })

    it('should connect to the bdd', function(done){
        connection.connect(function(err) {
            if (err) {
                done(err)
            } else {
                done()
            }
        })        
    })// fin test

    it('should access a table', function(done){
        connection.query("Select * From p_players", function(err){
            if(err){
                done(err)
            } else{
                done()
            }
        })
    })//fin test

    after(function(done){
        connection.end()
        done()
    })
})// fin describe