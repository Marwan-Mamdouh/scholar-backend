import { db } from "../../db/db_config.js";

// Meet Our Teams 
const formatTeamName = (value) => {
    const words = String(value)
        .toLowerCase()
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    return words.endsWith("Team") ? words : `${words} Team`;
};

export const getTeamsController = async (req, res) => {
    try {
        const members = await db.teamMember.findMany({
            orderBy: { createdAt: "asc" },
            select: {
                id: true,
                name: true,
                role: true,
                linkedinUrl: true,
                team: true,
            },
        });

        const teamsMap = {};
        for (const member of members) {
            if (!teamsMap[member.team]) {
                teamsMap[member.team] = {
                    key: member.team,
                    name: formatTeamName(member.team),
                    membersCount: 0,
                    members: [],
                };
            }
            teamsMap[member.team].members.push({
                id: member.id,
                name: member.name,
                role: member.role,
                linkedinUrl: member.linkedinUrl,
            });
            teamsMap[member.team].membersCount++;
        }

        const teams = Object.values(teamsMap);

        return res.status(200).json({
            success: true,
            data: {
                stats: {
                    totalTeams: teams.length,
                    totalMembers: members.length,
                },
                teams,
            },
        });
    } catch (error) {
        console.error("getTeamsController error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch teams",
            error: error.message,
        });
    }
};

// Start A Conversation

// Save a message sent from the contact form → feedbacks table
export const sendContactMessageController = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name?.trim() || !email?.trim() || !message?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Name, email and message are required",
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email",
            });
        }

        if (message.length > 2000) {
            return res.status(400).json({
                success: false,
                message: "Message is too long (max 2000 characters)",
            });
        }

        
        const [firstName, ...rest] = name.trim().split(/\s+/);
        const lastName = rest.length > 0 ? rest.join(" ") : null;

        const newFeedback = await db.feedback.create({
            data: {
                firstName,
                lastName,
                email: email.trim().toLowerCase(),
                message: message.trim(),
            },
        });

        return res.status(201).json({
            success: true,
            message: "Message sent successfully. We'll get back to you soon.",
            data: newFeedback,
        });
    } catch (error) {
        console.error("sendContactMessageController error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to send message",
            error: error.message,
        });
    }
};