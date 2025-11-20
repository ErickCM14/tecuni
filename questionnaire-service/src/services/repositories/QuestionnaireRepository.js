const BaseRepository = require('./BaseRepository');
const QuestionnaireModel = require('../models/QuestionnaireModel');

class QuestionnaireRepository extends BaseRepository {
  constructor() {
    super(QuestionnaireModel);
  }
}

module.exports = QuestionnaireRepository;