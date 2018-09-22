module.exports = (app, fs, Book) => {
    app.get('/', (req, res) => {
        var sess = req.session;

        res.render('index', {
            title: "My HomePage",
            length: 5,
            name: sess.name,
            username: sess.username
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


    
    });

    app.put('/updateUser/:username', (req, res) => {

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
            if(!users[username]) {
                result["success"] = 0;
                result["error"] = "user does not exist";
                res.json(result);
                return;
            }

            users[username] = req.body;

            fs.writeFile(__dirname + "/../data/user.json", JSON.stringify(users, null, '\t'), 'utf8', (err, data) => {
                result = {"success": 1};
                res.json(result);
            });
        });
    
    });

    app.delete('/deleteUser/:username', (req, res) => {
        var result = {};

        fs.readFile(__dirname + "/../data/user.json", 'utf8', (err, data) => {
            var users = JSON.parse(data);

            if(!users[req.params.username]) {
                result["success"] = 0;
                result["error"] = "not found";
                res.json(result);
                return;
            }

            delete users[req.params.username];
            fs.writeFile(__dirname + "/../data/user.json", JSON.stringify(users, null, '\t'), "utf8",(err, data) => {
                result["success"] = 1;
                res.json(result);
                return;
            });
        });
    });

    app.get('/login/:username/:password', (req, res) => {
        var sess;
        sess = req.session;

        fs.readFile(__dirname + "/../data/user.json", 'utf8', (err,data) => {
            var users = JSON.parse(data);
            var username = req.params.username;
            var password = req.params.password;
            var result = {};

            if(!users[username]) {
                result["success"] = 0;
                result["error"] = "not found";
                res.json(result);
                return;
            }

            if(users[username]["password"] == password) {
                result["success"] = 1;
                sess.username = username;
                sess.name = users[username]["name"];
                res.json(result);
            } else {
                result["success"] = 0;
                result["error"] = "incorrect";
                res.json(result);
            }
        })
    });

    app.get('/logout', (req, res) => {
        sess = req.session;
        if(sess.username) {
            req.session.destroy( (err) => {
                if(err) {
                    console.log(err);
                }else{
                    res.redirect('/');
                }
            });
        }
    });

    app.get('/api/books', (req, res) => {
        Book.find((err, books) => {
            if(err) {
                return res.status(500).send({error: 'DB failure'});
            }
            res.json(books);
        });
    });

    app.get('/api/books/:book_id', (req, res) => {
        Book.findOne({_id: req.params.book_id}, (err, book) => {
            if(err) return res.status(500).json({error: err});
            if(!book) return res.status(404).json({error: 'book not found'});
            res.json(book);
        })
    });

    app.get('/api/books/author/:author', (req, res) => {
        Book.find({author: req.params.author}, {_id: 0, title: 1, published_date: 1}, (err, books) => {
            if(err) return res.status(500).json({error: err});
            if(books.length === 0) return res.status(404).json({error: 'book not found'});
            res.json(books);
        });
    });

    app.post('/api/books', (req, res) => {
        var book = new Book();
        book.title = req.body.title;
        book.author = req.body.author;
        book.published_date = new Date(req.body.published_date);
        
        book.save( err => {
            if(err) {
                console.error(err);
                res.json({result: 0});
                return;
            }

            res.json({result: 1});
        });
    });

    app.put('/api/books/:book_id', (req, res) => {
        Book.findById(req.params.book_id, (err, book) => {
            if(err) return res.status(500).json({ error: 'DB failure' });
            if(!book) return res.status(404).json({ error: 'book not found' });

            if(req.body.title) book.title = req.body.title;
            if(req.body.author) book.author = req.body.author;
            if(req.body.published_date) book.published_date = req.body.published_date;

            book.save(err => {
                if(err) exports.status(500).json({ error: 'fauled to update!'});
                res.json({ message: 'book updated'});
            });
        });;

    });

    app.delete('/api/books/:book_id', (req, res) => {
        Book.deleteOne({ _id: req.params.book_id }, (err, output) => {
            if(err) return res.status(500).json({ error: 'database failure'});
          

            res.status(204).end();
        })
    });
};