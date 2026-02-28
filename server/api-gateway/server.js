import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const forwardRequest = (baseURL) => {
  return async (req, res) => {
    try {
      const response = await axios({
        method: req.method,
        url: baseURL + req.url,
        data: req.body,
        headers: {
          Authorization: req.headers.authorization || ""
        }
      });

      res.status(response.status).json(response.data);

    } catch (error) {
      console.error("Gateway Error:", error.message);

      if (error.response) {
        return res.status(error.response.status).json(error.response.data);
      }

      return res.status(500).json({ message: "Service unavailable" });
    }
  };
};

app.use("/api/users", forwardRequest("http://localhost:5001/users"));
app.use("/api/stream", forwardRequest("http://localhost:5002/stream"));
app.use("/api/ads", forwardRequest("http://localhost:5003/ads"));
app.use("/api/search", forwardRequest("http://localhost:5004/search"));
app.use("/api/recommendations", forwardRequest("http://localhost:5005/recommendations"));
app.use("/api/analytics", forwardRequest("http://localhost:5006/analytics"));


app.listen(5000, () => {
  console.log("API Gateway running on port 5000 🚀");
});
