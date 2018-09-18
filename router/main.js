module.exports = (app, fs) => {
    app.get('/', (req, res) => {
        res.render('index', {
            title: "My HomePage",
            length: 5
        });
    });

    app.get('/list', (req, res) => {
        fs.readFile(__dirname + "/../data/" + "user.json", 'utf8', (err, data) => {
            console.log( data );
            res.end( data );
        });        
    });

    app.get('/getUser/:username', (req, res) => {
        fs.readFile(__dirname + "/../data/user.json", 'utf8', (err, data) => {
            var users = JSON.parse(data);
            res.json(users[req.params.username]);
        });
    });

    app.post('/addUser/:username', (req, res) => {

        var result = {};
        var username = req.params.username;

        if(!req.body["password"] || !req.body["name"]) {
            result["success"] = 0;
            result["error"] = "invalid request";
            res.json(result);
            return;
        }

        fs.readFile(__dirname + "/../data/user.json", 'utf8', (err,data) => {
            var users = JSON.parse(data);
            if(users[username]) {
                result["success"] = 0;
                result["error"] = "duplicate";
                res.json(result);
                return;
            }

            users[username] = req.body;

            fs.writeFile(__dirname + "/../data/user.json", JSON.stringify(users, null, '\t'), 'utf8', (err, data) => {
                result = {"success": 1};
                res.json(result);
            });
        });


    
    })

}