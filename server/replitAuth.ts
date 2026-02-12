import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET || "default-secret-change-me",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: sessionTtl,
    },
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());

  // Simple login - creates/gets user by email
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, firstName, lastName } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const user = await storage.upsertUser({
        id: email,
        email,
        firstName: firstName || null,
        lastName: lastName || null,
        profileImageUrl: null,
      });

      (req.session as any).user = {
        claims: { sub: user.id },
        email: user.email,
      };

      res.json(user);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, firstName, lastName } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const user = await storage.upsertUser({
        id: email,
        email,
        firstName: firstName || null,
        lastName: lastName || null,
        profileImageUrl: null,
      });

      (req.session as any).user = {
        claims: { sub: user.id },
        email: user.email,
      };

      res.json(user);
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ message: "Signup failed" });
    }
  });

  app.get("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) console.error("Logout error:", err);
      res.redirect("/");
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const sessionUser = (req.session as any).user;

  if (!sessionUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  (req as any).user = sessionUser;
  next();
};
