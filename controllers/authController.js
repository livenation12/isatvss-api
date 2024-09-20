import UserService from "../services/userService.js"
import jwt from 'jsonwebtoken'
import ValidationError from "./errorHandler.js"
import { inviteActivty } from "../services/activityService.js"
import { baseMailOptions, transporter } from "../services/mailerService.js"

const createInviteToken = (email) => {
          return jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '24h' })
}

const inviteMailOptions = (email, token) => {
          return {
                    ...baseMailOptions,
                    to: email,
                    subject: 'Vehicle Scheduling System (VSS) - Account creation',
                    text: `Please click the following link to create your account: ${process.env.ACCOUNT_CREATION_URL}?token=${token}`
          }
}

export const sendInvite = async (req, res) => {
          const { email, from } = req.body
          if (!email) {
                    res.status(400).json(new ValidationError('Email is required', 'email', 400));
          }
          try {
                    const token = createInviteToken(email)
                    const options = inviteMailOptions(email, token)
                    const sendEmail = await transporter.sendMail(options)
                    if (sendEmail) {
                              const log = await inviteActivty(from, email)
                              if (log) {
                                        res.status(200).json({ success: true })
                              }
                    }
          } catch (error) {
                    res.status(400).json(error)
          }
}

export const create = async (req, res) => {
          try {
                    const newUser = await UserService.createNewUser(req.body);
                    const token = createUserToken({ id: newUser._id, email: newUser.email })
                    res.cookie('authToken', token, defaultCookieOptions)
                    res.status(201).json({ data: newUser, success: true })
          } catch (error) {
                    res.status(400).json(error)
          }
}

const createUserToken = (user) => {
          return jwt.sign({ user, isUser: true, }, process.env.SECRET_KEY, { expiresIn: '1d' })
}

const defaultCookieOptions = {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
}
export const login = async (req, res) => {
          try {
                    const user = await UserService.validateLogin(req.body)
                    if (user) {
                              const token = createUserToken({ id: user._id, email: user.email })
                              res.cookie('authToken', token, defaultCookieOptions)
                              res.status(200).json({ success: true, data: { id: user._id, email: user.email } })
                    } else {
                              res.status(400).json(new ValidationError('Invalid credentials', 'email', 400));
                    }
          } catch (error) {
                    res.status(400).json(error)
          }
}

export const logout = (req, res) => {
          res.cookie('authToken', '', { maxAge: 1 });
          res.json({ success: true })
}

export const verifyUserToken = (req, res) => {
          const token = req.cookies.authToken
          if (!token) {
                    return res.status(401).json({ error: "Unauthorized access. Please log in." });
          }
          try {
                    const decoded = jwt.verify(token, process.env.SECRET_KEY);
                    res.status(200).json(decoded);
          } catch (error) {
                    res.status(401).json({ error: "Invalid or expired token. Please log in again." });
          }
}

export const verifyInviteToken = (req, res) => {
          const { token } = req.body
          if (!token) {
                    return res.status(401).json({ error: "Unauthorized access" });
          }
          try {
                    const decoded = jwt.verify(token, process.env.SECRET_KEY);
                    res.status(200).json({ decoded, success: true });
          } catch (error) {
                    res.status(401).json({ error: "Invalid or expired token. Please request a new invite" });
          }
}