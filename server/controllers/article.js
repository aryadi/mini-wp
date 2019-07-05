const Model = require('../models');

class Article {

  static getArticles(req, res, next) {
    Model.Article.find()
      .populate('author')
      .then((response) => {
        res.status(200).json(response);
      })
      .catch((err) => {
        next(err);
      })
  }

  static create(req, res, next) {

    let articleObj = {
      title: req.body.title,
      content: req.body.description,
      image: req.file.gcsUrl,
      author: req.decode.obj._id
    }

    Model.Article.create(articleObj)
      .then((response) => {
        res.status(201).json(response);
      })
      .catch((err) => {
        next(err);
      })
  }

  static update(req, res, next) {
    let objArticle = {};

    if (req.body.title) {
      objArticle['title'] = req.body.title;
    }

    if (req.body.description) {
      objArticle['content'] = req.body.description;
    }

    if (req.file) {
      objArticle['image'] = req.file.gcsUrl;
    }

    console.log(objArticle);
    
    Model.Article.updateOne({
        _id: req.params.articleId
      }, objArticle)
      .then((response) => {
        res.status(201).json(response);
      })
      .catch((err) => {
        next(err);
      })
  }

  static delete(req, res, next) {
    Model.Article.deleteOne({
        _id: req.params.articleId
      })
      .then((response) => {
        res.status(200).json(response);
      })
      .catch((err) => {
        next(err);
      })
  }
}

module.exports = Article;