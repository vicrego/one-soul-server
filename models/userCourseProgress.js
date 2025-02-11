//Defines the Sequelize model for the Users table in your database.

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {

  class UserCourseProgress extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  UserCourseProgress.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "UserID is required"
        },
        notEmpty: {
          msg: "UserID is required"
        }
      }
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "CourseID is required" },
        notEmpty: { msg: "CourseID cannot be empty" }
      }
    },
    chapter_progress: {
      type: DataTypes.INTEGER,
      allowNull: true  // User may not have started the course yet
    }
  
    /*
    course_2: {
      type: DataTypes.INTEGER,
      unique: {
        args: true,
        msg: "Course_2 ID must be unique"
      },
    },
    course_3: {
      type: DataTypes.INTEGER,
      unique: {
        args: true,
        msg: "Course_3 ID must be unique"
      },
    },
    */
  }, {
    sequelize,
    modelName: 'UserCourseProgress',
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'course_id']
      }
    ]
  });

  return UserCourseProgress;
};