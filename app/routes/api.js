
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../../config');

// secret password for creating tokens
var theSecret = config.secret;

module.exports = function(app, express) {

  var apiRouter = express.Router();

  // route to authenticate a user (POST http://localhost:8080/api/authenticate)
  apiRouter.post('/authenticate', function(req, res) {
    console.log(req.body.username);

    // find the username
    // select the password explicitly since mongoose is not returning it by default
    User.findOne({
      username : req.body.username
    }).select('password').exec(function(err, user) {
      if (err) throw err;

      //no user with that username was found
      if (!user) {
        res.json({
          success : false,
          message : 'Authentication failed. User not found.'
        });
      } else if (user) {

        // check if password matches
        var validPassword = user.comparePassword(req.body.password);
        if (!validPassword) {
          res.json({
            success : false,
            message : 'Authentication failed. Wrong password.'
          });
        } else {
          // user is found and password is correct
          // create that token!
          var token = jwt.sign(user, theSecret, {
            expiresIn: '1440 minutes'
          });

          // return the information including token as json
          res.json({
            success : true,
            message : 'Enjoy the deliciousness of the token!',
            token : token
          });
        }
      }
    });

  });

  // route middleware to verify the token
  apiRouter.use(function(req, res, next) {

    // do some logging
    console.log('Someone just rolled in on 8080!');

    //check the header or url parameters or post parameters for token presence
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode the token
    if (token) {

      // verify the secret and check exp
      jwt.verify(token, theSecret, function(err, decoded) {
        if (err) {
          return res.json({ success : false, message : 'Failed to authenticate token'});
        } else {
          // everything is good if you get here - save to request for use in other routes
          req.decoded = decoded;

          next();
        }
      });
    } else {

      // no token!
      // return an HTTP 403 response
      return res.status(403).send({
        success : false,
        message : 'No token provided in the request.'
      });
    }
  });

  // basic test route to make sure everything is working
  // GET http://localhost:8080/api
  apiRouter.get('/', function(req, res) {
    res.json({ message : 'Boom! Welcome to the API!'});
  });

  // routes that end in /users
  // ------------------------------
  apiRouter.route('/users')

    // create a user (POST http://localhost:8080/users)
    .post(function(req, res) {

      var user = new User();
      user.name = req.body.name;
      user.username = req.body.username;
      user.password = req.body.password;

      user.save(function(err) {
        if (err) res.send(err);

        // return a message
        res.json({ message : 'User created!' });
      });
    })

    // get all the users (GET http://localhost:8080/api/users)
    .get(function(req, res) {
      User.find(function(err, users) {
        if (err) res.send(err);

        // return all the everybody
        res.json(users);
      });
    });

  // routes that end in /users/:user_id
  // ------------------------
  apiRouter.route('/users/:user_id')

    // get the user with that id
    .get(function(req, res) {
      User.findById(req.params.user_id, function(err, user) {
        if (err) res.send(err);

        // return the user
        res.json(user);
      });
    })

    // update the user with this id
    .put(function(req, res) {

      User.findById(req.params.user_id, function(err, user) {

        if (err) res.send(err);

        // set new stuff if it exists in the request
        if (req.body.name) user.name = req.body.name;
        if (req.body.username) user.username = req.body.username;
        if (req.body.password) user.password = req.body.password;

        // save the user
        user.save(function(err) {
          if (err) res.send(err);

          // return some message
          res.json({ message : 'User has been updated!' });
        });

      });
    })

    // delete the user with this id
    .delete(function(req, res) {
      User.remove({
        _id: req.params.user_id
      }, function(err, user) {
        if (err) res.send(err);

        res.json({ message : 'That user has been purged!' });
      });
    });

  // api endpoint to get user information
	apiRouter.get('/me', function(req, res) {
		res.send(req.decoded);
	});

  return apiRouter;
}
