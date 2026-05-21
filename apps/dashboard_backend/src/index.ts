import "dotenv/config";
import mongoose from "mongoose";
import { App } from "./app.js";
import { env } from "./config/env.js";
import { seedSuperAdmin } from "./seeds/superAdmin.seed.js";

export class Server {
  private appInstance: App;

  constructor() {
    this.appInstance = new App();
  }

  public async start() {
    try {
      await mongoose.connect(env.MONGO_URI);
      console.log("Connected to MongoDB");

      await seedSuperAdmin();

      const app = this.appInstance.getApp();

      app.listen(env.PORT, () => {
        console.log(`Server is running at http://localhost:${env.PORT}`);
      });
    } catch (err) {
      console.error("Failed to connect to MongoDB", err);
      process.exit(1);
    }
  }
}

const server = new Server();
server.start();
