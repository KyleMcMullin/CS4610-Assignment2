import express, { Request, RequestHandler } from "express";
import { PrismaClient, Session, User } from "@prisma/client";
import bcrypt from "bcrypt";
import path from "path";
import { v4 as uuidv4 } from 'uuid';
import cookieParser from "cookie-parser";
import cors from "cors";
import { engine } from "express-handlebars";

const client = new PrismaClient();
const app = express();

app.engine("hbs", engine({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.json());
app.use(cookieParser());
app.use(cors());


type Reptile = {
  id: number,
  userId: number,
  species: string,
  name: string,
  sex: string,
  createdAt: Date,
  updatedAt: Date
}

type Schedule = {
  id: number,
  reptileId: number,
  userId: number,
  type: string,
  description: string,
  monday: boolean,
  tuesday: boolean,
  wednesday: boolean,
  thursday: boolean,
  friday: boolean,
  saturday: boolean,
  sunday: boolean,
  createdAt: Date,
  updatedAt: Date

}

type Feeding = {
  id: number,
  reptileId: number,
  foodItem: string,
  createdAt: Date,
  updatedAt: Date
}

type HusbandryRecord = {

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
  });
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
app.delete('/reptile/:id', async (req, res) => {  
  const id = parseInt(req.params.id);
  await client.reptile.delete({
    where: {
      id
    }
  });
  res.status(204).json({});
});

type PutReptileBody = {
  species: string,
  name: string,
  sex: string,
}

// put reptile
app.put('/reptile/:id', async (req, res) => {
  const {species, name, sex} = req.body as PutReptileBody;
  const id = parseInt(req.params.id);
  const reptile = await client.reptile.update({
    where: {
      id
    },
    data: {
      species,
      name,
      sex
    }
  });

  if (!reptile) {
    res.status(404);
    return;
  }

  res.json({reptile})
});

// get reptiles
app.get('/reptile/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);
  const reptiles = await client.reptile.findMany({
    where: {
      userId 
    }
  });
  if (!reptiles) {
    res.status(404).json("Reptiles not found");
    return;
  }
  res.json(reptiles);
});
// #endregion


// #region Schedules

// create schedule for a reptile
app.post('/reptile/:userId/:reptileId/schedules', async (req, res) => {
  const reptileId = parseInt(req.params.reptileId);
  const userId = parseInt(req.params.userId);
  const { type, description, monday, tuesday, wednesday, thursday, friday, saturday, sunday } = req.body as Schedule;
  
  const schedule = await client.schedule.create({
    data: {
      reptileId,
      userId,
      type,
      description,
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
      sunday,
    },
  });
  
  res.json({ schedule });
});

// list all schedules for a reptile
app.get('/reptile/:reptileId/schedules', async (req, res) => {
  const reptileId = parseInt(req.params.reptileId);

  const schedules = await client.schedule.findMany({
    where: { reptileId },
  });
  
  if (!schedules) {
    res.status(404).json("Schedules not found");
    return;
  }
  res.json({ schedules });
});

// list all schedules for a user
app.get('/:userId/schedules', async (req, res) => {
  const userId = parseInt(req.params.userId);
  const schedules = await client.schedule.findMany({
    where: { userId },
  });

  res.json({ schedules });
});

// #endregion


// #region Husbandry
app.post('/reptile/:userId/:id/husbandry', async (req, res) => {
const reptileId = parseInt(req.params.id);
const length = parseFloat(req.body.length);
const weight = parseFloat(req.body.weight);
const temperature = parseFloat(req.body.temperature);
const humidity = parseFloat(req.body.humidity);
const userId = parseInt(req.params.userId);
const reptile = await client.reptile.findFirst({
  where: {
    id: reptileId,
    userId
  }
});

// check if the reptile exists
if (!reptile) {
return res.status(404).json({ error: "Reptile not found" });
}

const husbandryRecord = await client.husbandryRecord.create({
  data: {
    reptileId,
    length,
    weight,
    temperature,
    humidity
  }
});  
// Return the new husbandry record in the response
res.json(husbandryRecord);
});

app.get('/reptile/:userId/:id/husbandry', async (req, res) => {
  const reptileId = parseInt(req.params.id);
  const userId = parseInt(req.params.userId);
  const reptile = await client.reptile.findFirst({
    where: {
      id: reptileId,
      userId
    }
  });
  
  // check if the reptile exists
  if (!reptile) {
  return res.status(404).json({ error: "Reptile not found" });
  }
  const husbandryRecords = await client.husbandryRecord.findMany({
    where: {
      reptileId: reptile.id,
    }
  });

  res.json(husbandryRecords);
});
// #endregion

// #region Feeding
app.post('/reptile/:userId/:id/feeding', async (req, res) => {
const feeding = req.body;
const foodItem = req.body.foodItem;
const reptileId = parseInt(req.params.id);
const userId = parseInt(req.params.userId);
const reptile = await client.reptile.findFirst({
  where: {
    id: reptileId,
    userId
  }
});

// check if the reptile exists
if (!reptile) {
return res.status(404).json({ error: "Reptile not found" });
}


// Create a feeding for the reptile with the specified id
const newFeeding = await client.feeding.create({
data: {
  reptileId,
  foodItem
}
});
// Return the new feeding in the response
res.json(newFeeding);
});


app.get('/reptile/:userId/:id/feeding', async (req, res) => {
  const feeding = req.body;
  const reptileId = parseInt(req.params.id);
  const userId = parseInt(req.params.userId);
  const reptile = await client.reptile.findFirst({
    where: {
      id: reptileId,
      userId
    }
  });


  // check if the reptile exists
  if (!reptile) {
  return res.status(404).json({ error: "Reptile not found" });
  }
  const feedings = await client.feeding.findMany({
    where: {
      reptileId: reptile.id
    }});
  // Get all the feedings for the reptile with the specified id
  // Return the list of feedings in the response
  res.json(feedings);
  });

// #endregion

if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    if (req.path.match(/\.\w+$/)) {
      fetch(`${process.env.ASSET_URL}/${req.path}`).then((response) => {
        if (response.ok) {
          res.redirect(response.url);
        } else {
          // handle dev problems here
        }
      });
    } else {
      next();
    }
  })
} else {
  // do prod things
}

app.get("/", (req, res) => {
  console.log(process.env.ASSET_URL);
  res.render("app", {
    development: true,
    assetUrl: process.env.ASSET_URL,
  });
})

app.listen(3000, () => {
  console.log("Server Up And Running!");
});