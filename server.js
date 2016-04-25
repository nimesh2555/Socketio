var express = require("express"),
    http = require("http"),
    // import the mongoose library
    mongoose = require("mongoose"),
    Socket_Io = require("socket.io"),
    app = express();

app.use(express.static(__dirname + "/client"));
app.use(express.bodyParser());

// connect to the amazeriffic data store in mongo
mongoose.connect('mongodb://localhost/amazeriffic');

// This is our mongoose model for todos
var ToDoSchema = mongoose.Schema({
    description: String,
    tags: [String]
});

var ToDo = mongoose.model("ToDo", ToDoSchema);
var s = http.createServer(app);
var iosocket = new Socket_Io(s);
s.listen(3000);


iosocket.on("connection", function(socket) {
    console.log("User connected");
    socket.on("add", function(data) {
        iosocket.sockets.emit("newToDO", data);
    });
});

app.get("/todos.json", function(req, res) {
    ToDo.find({}, function(err, toDos) {
        res.json(toDos);
    });
});

app.post("/todos", function(req, res) {
    console.log(req.body);
    var newToDo = new ToDo({
        "description": req.body.description,
        "tags": req.body.tags
    });
    newToDo.save(function(err, result) {
        if (err !== null) {
           
            console.log(err);
            res.send("ERROR");
        } else {


            ToDo.find({}, function(err, result) {
                if (err !== null) {
                    
                    res.send("ERROR");
                }
                res.json(result);
            });
        }
    });
});