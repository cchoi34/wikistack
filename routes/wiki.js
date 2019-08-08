const express = require('express');
const router = express.Router();
const addPage = require('../views/addPage');
const layout = require('../views/layout');
const { Page, User } = require("../models");
const wikipage = require('../views/wikipage');
const main = require('../views/main');
// const { addPage } = require("../views");

router.use(express.json());

router.get('/', async (req, res, next) => {
    const page = await Page.findAll({
        attributes: ['title', 'slug']
    })
    res.send(main(page));
})

router.get('/add', (req, res, next) => {
    res.send(addPage());
})

router.get('/:slug', async (req, res, next) => {
    try {
        console.log("REQ>PARAMS>SLUG", typeof req.params.slug);
        const page = await Page.findOne({
            where: {
                slug: req.params.slug
            }
        });
        console.log('UPPERCASE PAGE', Page);
        console.log('LOWER CASE PAGE', page);
        const author = await page.getAuthor();
        console.log('AUTHOR', author);
        res.send(wikipage(page, author));
    }
    catch (error) {
        next(error)
    } 
})

router.post('/', async (req, res, next) => {

    // STUDENT ASSIGNMENT:
    // add definitions for `title` and `content`
    const page = new Page({
      title: req.body.title,
      content: req.body.content,
    });
  
    // make sure we only redirect *after* our save is complete!
    // note: `.save` returns a promise.
    try {
        const [user, created] = await User.findOrCreate({
            where: {
                name: req.body.name,
                email: req.body.email
            }
        })

        const page = await Page.create(req.body);

        page.setAuthor(user);
        await page.save();
        res.redirect(`/wiki/${page.slug}`);
    } 
    catch (error) { 
        next(error) 
    }
  });

module.exports = router;