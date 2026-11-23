import { once } from "node:events";
import mongoose from "mongoose";
import app from "./app";
import { seedDemoPatients } from "./seedDemoPatients";

async function start() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/prontuario";
  const host = process.env.HOST || "127.0.0.1";
  const port = Number(process.env.PORT || 3000);

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  if (process.env.PRONTUARIO_SEED === "true") {
    await seedDemoPatients();
  }

  const server = app.listen(port, host);
  await once(server, "listening");
  console.log(`Prontuário disponível em http://${host}:${port}`);

  const shutdown = () => {
    server.close(() => {
      void mongoose.disconnect().catch(() => {
        process.exitCode = 1;
      });
    });
  };
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}

if (require.main === module) {
  void start().catch(async (error: Error) => {
    console.error("Não foi possível iniciar o prontuário:", error.name);
    process.exitCode = 1;
    await mongoose.disconnect();
  });
}

export default app;
