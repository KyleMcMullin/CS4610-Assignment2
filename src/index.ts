import express, { Request, RequestHandler } from "express";
import { PrismaClient, Session, User } from "@prisma/client";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import cookieParser from "cookie-parser";

const client = new PrismaClient();
const app = express();
app.use(express.json());

type Reptile = {

}  

type Schedule = {

}

type CreateUserBody = {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    reptiles: Reptile[],
    schedules: Schedule[],
    sessions: Session[]
}

type RequestWithSession = Request & {
    session?: Session;
    user?: User;
}


const authenticationMiddleware: RequestHandler = async (req: RequestWithSession, res, next) => {
    const sessionToken = req.cookies["session-token"];
    if (sessionToken) {
      const session = await client.session.findFirst({
        where: {
          token: sessionToken
        },
        include: {
          user: true
        }
      });
      if (session) {
        req.session = session;
        req.user = session.user;
      }
    }
    next();
  }

//sign up
app.post('/users', async (req, res) => {
  const {firstName, lastName, email, password} = req.body as CreateUserBody;
  console.log(`password: ${password}`);
  console.log(req.body);
  const passwordHash = await bcrypt.hash(req.body.password, 10);
  const user = await client.user.create({
    data: {
      firstName,
      lastName,
      email,
      passwordHash,
      sessions: {
        create: [{
          token: uuidv4()
        }]
      },
      reptiles: {
          create: []
      },
      schedules: {
        create: []
      },
    },
    include: {
      sessions: true
    }
  });
  res.cookie("session-token", user.sessions[0].token, {
    httpOnly: true,
    maxAge: 60000 * 10
  });

  res.json({ user });
});

  app.get("/", (req, res) => {
    res.send(`<h1>Hello, world!</h1>`);
  });

  app.listen(3000, () => {
    console.log("I got started!");
  });