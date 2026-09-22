import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import dbCreate from "./config/db.js";
import radis from "./config/radis.js";
import authRoutes from "./routes/auth.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import receptionistRoutes from "./routes/receptionistRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

/* -------------------- MIDDLEWARE -------------------- */
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

/* -------------------- ROUTES -------------------- */

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/receptionists", receptionistRoutes);
// router.use('/analytics', analyticsRoutes);
// router.use('/subscriptions', subscriptionRoutes);
// router.use('/system', systemRoutes);
app.post("/post/:id/view", async (req, res) => {
  const id = req.params.id;
  const radisView = await radis.incr(`post${id}view`);
  res.status(201).json({
    message: "SucessFully Incr",
    radisView,
  });
  // Write logic here
});

// 2. Add/Update Score for Leaderboard

app.post("/leaderboard/score/:id", async (req, res) => {
  const id = req.params.id;
  const radisIncremnet = await radis.zincrby(`leaderboardScore`, 5, id);
  res.status(201).json({
    message: "Score Increment Sucessfully",
    radisIncremnet,
  });
  // Write logic here
});

// 3. Get Top 10 Leaders

app.get("/leaderboard", async (req, res) => {
  // Write logic here
  const radisTopUsers = await radis.zrevrange(
    `leaderboardScore`,
    0,
    9,
    "WITHSCORES",
  );

  res.status(201).json({
    message: "Top Ten Score Fetch Sucessfully",
    radisTopUsers,
  });
});

// 4. Get Rank of Specific User
app.get("/leaderboard/:userId/rank", async (req, res) => {
  // Write logic here
  const userId = req.params.userId;

  const rank = await radis.zrevrank("leaderboardScore", userId);
  const score = await radis.zscore("leaderboardScore", userId);

  res.status(201).json({
    message: "Top One Person Scorer Fetch Sucessfully",
    rank: rank !== null ? rank + 1 : null,
    score: score !== null ? Number(score) : null,
  });
});

/* -------------------- START SERVER -------------------- */
app.listen(port, async () => {
  await dbCreate();
  console.log(`🚀 Server running on port ${port}`);
});
