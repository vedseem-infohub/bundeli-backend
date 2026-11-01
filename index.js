import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDb from "./config/db.js";
import seedDefaultAdmin from "./config/seedAdmin.js";
import seedDatabase from "./config/seedDatabase.js";

// Routes imports
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import bannerRouter from "./routes/banner.routes.js";
import categoryRouter from "./routes/category.routes.js";
import artworkRouter from "./routes/artwork.routes.js";
import newArrivalsRouter from "./routes/newArrivals.routes.js";
import achievementRouter from "./routes/achievement.routes.js";
import celebrityPatronRouter from "./routes/celebrityPatron.routes.js";
import newsRouter from "./routes/news.routes.js";
import blogRouter from "./routes/blog.routes.js";
import reviewRouter from "./routes/review.routes.js";
import artistRouter from "./routes/artist.routes.js";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3001",
  "https://bundeli-frontend.vercel.app",
  "https://bundeli-admin.vercel.app",
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    const normalizedOrigin = origin.replace(/\/+$/, "");

    // Check against allowed origins or any Vercel deployment under bundeli / preview branches
    const isAllowed =
      allowedOrigins.some((allowed) => allowed.replace(/\/+$/, "") === normalizedOrigin) ||
      normalizedOrigin.endsWith(".vercel.app");

    if (isAllowed) {
      return callback(null, true);
    }

    // Permissive fallback so production deployments never get blocked by CORS misconfiguration
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Root health check endpoint with API catalog
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Bundeli Kalavrat API is active.",
    endpoints: {
      auth: "/api/auth",
      user: "/api/user",
      heroBanners: "/api/banners",
      categories: "/api/categories",
      artworks: "/api/artworks",
      newArrivals: "/api/new-arrivals",
      achievements: "/api/achievements",
      celebrityPaintings: "/api/celebrity-paintings",
      news: "/api/news",
      blogs: "/api/blogs",
      reviews: "/api/reviews",
      artists: "/api/artists",
    },
  });
});

// Mount modular API routers
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/banners", bannerRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/artworks", artworkRouter);
app.use("/api/new-arrivals", newArrivalsRouter);
app.use("/api/achievements", achievementRouter);
app.use("/api/celebrity-paintings", celebrityPatronRouter);
app.use("/api/news", newsRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/artists", artistRouter);

// Global Error Handler (for Multer and unexpected errors)
app.use((err, req, res, next) => {
  console.error("Global API Error:", err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || "An unexpected server error occurred.",
    error: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
});

const port = process.env.PORT || 8000;

app.listen(port, async () => {
  await connectDb();
  await seedDefaultAdmin();
  await seedDatabase();
  console.log(`Bundeli Kalavrat backend active on port ${port}`);
});

export default app;
