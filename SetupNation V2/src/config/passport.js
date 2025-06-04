import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../models/index.js";

passport.use(
  "signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      // Busca si existe un usuario con ese email
      const userFound = await User.findOne({ email });

      // si existe retorna un error
      if (userFound) {
        return done(null, false, { message: "The username is already Taken" });
      }

      // Crea un nuevo usuario
      const newUser = new User();
      newUser.email = email;
      newUser.password = await User.encryptPassword(password);
      const userSaved = await newUser.save();

      // crea un mensaje de éxito
      req.flash("success", "Ingresa con tu nueva cuenta");

      // retorna sesión iniciada
      return done(null, userSaved);
    }
  )
);

passport.use(
  "signin",
  new LocalStrategy(
    {
      passwordField: "password",
      usernameField: "email",
    },
    async (email, password, done) => {
      // busca al usuario por email
      const userFound = await User.findOne({ email });

      // si no existe retorna un error
      if (!userFound) return done(null, false, { message: "Not User found." });

      // enlaza la contraseña con la que se ha registrado
      const match = await userFound.matchPassword(password);

      if (!match) return done(null, false, { message: "Incorrect Password." });

      return done(null, userFound);
    }
  )
);
// Serialización y deserialización de usuario
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = (await User.findById(id)).toObject();
    if (user) {
      delete user.password;
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
});
