import bcrypt from 'bcrypt';
import ValidationError from '../controllers/errorHandler.js';

class BaseUserService {
          constructor(model) {
                    this.model = model;
          }

          // Helper methods
          async getUserByEmail(email) {
                    try {
                              return await this.model.findOne({ email });
                    } catch (error) {
                              throw new ValidationError('Error at getting user', 'email', 500);
                    }
          }

          async hashPassword(data) {
                    try {
                              const salt = await bcrypt.genSalt(10);
                              const hashedPassword = await bcrypt.hash(data.password, salt);
                              if (hashedPassword) {
                                        data.password = hashedPassword;
                              }
                              return data;
                    } catch (error) {
                              throw new ValidationError('Error at hashing password', 'password', 500);
                    }
          }

          validateUser(data) {
                    if (data.password.length < 8) {
                              throw new ValidationError('Password must be at least 8 characters', 'password', 400);
                    }
                    if (data.password !== data.confirmPassword) {
                              throw new ValidationError('Passwords do not match', 'confirmPassword', 400);
                    }
                    delete data.confirmPassword;
          }

          // Exported methods
          async createNewUser(data) {
                    console.log(data);
                    
                    this.validateUser(data);
                    const userExists = await this.getUserByEmail(data.email);
                    if (userExists) {
                              throw new ValidationError('User already exists', 'email', 409);
                    }
                    const dataWithHashedPassword = await this.hashPassword(data);
                    if (dataWithHashedPassword) {
                              const newUser = new this.model(data);
                              return await newUser.save();
                    }
          }

          async validateLogin(data) {
                    const user = await this.getUserByEmail(data.email);
                    if (!user) {
                              throw new ValidationError('Email not found', 'email', 404);
                    }
                    const isMatch = await bcrypt.compare(data.password, user.password);
                    if (!isMatch) {
                              throw new ValidationError('Incorrect password', 'password', 401);
                    }
                    return user;
          }
}

export default BaseUserService;
