const PaginationHelper = require('../../utils/paginationHelper');

class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    const instance = new this.model(data);
    return instance.save();
  }

  async findAll({ filter = {}, sort = '', limit = 0, skip = 0 } = {}) {
    return this.model.find(filter).sort(sort).limit(limit).skip(skip);
  }

  async findById(id) {
    return this.model.findById(id);
  }

  async findOne(conditions = {}) {
    return this.model.findOne(conditions);
  }

  async update(id, data) {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return this.model.findByIdAndDelete(id);
  }

  async addToArrayField(id, fieldName, items) {
    return this.model.findByIdAndUpdate(
      id,
      { $addToSet: { [fieldName]: { $each: items } } },
      { new: true }
    );
  }

  async removeFromArrayField(id, fieldName, items) {
    return this.model.findByIdAndUpdate(
      id,
      { $pull: { [fieldName]: { $in: items } } },
      { new: true }
    );
  }

  async getAllWithPagination(query) {
    const { filters, pagination, sort, order } = PaginationHelper.applyPagination(query);
    return await PaginationHelper.paginate(this.model, filters, pagination, sort, order);
  }
}

module.exports = BaseRepository;
