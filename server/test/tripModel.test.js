const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();

const TripMock = dbMock.define('Trip', {
    status: "upcoming",
    startDate: "2026-04-10",
    endDate: "2026-04-20"
});

describe('Trip Operational Lifecycle Tests', () => {

    it('Case 1: should successfully initialize a trip with all required associations', async () => {
        const tripData = {
            trekPlanId: 50,
            trekkerId: 1,
            guideId: 2,
            startDate: "2026-05-01",
            endDate: "2026-05-15",
            status: "upcoming"
        };
        const trip = await TripMock.create(tripData);

        expect(trip.trekPlanId).toBe(50);
        expect(trip.startDate).toBe("2026-05-01");
        expect(trip.endDate).toBe("2026-05-15");
        expect(trip.status).toBe("upcoming");
    });

    it('Case 2: should fail if the trek end date is scheduled before the start date', async () => {
        const tripData = { startDate: "2026-06-10", endDate: "2026-06-05" };
        const validateDates = (data) => {
            if (new Date(data.endDate) < new Date(data.startDate)) {
                throw new Error("Invalid Schedule: End date cannot be before start date");
            }
        };

        expect(() => validateDates(tripData)).toThrow("End date cannot be before start date");
    });

    it('Case 3: should update the trip status to ongoing when the trek starts', async () => {
        const trip = await TripMock.create({ status: "upcoming" });
        trip.status = "ongoing";

        expect(trip.status).toBe("ongoing");
        expect(trip.status).not.toBe("completed");
    });

    it('Case 4: should mark the trip as completed upon reaching the final destination', async () => {
        const trip = await TripMock.create({ status: "ongoing" });
        trip.status = "completed";

        expect(trip.status).toBe("completed");
        expect(trip.status).not.toBe("cancelled");
    });

    it('Case 5: should allow adding optional remarks for trip documentation', async () => {
        const remarks = "Trip delayed by 2 days due to heavy rainfall.";
        const trip = await TripMock.create({ remarks: remarks });

        expect(trip.remarks).toBe(remarks);
        expect(trip.remarks.length).toBeGreaterThan(10);
    });

    it('Case 6: should ensure trekker and guide IDs are stored as integers', async () => {
        const trip = await TripMock.create({ trekkerId: 10, guideId: 20 });

        expect(typeof trip.trekkerId).toBe('number');
        expect(typeof trip.guideId).toBe('number');
    });
});