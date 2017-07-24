const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 8080;
const router = express.Router();

let userDatabase = [
  { id: 1, name: 'John' }, { id: 2, name: 'Andrew' }, { id: 3, name: 'Anna'}, { id: 4, name: 'Kim'}, 
  { id: 5, name: 'Tom' }, { id: 6, name: 'Michael'}, { id: 7, name: 'Michael O.'}, { id: 8, name: 'Mary'},
  { id: 9, name: 'Pedro'}, { id: 10, name: 'Samantha'}, { id: 11, name: 'Christina'}, { id: 12, name: 'Sam'},
  { id: 13, name: 'Dorothy'}, { id: 14, name: 'Sarah'}, { id: 15, name: 'Ken'}, { id: 16, name: 'Richard' },
  { id: 17, name: 'Luke' }, { id: 18, name: 'Karla'}, { id: 19, name: 'Justin'}, { id: 20, name: 'Elya' },
  { id: 21, name: 'Dan'}, { id: 22, name: 'Emma'}, { id: 23, name: 'Angela'}, { id: 24, name: 'Kris'}, 
  { id: 25, name: 'Keith'}, { id: 26, name: 'Bob'}, { id: 27, name: 'Laura'}, { id: 28, name: 'Alex'}, 
  { id: 29, name: 'Lea'}, { id: 30, name: 'Wendy'}
];

let groupDatabase = [];

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT')
  next()
})

const findGroup = (groupID) => {
  const group = groupDatabase.find((_group) => {
    return _group.id === parseInt(groupID)
  });
  return group;
}

const findGroupIndex = (groupID) => {
  const groupIndex = groupDatabase.findIndex((group) => {
    return group.id === parseInt(groupID);
  });
  return groupIndex;
}

router.get('/users', function(req, res) {
  let users = userDatabase.map((user) => {
    return {name: user.name, id: user.id}
  })
  res.json(users);
})

router.get('/groups', function(req, res) {
    let groups = groupDatabase.map((group) => {
      return { users: group.users, id: group.id }
    })
    res.json(groups);
  })

router.post('/group', function(req, res) {
    let group = { id: req.body.groupID, users: req.body.users };
    groupDatabase.push(group);
    res.json(group);
  })

router.route('/groups/:groupID')
  .get(function(req, res) {
    let group = findGroup(req.params.groupID);
    res.json(group);
  })
  .put(function(req, res) {
    let groupIndex = findGroupIndex(req.params.groupID);
    let group = { id: req.params.groupID, users: req.body.users };
    groupDatabase[groupIndex] = group;
    res.json(group);
  })

app.use('/api', router)
app.listen(port)
console.log(`API running at localhost:${port}/api`)
