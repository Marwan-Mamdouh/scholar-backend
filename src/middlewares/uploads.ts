const multer = require("multer");
const { createFileFilter } = require("../config/multer");

const uploadAvatar = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
	fileFilter: createFileFilter(["image/png", "image/jpeg", "image/jpg"]),
});

const uploadCV = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
	fileFilter: createFileFilter(["application/pdf", "application/msword"]),
});

module.exports = { uploadAvatar, uploadCV };
