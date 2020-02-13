let db = require("./data/db");

const express = require("express"); // import Express package

const server = express(); // creates the server
server.use(express.json());

let newId = 0;

// server.get("/", (requested, response) => {
//   response.send("Nil Satis Nisi Optimum");
// });

// POST
server.post("/api/users", (request, response) => {
  const { name, bio } = request.body;
  const newUser = { name, bio, id: Date.now() };

  if (!name || !bio) {
    response.status(400).json({
      errorMessage: "Please provide name and bio for the User."
    });
  }

  db.insert(newUser)
    .then(user => {
      response.status(201).json(user);
    })
    .catch(error => {
      response.status(500).json({
        error: error,
        message:
          "There was a terrible error while saving the user to the database."
      });
    });
});

// GET
// returns ARRAY of all users objects in database
server.get("/api/users", (request, response) => {
    db.find() // returns a promise that resolves to an array of all the users contained in the database
    .then(users => {
        response.status(201).json(users)
    })
    .catch(error => {
        response.status(500).json({
            error: error,
            message: "Sadly, the users information could not be retrieved."
        })
    })
});

// returns user OBJECT with specific id
server.get("/api/users/:id", (request, response) => {
    const { id } = request.params; // where is params coming from?? 

    db.findById(id)
    .then(user => {
        user ? response.status(201).json(user) : response.status(404).json({message: "User with the specified ID does not exist. Good-bye."})
    })
    .catch(error => {
        response.status(500).json({
            error: error,
            message: "User information could not be retrieved."
        })
    })
});

// PUT
// updates user with specific ID from request body > returns modified, not original
server.put("/api/users/:id", (request, response) => {
    const { id } = request.params;
    const { name, bio } = request.body;
    const newUser = { name, bio, id };

    if (!name || !bio) {
        response.status(400).json({errorMessage: `Please provide name and bio for the user.`})
    }

    db.update(id, newUser)
    .then(user => {
        user ? response.status(200).json({message: `User at id${id} was updated/created.`}) : response.status(404).json({message: "The user with the specified ID does not exist."})
    })
    .catch(error => {
        response.status(500).json({
            error: error,
            message: `The user information could not be modified.`
        })
    })

});

// DELETE
// removes user with specific id & returns deleted user
server.delete("/api/users/:id", (request, response) => {
    const { id } = request.params;

    db.remove()
    .then(user => {
        user ? response.status(200).json({message: `User at id ${id} was removed.`}) : response.status(404).json({error: error, message:"The user with the specified ID does not exist."})
    })
    .catch(error => 
        response.status(500).json({error: error, message:"The user could not be removed."}))
});

// watch for connections on port 4040
const port = 4040;
server.listen(port, () => {
  console.log(`server started @ http://localhost:${port}`);
});
