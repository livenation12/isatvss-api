import BaseUserService from "./baseUserService.js";
import User from "../models/User.js";
class UserService extends BaseUserService {
          constructor() {
                    super(User)
          }
}

export default new UserService()