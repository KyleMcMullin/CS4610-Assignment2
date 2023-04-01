# CS4610-Assignment3

Since the last assignment we added a client server that is hosted at ```http://localhost:5173/``` which would be the
access point of the website.


To start the backend server you can do the exact same as the last assignment which is:

Build the node_modules by running 
```npm install``` or ```yarn``` (1)

Then you are going to want to run the migration do either

```npx prisma migrate dev --name init```
or
```yarn db:migrate``` (2)

then to run the backend you will do either

```npm run``` or ```yarn dev``` (3)


Then you are going to go the the ```../client``` directory and run either the same command 
to build the modules reference to command (1). And then run the front end server hosting on 
```http://localhost:3000/``` with command (3).

The backend serves the front end therefore to navigate to the website open it on port ```:3000```.