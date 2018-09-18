module.exports = (app, fs) => {
    app.get('/', (req, res) => {
        res.render('index', {
            title: "My HomePage",
            length: 5
        })
    });

    app.get('/list', (req, res) => {
        fs.readFile(__dirname + "/../data/" + "user.json", 'utf8', (err, data) => {
            console.log( data );
            res.end( data );
        });        
    })

}