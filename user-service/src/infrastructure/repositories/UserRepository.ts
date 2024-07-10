import { IUser } from "../../application/interfaces/IUserEntity";
import { IUserRepository } from "../../application/interfaces/IUserRepository";
import { User } from "../../domain/entities/UserEntity";

import userModel from "../database/model/UserModel";

export class UserRepository implements IUserRepository {
  async save(user: IUser) {
    const mongoUser = new userModel({
      username: user.username,
      email: user.email,
      password: user.password,
    });
    await mongoUser.save();
    return new User({
      username: mongoUser.username,
      userId: mongoUser._id.toString(),
      email: mongoUser.email,
      password: "",
    });
  }

  async findUserById(userId: string) {
    const mongoUser = await userModel.findById(userId);
    if (!mongoUser) return null;
    return new User({
      userId: mongoUser._id.toString(),
      username: mongoUser.username,
      email: mongoUser.email,
      password: "",
    });
  }

  async findUserByUsername(username: string) {
    const mongoUser = await userModel.findOne({username});
    if (!mongoUser) return null;
    return new User({
      userId: mongoUser._id.toString(),
      username: mongoUser.username,
      email: mongoUser.email,
      password: "",
    });
  }

  async findUserByEmail(email: string) {
    const mongoUser = await userModel.findOne({email});
    if (!mongoUser) return null;
    return new User({
      userId: mongoUser._id.toString(),
      username: mongoUser.username,
      email: mongoUser.email,
      password: "",
    });
  }

  async findUserByEmailOrUsername(email: string, username: string) {
    const mongoUser = await userModel.findOne({$or: [{username}, {email}]});
    if (!mongoUser) return null;
    return new User({
      userId: mongoUser._id.toString(),
      username: mongoUser.username,
      email: mongoUser.email,
      password: "",
    });
  }
}
