'use strict';
const bcrypt = require('bcrypt');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.Courses = User.hasMany(models.Course);
    }
  }
  User.init({
      firstName:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'A first name is required'
          },
          notEmpty: {
            msg: 'Please provide a first name'
          }
        }
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'A last name is required'
          },
          notEmpty: {
            msg: 'Please provide a last name'
          }
        }
      },
      emailAddress: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: {
                msg: "The email address entered is already in use"
              },
          validate: {
              notNull: {
                  msg: 'An email address is required'
              },
              notEmpty: {
                  msg: 'Please provide an email address'
              },
              isEmail: {
                  msg: "Please provide a valid email address"
              },
          }
      },
      password: {
        type: DataTypes.STRING,  
        allowNull: false,
       /* set(val) {
         // if ( val === this.password ) {
            console.log(val +' passwords '+this.password);
            const hashedPassword = bcrypt.hashSync(val, 10);
            this.setDataValue('password', hashedPassword);
          //}
        },*/
        validate: {
          notNull: {
            msg: 'A password is required'
          },
          notEmpty: {
            msg: 'Please provide a password'
          },
          len: {
            args: [8, 20],
            msg: 'The password should be between 8 and 20 characters in length'
          }
        }
      },
  },{
    sequelize,
    modelName: 'User',
    hooks: {
    beforeCreate: async (user, options) => {
      // bcrypt is defined here because it is in the file scope
      user.password = await bcrypt.hash(user.password, 10); //
    },
    beforeUpdate: async (user, options) => {
        if (user.changed('password')) { // Only hash if the password field is being updated
            user.password = await bcrypt.hash(user.password, 10);
        }
    }
  }
  });
  return User;
};