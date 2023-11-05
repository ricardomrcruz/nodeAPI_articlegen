import express  from "express";
import { v4 as uuidv4 } from 'uuid';


const router = express.Router(); // to initiate the router

const users = [
    
];

//all routes here are starting with /users
router.get('/', (req ,res) => {
    // console.log(users);
    res.send(users);
});

router.post('/', (req, res) => {
    // console.log('POST ROUTE REACHED');

    //  console.log(req.body);

    const user = req.body;

    users.push({ ...user, id: uuidv4()});

    res.send(`User with the username ${user.name} added to the database.`);
});

// /users/2 => req.params {id: 2}

router.get('/:id', (req, res) => {
    
    // console.log(req.params);

    const { id } = req.params;

    //to find the id of the user in the json database and compare to the one in the url

    const foundUser = users.find((user) => user.id === id);

    res.send(foundUser);
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;


    

    users = users.filter((user) => user.id !== id);
})

export default router;