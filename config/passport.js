const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Admin = require("../models/admin");
const bcrypt =require('bcryptjs')

//determines which data of the user object should be Admind in the sesson
passport.serializeUser((user, done) => {
  done(null, user.id); //in this case its the user.id
});

//use the user.id from the serializeUser to get the object
passport.deserializeUser(async (id, done) => {
  try {
    const user = await Admin.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallBack: false
    },
    async (username, password, done) => {
      try {
        const user = await Admin.findOne({ username:username});
    
        if (!user) {
          return done(null, false, { message: "No user with this username" });
        }

               bcrypt.compare(password, user.password, function(err, isMatch) {
                 console.log("Does it math:", isMatch);
                 if (!isMatch) {
                   console.log("Password incorrect, please try again");
                   return done(null, false, {
                     message: "PASSWORD INCRRECT, TRY AGAIN"
                   });
                 }
                 
                 return done(null, user);
               });
      } catch (error) {
        return done(error, false);
      }
    }
  )
);
