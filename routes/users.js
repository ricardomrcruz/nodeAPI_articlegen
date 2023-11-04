import express  from "express";

const router = express.Router(); // to initiate the router

//all routes here are starting with /users
router.get('/', (req ,res) => {
    res.send('Hello beatch');
});

export default router;