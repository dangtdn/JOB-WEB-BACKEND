import authRouter from "./authRouter.js";
import userRouter from "./userRouter.js";
import categoryRouter from "./categoryRouter.js";
import jobRouter from "./jobRouter.js";
import jobApplyRouter from "./jobApplyRouter.js";
import resumeRouter from "./resumeRouter.js";
import companyRouter from "./companyRouter.js";
import ErrorResponse from "../utils/errorResponse.js";

const route = (app) => {
  app.use("/api", authRouter);
  app.use("/api", userRouter);
  app.use("/api", categoryRouter);
  app.use("/api", jobRouter);
  app.use("/api", companyRouter);
  app.use("/api", jobApplyRouter);
  app.use("/api", resumeRouter);

  app.get("/", (req, res) => res.send("Job Portal - API"));

  app.use("*", (req, res, next) => {
    return next(new ErrorResponse("The route can not be found!!!", 404));
  });
};
export default route;
