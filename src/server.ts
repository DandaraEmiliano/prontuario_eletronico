import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import routes from "./routes/patientRoutes";

const app = express();
const PORT = process.env.NODE_ENV === "test" ? 3001 : 3000;

app.use(bodyParser.json());
app.use("/api", routes);

mongoose
  .connect("mongodb://localhost:27017/prontuario", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as any)
  .then(() => {
    console.log("Connected to MongoDB");
  
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Internal Server Error:", err);
  res.status(500).send("Internal Server Error");
});

export default app;
