const BaseRepository = require('./BaseRepository');
const CategoryModel = require('../models/CategoryModel');

class CategoryRepository extends BaseRepository {
  constructor() {
    super(CategoryModel);
  }
}

module.exports = CategoryRepository;