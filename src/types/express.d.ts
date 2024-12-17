declare namespace Express {
  export interface Multer {
    File: {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      path: string;
      filename: string;
      size: number;
    };
  }
}
