import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import materialRoutes from "./routes/materialRoutes.js";
import purchaseRoutes from "./routes/purchaseRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import websiteRoutes from "./routes/websiteRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";




const app = express();
app.set("trust proxy", 1);

const allowedOrigins = (process.env.CLIENT_URLS || "")
  .split(",")
  .map((url) => url.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin))
        return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
  }),
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("MK Construction ERP API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/website", websiteRoutes);
app.use("/api/public", publicRoutes);


const PORT = process.env.PORT || 8000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
