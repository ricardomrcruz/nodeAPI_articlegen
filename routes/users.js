import express  from "express";

const router = express.Router(); // to initiate the router

const users = [
    {
        name: "John",
        lastName: "Doee",
        age: 35
    },
    {
        name: "James",
        lastName: "Arthur",
        age: 29
    }
];

//all routes here are starting with /users
router.get('/', (req ,res) => {
    console.log(users);
    res.send(users);
});

router.post('/', (req, res) => {
    console.log('POST ROUTE REACHED');

    console.log(req.body);
    // users.push();

    res.send('POST ROUTE REACHED');
});

export default router;