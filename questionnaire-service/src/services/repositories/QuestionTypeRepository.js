const BaseRepository = require('./BaseRepository');
const QuestionTypeModel = require('../models/QuestionTypeModel');

class QuestionTypeRepository extends BaseRepository {
  constructor() {
    super(QuestionTypeModel);
  }
}

module.exports = QuestionTypeRepository;