import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import os from "os";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const HOSTNAME = os.hostname();

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    gateway: HOSTNAME
  });
});

const forwardRequest = (baseURL) => {
  return async (req, res) => {
    try {
      console.log(`Request handled by gateway: ${HOSTNAME}`);

      const response = await axios({
        method: req.method,
        url: baseURL + req.url,
        data: req.body,
        headers: {
          Authorization: req.headers.authorization || ""
        }
      });

      // Add header to see which gateway responded
      res.set("X-Gateway-Instance", HOSTNAME);

      res.status(response.status).json(response.data);

    } catch (error) {
      console.error(`Gateway Error (${HOSTNAME}):`, error.message);

      if (error.response) {
        return res.status(error.response.status).json(error.response.data);
      }

      return res.status(500).json({
        message: "Service unavailable",
        gateway: HOSTNAME
      });
    }
  };
};

// Route forwarding
app.use("/api/users", forwardRequest("http://user-service:5001/users"));
app.use("/api/stream", forwardRequest("http://streaming-service:5002/stream"));
app.use("/api/ads", forwardRequest("http://ad-service:5003/ads"));
app.use("/api/search", forwardRequest("http://search-service:5004/search"));
app.use("/api/recommendations", forwardRequest("http://recommendation-service:5005/recommendations"));
app.use("/api/analytics", forwardRequest("http://analytics-service:5006/analytics"));

app.listen(5000, () => {
  console.log(`API Gateway running on port 5000 🚀 (${HOSTNAME})`);
});