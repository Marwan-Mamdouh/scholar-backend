import supabase from "../../lib/db.js";
const BUCKET = "uploads";

const storageService = {
	async upload(
		file: Buffer,
		fileName: string,
		mimeType: string,
	): Promise<string> {
		const path = `${Date.now()}-${fileName}`;

		const { error } = await supabase.storage
			.from(BUCKET)
			.upload(path, file, { contentType: mimeType, upsert: false });

		if (error) throw new Error(`Upload failed: ${error.message}`);

		const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
		return data.publicUrl;
	},

	async delete(path: string): Promise<void> {
		const { error } = await supabase.storage.from(BUCKET).remove([path]);
		if (error) throw new Error(`Delete failed: ${error.message}`);
	},
};

export default storageService;
