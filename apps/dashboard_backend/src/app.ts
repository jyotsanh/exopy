import cors from "cors";
import express, { Application, Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import passport from "passport";
import morgan from "morgan";
import client from "prom-client";

// import { globalErrorHandler } from "./middlewares/er/globalErrorHandler.middleware.js";
import { globalErrorHandler } from "./middlewares/error-handler/globalErrorHandler.middleware.js";
import indexRoute from "./routes/index.route.js";
import configurePassport from "./config/passport.js";
import { env } from "./config/env.js";

export class App {
  public app: Application;

  private httpRequestDuration!: client.Histogram<string>;

  constructor() {
    this.app = express();
    this.initializeMetrics();
    this.initializeMiddlewares();
    this.initializePassport();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMetrics() {
    client.collectDefaultMetrics();

    this.httpRequestDuration = new client.Histogram({
      name: "http_request_duration_seconds",
      help: "Duration of HTTP requests in seconds",
      labelNames: ["method", "route", "status"],
    });

    this.app.use((req: Request, res: Response, next: NextFunction) => {
      const start = Date.now();

      res.on("finish", () => {
        const duration = (Date.now() - start) / 1000;

        this.httpRequestDuration.observe(
          {
            method: req.method,
            route: req.path,
            status: res.statusCode,
          },
          duration
        );
      });

      next();
    });
  }

  private initializeMiddlewares() {
    this.app.set("trust proxy", true);

    this.app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(morgan("common"));
  }

  private initializePassport() {
    configurePassport();
    this.app.use(passport.initialize());
  }

  private initializeRoutes() {
    this.app.get("/metrics", async (req: Request, res: Response) => {
      res.set("Content-Type", client.register.contentType);
      res.send(await client.register.metrics());
    });

    this.app.use("/api", indexRoute);

    this.app.get("/health", (req: Request, res: Response) => {
      res.json({ status: "ok" });
    });
  }

  private initializeErrorHandling() {
    this.app.use(globalErrorHandler);
  }

  public getApp(): Application {
    return this.app;
  }
}
