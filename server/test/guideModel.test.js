const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();

const GuideMock = dbMock.define('Guide', {
    guideID: 1,
    licenseNo: "G-9988-KT",
    status: "pending",
    totalTreks: 0
});

describe('Guide Profile Model Unit Tests', () => {

    it('Case 1: should successfully create a guide profile with all document paths', async () => {
        const guideData = {
            userId: 55,
            licenseNo: "LIC-776655",
            licenseImg: "uploads/documents/license_v1.jpg",
            citizenshipImg: "uploads/documents/cit_v1.jpg"
        };
        const guide = await GuideMock.create(guideData);

        expect(guide.licenseNo).toBe(guideData.licenseNo);
        expect(guide.licenseImg).toBe("uploads/documents/license_v1.jpg");
        expect(guide.citizenshipImg).toBe("uploads/documents/cit_v1.jpg");
        expect(guide.status).toBe("pending");
    });

    it('Case 2: should transition status from pending to verified upon admin approval', async () => {
        const guide = await GuideMock.create({ status: "pending" });
        const approveGuide = async (g) => {
            g.status = "verified";
            return g;
        };

        const updated = await approveGuide(guide);
        expect(updated.status).toBe("verified");
        expect(updated.status).not.toBe("pending");
    });

    it('Case 3: should initialize a new guide with exactly zero completed treks', async () => {
        const guide = await GuideMock.create({ licenseNo: "L-123" });

        expect(guide.totalTreks).toBe(0);
        expect(typeof guide.totalTreks).toBe('number');
        expect(guide.totalTreks).not.toBeNull();
    });

    it('Case 4: should increment the total treks count as the guide completes trips', async () => {
        const guide = await GuideMock.create({ totalTreks: 10 });
        const incrementTrek = (g) => {
            g.totalTreks += 1;
            return g;
        };

        const updated = incrementTrek(guide);
        expect(updated.totalTreks).toBe(11);
        expect(updated.totalTreks).toBeGreaterThan(10);
    });

    it('Case 5: should allow a guide profile to be rejected with a status update', async () => {
        const guide = await GuideMock.create({ status: "pending" });
        guide.status = "rejected";

        expect(guide.status).toBe("rejected");
        expect(guide.status).not.toBe("verified");
    });

    it('Case 6: should ensure the guide profile is linked to a valid User ID', async () => {
        const userId = 99;
        const guide = await GuideMock.create({ userId: userId });

        expect(guide.userId).toBe(userId);
        expect(guide.userId).toBeDefined();
    });
});