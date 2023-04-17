const express = require('express');
const cors = require('cors');
const app = express();
const port = 8000;

const users = { 
    users_list :
    [
       { 
          id : 'xyz789',
          name : 'Charlie',
          job: 'Janitor',
       },
       {
          id : 'abc123', 
          name: 'Mac',
          job: 'Bouncer',
       },
       {
          id : 'ppp222', 
          name: 'Mac',
          job: 'Professor',
       }, 
       {
          id: 'yat999', 
          name: 'Dee',
          job: 'Aspring actress',
       },
       {
          id: 'zap555', 
          name: 'Dennis',
          job: 'Bartender',
       }
    ]
 }

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send(users);
    // res.send("Hello World!");
});

app.get('/users', (req, res) => {
    const name = req.query.name;
    if (name != undefined){
        let result = findUserByName(name);
        result = {users_list: result};
        res.send(result);
    }
    else {
        res.send(users)
    }
});

const findUserByName = (name) => { 
    return users['users_list'].filter( (user) => user['name'] === name); 
}

app.get('/users/:id', (req, res) => {
    const id = req.params['id'];
    let result = findUserById(id);
    if (result == undefined || result.length == 0)
        res.status(404).send('Resource not found.');
    else {
        result = {users_list: result};
        res.send(result);
    }
});

function findUserById(id) {
    return users['users_list'].find( (user) => user['id'] === id); // or line below
    //return users['users_list'].filter( (user) => user['id'] === id);
}

app.get('/users/:name/:job', (req, res) => {
    const name = req.params['name'];
    const job = req.params['job'];
    let result = findNameJob(name, job);
    if (result == undefined || result.length == 0)
        res.status(404).send('Resource not found.');
    else {
        result = {users_list: result};
        res.send(result);
    }
});

function findNameJob(name, job) {
    return users['users_list'].find( (user) => user['name'] === name && user['job'] == job); // or line below
}

app.post('/users', (req, res) => {
    const userToAdd = req.body;
    addUser(userToAdd);
    res.status(201).end();
});

function addUser(user) {
    user['id'] = uniqueid();
    users['users_list'].push(user);
}

app.delete('/users/:id', (req, res) => {
    const id = req.params['id'];
    let deleteUserIdx = getIdx(id);
    console.log(id);
    console.log(deleteUserIdx);
    const remove = users.users_list.splice(deleteUserIdx, deleteUserIdx);
    console.log(remove);
    if (remove != []) {
        res.status(204).end();
    }
    else {
        res.status(404).end();
    }
});

function getIdx(id) {
    return users['users_list'].findIndex( (user) => user['id'] === id);
}


function uniqueid(){
    // always start with a letter (for DOM friendlyness)
    var idstr=String.fromCharCode(Math.floor((Math.random()*25)+65));
    do {                
        // between numbers and characters (48 is 0 and 90 is Z (42-48 = 90)
        var ascicode=Math.floor((Math.random()*42)+48);
        if (ascicode<58 || ascicode>64){
            // exclude all chars between : (58) and @ (64)
            idstr+=String.fromCharCode(ascicode);    
        }                
    } while (idstr.length<32);
    return (idstr);
}

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});