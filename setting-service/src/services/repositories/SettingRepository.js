const BaseRepository = require('./BaseRepository');
const SettingModel = require('../models/SettingModel');

class SettingRepository extends BaseRepository {
  constructor() {
    super(SettingModel);
  }

  async findByKey(key) {
    return this.findOne({ key });
  }

  async findByGroup(group) {
    return this.model.find({ group });
  }

  async findGrouped() {
    const settings = await SettingModel.find();
    return settings.reduce((acc, setting) => {
      if (!acc[setting.group]) {
        acc[setting.group] = [];
      }
      acc[setting.group].push(setting);
      return acc;
    }, {});
  }

  async updateOrCreate(key, value, extra = {}) {
    return SettingModel.findOneAndUpdate(
      { key },
      { $set: { value, ...extra } },
      { new: true, upsert: true }
    );
  }
}

module.exports = SettingRepository;