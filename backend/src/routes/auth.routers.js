import { Router } from "express";
import { signUp, login } from "../controllers/auth.controllers.js";

const authRouter = Router();

authRouter.post('/sign-up', signUp);

authRouter.post('/login', login);

//authRouter.post('/logout', );  // todo

export default authRouter;