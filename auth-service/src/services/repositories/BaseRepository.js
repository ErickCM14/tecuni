const mongoose = require('mongoose');

class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    const instance = new this.model(data);
    return instance.save();
  }

  async findAll() {
    return this.model.find();
  }

  async findById(id) {
    return this.model.findById(id);
  }

  async findOne(conditions) {
    return this.model.findOne(conditions);
  }

  async update(id, data) {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return this.model.findByIdAndDelete(id);
  }
}

module.exports = BaseRepository;
