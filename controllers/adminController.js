import jwt from 'jsonwebtoken';
import AdminService from "../services/adminService.js";
import ValidationError from './errorHandler.js';
import { text } from 'express';

const defaultCookieOptions = {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24,
}

const createAdminToken = (admin) => {
          return jwt.sign({ admin, isAdmin: true }, process.env.SECRET_KEY, {
                    expiresIn: '7d',
          })
}

export const createAdmin = async (req, res) => {
          try {
                    const admin = await AdminService.createNewUser(req.body)
                    res.status(201).json(admin)
          } catch (error) {
                    res.status(400).json(error)
          }
}

export const adminLogin = async (req, res) => {
          try {
                    console.log(req.body);

                    const user = await AdminService.validateLogin(req.body)
                    if (user) {
                              const token = createAdminToken({ id: user._id, email: user.email })
                              res.cookie('authToken', token, defaultCookieOptions)
                              res.status(200).json({ success: true, data: { id: user._id, email: user.email } })
                    } else {
                              res.status(400).json(new ValidationError('Invalid credentials', 'email', 400));
                    }
          } catch (error) {
                    res.status(400).json(error)
          }
}

export const verifyAdminToken = async (req, res) => {
          try {
                    const token = req.cookies.authToken;
                    if (!token) {
                              return res.status(401).json({ error: "Unauthorized access. Please log in." });
                    }
                    const decoded = jwt.verify(token, process.env.SECRET_KEY);
                    if (!decoded.isAdmin) {
                              return res.status(401).json({ error: "Unauthorized access. Administrators only could access this page." });
                    }
                    res.status(200).json(decoded);
          } catch (error) {
                    res.status(401).json({ error: "Invalid or expired token. Please log in again." });

          }
}