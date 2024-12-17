import { diskStorage } from 'multer';
import * as path from 'path';

export const multerOptions = {
  storage: diskStorage({
    destination: './Images/profile',
    filename: (req, file, callback) => {
      const date = new Date().toISOString();
      const fileExtension = path.extname(file.originalname);
      const uniqueName = `${date}${fileExtension}`;
      callback(null, uniqueName);
    },
  }),
};
