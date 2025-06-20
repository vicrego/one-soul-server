//Configures the Passport strategies (e.g., LocalStrategy, JWTStrategy) that define how users are authenticated.

const bcrypt = require('bcrypt');
const jwtSecret = require('./jwtConfig');

const BCRYPT_SALT_ROUNDS = 12;


const passport = require('passport');
const LocalStrategy = require('passport-local');
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

//const { default: db } = require('../../models/index');
const db = require('../../models/index');
const { raw } = require('express');





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
          raw: true
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
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy; // Defines how JWTs are verified
const ExtractJWT = passportJWT.ExtractJwt; // Extracts JWT from incoming request
passport.use("jwt", new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  },
  function (jwtPayload, cb) {
    console.log("jwtPayload", jwtPayload)
    //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
    //return db.User.findOneById(jwtPayload.id)
    return db.User.findOne({
      where: {
        username,
      }
    })
    .then(user => {
      console.log("hereeee")
      
      return cb(null, user);
    })
    .catch(err => {
      console.log("hereeee")
      return cb(err);
    });
  }
));
*/




const cookieExtractor = req => {
  let jwt = null 
  try {
    if (req && req.headers.cookie) {
        jwt = req.headers.cookie;
        var jwtSliced = jwt.slice(4);
    }
  } catch (error) {
    console.error("Error extracting JWT from cookie:", error);
  };
  return jwtSliced
};

const userId = req => {
  let userId = null 
  try {
    if (req && req.body) {
      userId = req.body;
        
    }
  } catch (error) {
    console.error("Error extracting JWT from cookie:", error);
  };
  return userId;
};


const secret = process.env.JWT_SECRET;

passport.use('jwt', new JwtStrategy({
  usernameField: "username",
  jwtFromRequest: cookieExtractor,
  userId: userId,
  secretOrKey: secret,
}, (jwtPayload, done) => {
  const { exp } = jwtPayload
  if (Date.now() > exp * 1000) {
    done('Unauthorized', false)
  }
  done(null, jwtPayload)
}));



//TRYING TO REACH USER INFO
/*
passport.use('jwt', new JwtStrategy({
  jwtFromRequest: cookieExtractor,
  usernameField: "username",
  secretOrKey: secret,
}, ( jwtPayload, username, done) => {
  try {
    db.User.findOne({
    where: {
      username,
    }
  }).then((user) => {
    console.log("use herer", user)
    const { exp } = jwtPayload
    if (Date.now() > exp * 1000) {
      done('Unauthorized', false)
    }
    done(null, jwtPayload)
  })
 } catch (error) {
    console.error(error)
    return done(error, false)
  }
}));
*/
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
