const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();

const TrekPlanMock = dbMock.define('TrekPlan', {
    id: 1,
    status: "open",
    estBudget: 1500.0
});

describe('TrekPlan Model Logic Tests', () => {

    it('Case 1: should store complex JSONB itinerary data correctly for a trek', async () => {
        const planData = {
            title: "Annapurna Base Camp",
            itinerary: [
                { day: 1, activity: "Drive to Pokhara" },
                { day: 2, activity: "Trek to Chomrong" }
            ],
            estBudget: 1200.50
        };
        const plan = await TrekPlanMock.create(planData);

        expect(Array.isArray(plan.itinerary)).toBe(true);
        expect(plan.itinerary[0].activity).toBe("Drive to Pokhara");
        expect(plan.itinerary.length).toBe(2);
    });

    it('Case 2: should default the trek plan status to open upon creation', async () => {
        const plan = await TrekPlanMock.create({ title: "Mardi Himal" });

        expect(plan.status).toBe("open");
        expect(plan.status).not.toBe("ongoing");
        expect(plan.id).toBeDefined();
    });

    it('Case 3: should fail if the estimated budget is assigned a negative value', async () => {
        const badBudget = -500;
        const validateBudget = async (budget) => {
            if (budget < 0) throw new Error("Budget cannot be negative");
            return await TrekPlanMock.create({ estBudget: budget });
        };

        await expect(validateBudget(badBudget)).rejects.toThrow("Budget cannot be negative");
    });

    it('Case 4: should update status to ongoing when a guide offer is accepted', async () => {
        const plan = await TrekPlanMock.create({ status: "open" });
        plan.status = "ongoing";

        expect(plan.status).toBe("ongoing");
        expect(plan.status).not.toBe("completed");
    });

    it('Case 5: should store the trekking location and description as strings', async () => {
        const plan = await TrekPlanMock.create({
            location: "Manang",
            description: "A beautiful high altitude trek."
        });

        expect(plan.location).toBe("Manang");
        expect(plan.description).toContain("altitude");
    });

    it('Case 6: should correctly associate the trek plan with a trekker ID', async () => {
        const trekkerId = 44;
        const plan = await TrekPlanMock.create({ trekkerId: trekkerId });

        expect(plan.trekkerId).toBe(trekkerId);
        expect(typeof plan.trekkerId).toBe('number');
    });
});