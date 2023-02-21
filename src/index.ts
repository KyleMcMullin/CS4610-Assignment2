import express, { Request, RequestHandler } from "express";
import { PrismaClient, Session, User } from "@prisma/client";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import cookieParser from "cookie-parser";

const client = new PrismaClient();
const app = express();
app.use(express.json());
app.use(cookieParser());

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
  session?: Session
  user?: User
}

// #region Authentication


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

app.use(authenticationMiddleware);

//sign up
app.post('/users', async (req, res) => {
  const {firstName, lastName, email, password} = req.body as CreateUserBody;
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


type LoginBody = {
  email: string,
  password: string
}

// log in
app.post("/sessions",  async (req, res) => {
  const {email, password} = req.body as LoginBody;
  const user = await client.user.findFirst({
    where: {
      email,
    }
  });
  if (!user) {
    res.status(404).json({ message: "Invalid email or password" });
    return;
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    res.status(404).json({ message: "Invalid email or password" });
    return;
  }

  const token = uuidv4();
  const session = await client.session.create({
    data: {
      userId: user.id,
      token,
    }
  })

  res.cookie("session-token", session.token, {
    httpOnly: true,
    maxAge: 60000 * 10
  })

  res.json({ session });
});

app.get("/me", async (req: RequestWithSession, res) => {
  if (req.session) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: "unauthorized"});
  }
});

// #endregion

// #region Reptiles

// post create reptile

type CreateReptileBody = {
  userId: number,
  species: string,
  name: string,
  sex: string
}

app.post('/reptile', async (req, res) => {
  const {userId, species, name, sex} = req.body as CreateReptileBody;
  const user = await client.user.findFirst({
    where: {
      id: userId
    }
  }) as User;
  if (user == null) return;
  const reptile = await client.reptile.create({
    data: {
      userId,
      species,
      name,
      sex,
      feedings: {
        create: []
      },
      schedules: {
        create: []
      },
      husbandryRecords: {
        create: []
      }
    }
  });
  res.json({ reptile });
});

// delete reptile

// put reptile

// get reptiles

// #endregion

app.get("/", (req, res) => {
  res.send(`<h1>Hello, world!</h1>`);
});

app.listen(3000, () => {
  console.log("I got started!");
});