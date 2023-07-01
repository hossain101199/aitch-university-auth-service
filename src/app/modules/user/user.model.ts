import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../../config';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { IUser } from './user.interface';

// const userSchema = new Schema<IUser, userModel>(
const userSchema = new Schema<IUser>(
  {
    id: { type: String, required: true, unique: true },
    role: { type: String, enum: Object.values(ENUM_USER_ROLE), required: true },
    password: {
      type: String,
      required: true,
      // select: 0,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: 'student',
    },
    faculty: {
      type: Schema.Types.ObjectId,
      ref: 'faculty',
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'admin',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password;
      },
    },
  }
);

// userSchema.static(
//   'isUserExist',
//   async function isUserExist(
//     id: string
//   ): Promise<Pick<
//     IUser,
//     'id' | 'password' | 'role' | 'needsPasswordChange'
//   > | null> {
//     return await User.findOne(
//       { id },
//       { id: 1, password: 1, role: 1, needsPasswordChange: 1 }
//     );
//   }
// );

// userSchema.static(
//   'isPasswordMatched',
//   async function isPasswordMatched(
//     givenPassword: string,
//     savedPassword: string
//   ): Promise<boolean> {
//     return await bcrypt.compare(givenPassword, savedPassword);
//   }
// );

// This code is executed before saving a user document to the database
userSchema.pre('save', async function (next) {
  // Hash the password using bcrypt
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds)
  );

  // Call the next middleware or save the document
  next();
});

// export const User = model<IUser, userModel>('user', userSchema);
export const User = model<IUser>('user', userSchema);
