import { cleanupClosedJobs, syncCompanyMonthlyStats, purgeExpiredCompanyStats } from "../../lib/jobsDb.js";

export const cleanupJobsCronController = async (req, res) => {
    try {
        const result = await cleanupClosedJobs(50);
        return res.status(200).json({
            success: true,
            checked: result.checked,
            closed: result.closed,
            message: `Checked ${result.checked} jobs, found ${result.closed} closed.`
        });
    } catch (error: any) {
        console.error("Error in cleanup cron:", error);
        return res.status(500).json({ success: false, message: "Internal server error", details: error.message });
    }
};

export const syncCompanyStatsCronController = async (req, res) => {
    try {
        const syncResult = await syncCompanyMonthlyStats();
        const purgeResult = await purgeExpiredCompanyStats();

        return res.status(200).json({
            success: true,
            message: "Company monthly stats synced and expired records purged successfully.",
            syncedMonths: syncResult.syncedMonths,
            deletedExpiredRecords: purgeResult.deletedCount,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error("Error in sync-company-stats cron:", error);
        return res.status(500).json({ success: false, message: "Internal server error", details: error.message });
    }
};
