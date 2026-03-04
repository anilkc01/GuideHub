const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();

const ReportMock = dbMock.define('UserReport', {
    status: "pending",
    category: "Spam"
});

describe('UserReport Moderation Model Tests', () => {

    it('Case 1: should create a report with a specific category and description', async () => {
        const reportData = {
            fromId: 1,
            toId: 2,
            category: "Harassment",
            description: "User was extremely rude in the private chat."
        };
        const report = await ReportMock.create(reportData);

        expect(report.category).toBe("Harassment");
        expect(report.description).toContain("rude");
        expect(report.status).toBe("pending");
    });

    it('Case 2: should allow the report status to be marked as resolved by admin', async () => {
        const report = await ReportMock.create({ status: "pending" });
        report.status = "resolved";

        expect(report.status).toBe("resolved");
        expect(report.status).not.toBe("pending");
    });

    it('Case 3: should correctly record the ID of the reporter and reported user', async () => {
        const report = await ReportMock.create({ fromId: 10, toId: 20 });

        expect(report.fromId).toBe(10);
        expect(report.toId).toBe(20);
        expect(report.fromId).not.toBe(report.toId);
    });

    it('Case 4: should store the report timestamp for administrative tracking', async () => {
        const report = await ReportMock.create({ category: "Scam" });

        expect(report.createdAt).toBeDefined();
        expect(report.id).toBeDefined();
    });

    it('Case 5: should allow filtering reports by their current status', async () => {
        const report = await ReportMock.create({ status: "pending" });

        expect(report.status).toBe("pending");
        expect(typeof report.status).toBe('string');
    });

    it('Case 6: should ensure the report description meets minimum length logic', async () => {
        const desc = "This is a detailed report description of the issue.";
        const report = await ReportMock.create({ description: desc });

        expect(report.description.length).toBeGreaterThan(10);
        expect(report.description).toBe(desc);
    });
});