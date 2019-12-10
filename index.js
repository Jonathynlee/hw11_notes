const fs = require('fs');
const express = require('express')
const app =  express();
const path = require('path');
var PORT = process.env.PORT || 8080;
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//if ()
let notesList = [{}];
let count = 0;
fs.readFile("./db.json",'utf8', (err, data)=>{
    notesList = JSON.parse(data);
    for(let i = 0; i<notesList.length;i++){
        count++;
    }
})

app.get('/notes', (rep, res)=>{
    res.sendFile(path.join(__dirname, "./notes.html"), {headers:{"Content-Type":"text/html"}});
})

app.get('/api/notes', (req, res)=>{
    fs.readFile("./db.json",'utf8', (err, data)=>{
        res.json(JSON.parse(data));
    })
})
app.post('/api/notes', (req, res)=>{
     notesList.push(req.body);

     
     
     fs.writeFile('./db.json', JSON.stringify(notesList), (err)=>{
         if (err) throw err;
         else {
             res.sendFile(path.join(__dirname, './db.json'));
            count++;
            }
     })
     
    res.send(notesList);
})

app.get('/count', (req,res)=>{
    res.send(JSON.stringify(count));
})

app.get('/*', (req, res)=>{
    res.sendFile(path.join(__dirname, "./index.html"));
})
app.delete("/api/notes/:id", (req, res)=>{
    console.log(req.params.id);
    notesList = notesList.filter(obj =>{
        return obj.id != req.params.id;
    })
    fs.writeFile('./db.json', JSON.stringify(notesList), (err)=>{
        if (err) throw err;
        else {
            res.sendFile(path.join(__dirname, './db.json'));
           count++;
           }
    })
    res.send("finished");

})


app.listen(PORT, function() {
    console.log(`App listening on port: ${PORT}`)
});