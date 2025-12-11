import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../dao/models/user.model.js'; // Ajusta el path si tu modelo está en otra carpeta
import dotenv from 'dotenv';

dotenv.config(); // ⚠️ Siempre cargar dotenv al inicio

const secret = process.env.JWT_SECRET;

if (!secret) {
  console.error('❌ JWT_SECRET no está definido en .env');
  process.exit(1); // Detiene la app si no hay clave
}

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret,
};

const strategy = new JwtStrategy(options, async (payload, done) => {
  try {
    const user = await User.findById(payload.id);
    if (!user) return done(null, false);
    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
});

// Registramos la estrategia con passport
passport.use(strategy);

export default passport;









