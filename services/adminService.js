import BaseUserService from "./baseUserService.js";
import Admin from "../models/Admin.js";
class UserService extends BaseUserService {
          constructor() {
                    super(Admin)
          }
}

export default new UserService()