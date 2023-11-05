import { v4 as uuidv4 } from 'uuid';


export const getUsers = (req ,res) => {
    // console.log(users);
    res.send(users);
}



export const createUser = (req, res) => {
    // console.log('POST ROUTE REACHED');

    //  console.log(req.body);

    const user = req.body;

    users.push({ ...user, id: uuidv4()});

    res.send(`User with the username ${user.name} added to the database.`);
}


export const getUser = (req, res) => {
    
    // console.log(req.params);

    const { id } = req.params;

    //to find the id of the user in the json database and compare to the one in the url

    const foundUser = users.find((user) => user.id === id);

    res.send(foundUser);
}


export const deleteUser = (req, res) => {
    const { id } = req.params;

    users = users.filter((user) => user.id !== id); 
    //users is equal to all the users except the ones with the id requested (the id to be deleted)

    res.send(`user with the id ${id} deleted from the database successfully.`);
}



export const updateUser = (req, res) => {
    const { id } = req.params;
    const { name, lastname, age} = req.body;

    const user = users.find((user) => user.id === id);
    


    if (name) user.name = name;
    if (lastname) user.lastname = lastname;
    if (age) user.age = age;

    res.send(`user with the id {id} has been updated successfully.`);

    
}