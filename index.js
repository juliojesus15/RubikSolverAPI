const express = require('express')
const app = express()

// settings
app.set('port', process.env.PORT || 4000);

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Rubik Cube Solver - API')
})

app.get('/solver/:keys', (req, res) => {  
  res.send(JSON.stringify({ 'Solver': req.params.keys }));
});

// starting the server
app.listen(app.get('port'), () => {
  console.log(`Server on port ${app.get('port')}`);
});