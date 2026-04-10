import type { FileFilterCallback } from "multer";

const createFileFilter = (allowedTypes: string[]) => {
	return (_: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
		if (allowedTypes.includes(file.mimetype)) {
			cb(null, true);
		} else {
			cb(new Error(`Invalid file type. Allowed: ${allowedTypes.join(", ")}`));
		}
	};
};

module.exports = { createFileFilter };
