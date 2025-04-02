const db = require('./db');
const post = db.sequelize.define('postagens', {
    nome: {
        type: db.Sequelize.STRING
    },
    email: {
        type: db.Sequelize.STRING
    },
})
post.sync({force: false});