import multer from "multer";
import ValidationError from "../controllers/errorHandler.js";
// Set up Multer storage configuration
const storage = multer.diskStorage({
          destination: function (req, file, cb) {
                    cb(null, './images/vehicles'); // Set the destination folder
          },
          filename: function (req, file, cb) {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Generate a unique filename
                    cb(null, file.fieldname + '-' + uniqueSuffix);
          }
});
const imageFileFilter = (req, file, cb) => {
          // Check the file's mimetype
          if (file.mimetype.startsWith('image/')) {
                    cb(null, true);  // Accept the file
          } else {
                    cb(new Error('Only image files are allowed ex(jpg, jpeg, png)'), false);  // Reject the file
          }
};

// Initialize Multer with the storage configuration
const upload = multer({ storage: storage, fileFilter: imageFileFilter });

// Middleware to handle file upload and group by license plate
export const fileUpload = (req, res, next) => {
          // Use Multer's array method to handle multiple files
          upload.array('images', 5)(req, res, (err) => {
                    if (err instanceof multer.MulterError) {
                              // Handle Multer-specific errors
                              return res.status(500).json(new ValidationError(err.message, 'images', 400));
                    } else if (err) {
                              // Handle other errors
                              return res.status(500).json(new ValidationError(err.message, 'images', 400));
                    }
                    next();
          });
};
