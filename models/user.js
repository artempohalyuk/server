const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First Name is required.'],
  },
  lastName: {
    type: String,
    required: [true, 'Last Name is required.'],
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
    validate: [
      {
        validator: (value) => {
          return /\S+@\S+\.\S+/.test(value);
        },
        message: 'Invalid email format',
      },
      {
        validator: async function (value) {
          const user = await this.constructor.findOne({ email: value });

          if (user) {
            throw new Error('Email must be unique.');
          }
          return true;
        },
        message: 'Email must be unique.'
      }
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
  },
  teamId: {
    type: String,
    default: null
  }
});

userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

const User = mongoose.model('User', userSchema);
  
module.exports = User;