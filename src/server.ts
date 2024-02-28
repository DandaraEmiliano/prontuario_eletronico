import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import routes from "../src/routes/patientRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use("/api", routes);

mongoose
  .connect("mongodb://localhost:27017/prontuario")
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

export default app;
