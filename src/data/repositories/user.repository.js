/* eslint-disable consistent-return */
import { User } from '../models/index.js';
import { AggregationPipelineBuilder } from './aggregation-pipeline-builder.js';
import BaseRepository from './base.repository.js';

export class UserRepository extends BaseRepository {
  static async find(page, filter = {}) {
    const builder = new AggregationPipelineBuilder();

    if (filter.tag) {
      builder.addStringMatchStage('tags', filter.tag);
    }

    if (filter.role) {
      builder.addMatchStage('role', filter.role);
    }

    if (filter.name) {
      builder.addOrOperatorStage(
        { firstName: new RegExp(filter.name, 'i') },
        { lastName: new RegExp(filter.name, 'i') },
      );
    }

    builder
      .addSortingStage('firstName')
      .addSkipStage((page.index - 1) * page.size)
      .addLimitStage(page.size)
      .addFieldStage('fullName', { $concat: ['$firstName', ' ', '$lastName'] });

    const pipeline = builder.build();

    return User.aggregate(pipeline);
  }

  static async insert(entity, session) {
    try {
      const user = new User(entity);
      await user.save({ session });

      return user;
    } catch (error) {
      this.handleRepositoryError(error);
    }
  }

  static async findById(id) {
    return User.findById(id);
  }

  static async findVendorsByIds(chefIds) {
    return User.find({ _id: { $in: chefIds } });
  }

  static async findByIdWithFullName(id) {
    const builder = new AggregationPipelineBuilder();

    builder
      .addObjectIdMatchStage('_id', id)
      .addFieldStage('fullName', { $concat: ['$firstName', ' ', '$lastName'] });

    const pipeline = builder.build();

    const result = await User.aggregate(pipeline);

    return result.length > 0 ? result[0] : null;
  }

  static async findOne(filter) {
    return User.findOne(filter);
  }

  static async findByEmail(email) {
    return User.findOne({ email });
  }

  static async findBypimId(pimId) {
    return User.findOne({ pimId });
  }

  static async findByIdentifier(identifier) {
    return User.findOne({
      $or: [{ phoneNumber: identifier }, { email: identifier }],
    });
  }

  static async findByIdentifierAndFilter(identifier, filter) {
    return User.findOne({
      $or: [{ phoneNumber: identifier }, { email: identifier }],
      ...filter,
    });
  }

  static async update(entity, session) {
    try {
      return User.findByIdAndUpdate(entity.id, entity, { new: true, session });
    } catch (error) {
      this.handleRepositoryError(error);
    }
  }

  static async deleteById(id) {
    return User.findByIdAndDelete(id);
  }

  static async isEmailUnique(email) {
    const matches = await User.find({ email });

    return matches.length < 1;
  }
}
