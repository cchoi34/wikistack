const express = require('express');
const router = express.Router();
const addPage = require('../views/addPage');
const layout = require('../views/layout');
const { Page } = require("../models");
const wikipage = require('../views/wikipage');
const main = require('../views/main');
// const { addPage } = require("../views");

router.use(express.json());

router.get('/', async (req, res, next) => {
    const page = await Page.findAll({
        attributes: ['title', 'slug']
    })
    console.log('first page', page[0]);
    // let titleLink = titles.map((title) => {
    //     return `<a href="">${title}</a></br>`;
    // });
    res.send(main(page));
})

router.get('/add', (req, res, next) => {
    res.send(addPage());
})

router.get('/:slug', async (req, res, next) => {
    try {
        const page = await Page.findOne({
            where: {
                slug: req.params.slug
            }
        });
        res.send(wikipage(page, req.body.author));
    }
    catch (error) {
        next(error)
    } 
})

router.post('/', async (req, res, next) => {

    // STUDENT ASSIGNMENT:
    // add definitions for `title` and `content`
    console.log('This is req.body', req.body);
    const page = new Page({
      title: req.body.title,
      content: req.body.content
    });
  
    // make sure we only redirect *after* our save is complete!
    // note: `.save` returns a promise.
    try {
      await page.save();
      res.redirect(`/wiki/${page.slug}`);
    } catch (error) { next(error) }
  });

module.exports = router;