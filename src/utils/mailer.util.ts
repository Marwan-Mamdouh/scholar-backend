import nodemailer from "nodemailer";
import { mailConfig } from "../config/index.js";

// Create reusable transporter object using SMTP transport configuration
const transporter = nodemailer.createTransport({
	host: mailConfig.host || "smtp.mailtrap.io",
	port: mailConfig.port || 2525,
	secure: mailConfig.port === 465, // true for port 465, false for other ports
	auth: {
		user: mailConfig.user,
		pass: mailConfig.pass,
	},
});

interface SendMailOptions {
	to: string | string[];
	subject: string;
	text?: string;
	html?: string;
}

/**
 * Utility function to send an email
 */
export async function sendEmail({ to, subject, text, html }: SendMailOptions) {
	try {
		const info = await transporter.sendMail({
			from: mailConfig.from || '"Scholar Nexus" <no-reply@scholarnexus.com>',
			to: Array.isArray(to) ? to.join(", ") : to,
			subject,
			text,
			html,
		});
		console.log("✉️ Email sent successfully: %s", info.messageId);
		return info;
	} catch (error) {
		console.error("❌ Failed to send email:", error);
		throw error;
	}
}

export default transporter;
