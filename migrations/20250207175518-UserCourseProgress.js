'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (
    queryInterface, Sequelize) {
    await queryInterface.createTable('UserCourseProgresses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      course_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      chapter_progress: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      /*
      course_2: {
        type: Sequelize.INTEGER
      },
      course_3: {
        type: Sequelize.INTEGER
      },
      */
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.addConstraint('UserCourseProgresses', {
      fields: ['user_id', 'course_id'],
      type: 'unique',
      name: 'unique_user_course' // Constraint name
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserCourseProgress');
  }
};
