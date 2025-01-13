//Configures the Passport strategies (e.g., LocalStrategy, JWTStrategy) that define how users are authenticated.

const bcrypt = require('bcrypt');
const jwtSecret = require('./jwtConfig');

const BCRYPT_SALT_ROUNDS = 12;


const passport = require('passport');
const LocalStrategy = require('passport-local');
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const { Sequelize } = require('sequelize');

//const { default: db } = require('../../models/index');
const db = require('../../models/index');


/*
passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
},

function (username, password, cb) {
  //this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
  return db.User.findOne({username, password})
     .then(user => {
         if (!user) {
             return cb(null, false, {message: 'Incorrect username or password.'});
         }
         return cb(null, user, {message: 'Logged In Successfully'});
    })
    .catch(err => cb(err));
}
));
*/
/*
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';
opts.issuer = 'accounts.examplesoft.com';
opts.audience = 'yoursite.net';
*/




/*
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
  db.User.findOne({id: jwt_payload.sub}, function(err, user) {
      if (err) {
          return done(err, false);
      }
      if (user) {
          return done(null, user);
      } else {
          return done(null, false);
          // or you could create a new account
      }
  });
}));

*/
//module.exports = passport;
/*
passport.use(
  'local',
  new JwtStrategy(opts, (jwt_payload, done) => {
    console.log("heree")
    try {
      db.User.findOne({
        where: {
          id: jwt_payload.id,
        },
      }).then(user => {
        if (user) {
          console.log('user found in db in passport');
          done(null, user);
        } else {
          console.log('user not found in db');
          done(null, false);
        }
      });
    } catch (err) {
      done(err);
    }
  }),
);

module.exports = passport;
*/
//const User = new Sequelize(db) // Example for postgres
/*
const test = async () => {
  try {
    await User.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
test();
*/


passport.use(
  'local',
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      session: false,
    },
    (username, password, done) => {
      try {
        db.User.findOne({
          where: {
            username,
          },
        }).then(user => {
          if (user === null) {
            return done(null, false, { message: 'bad username' });
          }
          bcrypt.compare(password, user.password).then(response => {
            if (response !== true) {
              console.log('passwords do not match');
              return done(null, false, { message: 'passwords do not match' });
            }
            console.log('user found & authenticated');
            return done(null, user);
          });
        });
      } catch (err) {
        done(err);
      }
    },
  ),
);


/*
// JWT Strategy
const cookieExtractor = function(req) {
  let token = null;
  if (req && req.cookies) {
      token = req.cookies['jwt'];
  }
  return token;
};

passport.use("local",
  new JwtStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.JWT_SECRET,
    },
    (jwtPayload, done) => {
      try {
        // Find the user based on the JWT payload (e.g., user ID)
        db.User.findByPk(jwtPayload.id)
          .then(user => {
            if (user) {
              return done(null, user);
            } else {
              return done(null, false);
            }
          })
          .catch(err => done(err));
      } catch (error) {
        done(error);
      }
    }
  )
);


*/
module.exports = passport;

//var crypto = require('crypto');
/*
passport.use(new LocalStrategy(function verify(username, password, cb) {
  console.log("heyyy")

  db.User.get('SELECT * FROM Users WHERE username = ?', [ username ], function(err, user) {
    if (err) { return cb(err); }
    if (!user) { return cb(null, false, { message: 'Incorrect username or password.' }); }
    
    crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
      if (err) { return cb(err); }
      if (!crypto.timingSafeEqual(user.hashed_password, hashedPassword)) {
        return cb(null, false, { message: 'Incorrect username or password.' });
      }
      return cb(null, user);
    });
  });
}));

const opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
  secretOrKey: jwtSecret.secret,
};*/
