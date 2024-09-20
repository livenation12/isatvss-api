import nodemailer from "nodemailer"


export const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
                    user: process.env.SERVICE_EMAIL,
                    pass: process.env.SERVICE_EMAIL_PASSWORD
          }
})

export const baseMailOptions = {
          from: process.env.SERVICE_EMAIL,
}