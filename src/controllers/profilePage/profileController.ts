import { db } from "../../db/db_config.js";

export const createProfileController = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            firstName,
            lastName,
            gender,
            country,
            governorate,
            university,
            faculty,
            department,
            graduationYear,
            linkedinUrl,
            githubUrl,
            scholarUrl,
            skills,
            experience,
        } = req.body;

        const newProfile = await db.profile.create({
            data: {
                userId,
                firstName,
                lastName,
                gender,
                country,
                governorate,
                university,
                faculty,
                department,
                graduationYear: graduationYear ? Number(graduationYear) : null,
                linkedinUrl,
                githubUrl,
                scholarUrl,
                skills,
                experience,
            },
        });

        return res.status(201).json({
            success: true,
            message: "Profile created successfully",
            data: newProfile,
        });
    } catch (error) {
        if (error.code === "P2002") {
            return res.status(409).json({
                success: false,
                message: "Profile already exists. Use update instead.",
            });
        }
        console.error("createProfileController error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create profile",
            error: error.message,
        });
    }
};

//  Update 
export const updateProfileController = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            firstName,
            lastName,
            gender,
            country,
            governorate,
            university,
            faculty,
            department,
            graduationYear,
            linkedinUrl,
            githubUrl,
            scholarUrl,
            skills,
            experience,
        } = req.body;

        const updatedProfile = await db.profile.update({
            where: { userId },
            data: {
                firstName,
                lastName,
                gender,
                country,
                governorate,
                university,
                faculty,
                department,
                graduationYear: graduationYear ? Number(graduationYear) : undefined,
                linkedinUrl,
                githubUrl,
                scholarUrl,
                skills,
                experience,
            },
        });

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updatedProfile,
        });
    } catch (error) {

        if (error.code === "P2025") {
            return res.status(404).json({
                success: false,
                message: "Profile not found",
            });
        }
        console.error("updateProfileController error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update profile",
            error: error.message,
        });
    }
};


export const getProfileController = async (req, res) => {
    try {
        const userId = req.user.id;

        const profile = await db.profile.findUnique({
            where: { userId },
        });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            data: profile,
        });

    } catch (error) {
        console.error("getProfileController error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch profile",
            error: error.message,
        });
    }
};


export const deleteProfileController = async (req, res) => {
    try {
        const id = req.params.id;
        const profile = await db.profile.delete({
            where: { userId: id },
        });

        return res.status(200).json({
            success: true,
            message: "Profile deleted successfully",
        });

    } catch (error) {
        console.error("deleteProfileController error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete profile",
            error: error.message,
        });
    }
};