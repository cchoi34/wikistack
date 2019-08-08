const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/wikistack', {
    logging: false
});

db.authenticate().
then(() => {
  console.log('connected to the database');
})

const Page = db.define('page', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    status: {
        type: Sequelize.ENUM('open', 'closed')
    }
});

const User = db.define('user', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isEmail: true
          }
    }
});

Page.belongsTo(User, { as: 'author'});

function generateSlug(title){
    console.log('This is the title', title);
    return title.replace(/\s+/g, '_').replace(/\W/g, '');
}

Page.beforeValidate((pageInfo, options)=>{
    console.log('This is the pageInfo', pageInfo);
    pageInfo.slug = generateSlug(pageInfo.title);
});

module.exports = {
    db, Page, User
};