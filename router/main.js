module.exports = (app, fs) => {
    app.get('/', (req, res) => {
        res.render('index', {
            title: "My HomePage",
            length: 5
        })
    });
}