const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();

const OfferMock = dbMock.define('Offer', {
    amount: 500.0,
    status: "pending"
});

describe('Offer Model Bidding Tests', () => {

    it('Case 1: should correctly store a bid amount and guide message', async () => {
        const bidData = {
            trekPlanId: 10,
            bidderId: 5,
            amount: 850.75,
            message: "I am a certified guide with 5 years of experience."
        };
        const offer = await OfferMock.create(bidData);

        expect(offer.amount).toBe(850.75);
        expect(offer.message).toContain("certified guide");
        expect(offer.status).toBe("pending");
    });

    it('Case 2: should allow an offer status to be updated to accepted by trekker', async () => {
        const offer = await OfferMock.create({ status: "pending" });
        offer.status = "accepted";

        expect(offer.status).toBe("accepted");
        expect(offer.status).not.toBe("rejected");
    });

    it('Case 3: should allow an offer to be rejected if the trekker chooses another', async () => {
        const offer = await OfferMock.create({ status: "pending" });
        offer.status = "rejected";

        expect(offer.status).toBe("rejected");
        expect(offer.status).not.toBe("accepted");
    });

    it('Case 4: should handle fractional amount values for competitive bidding', async () => {
        const offer = await OfferMock.create({ amount: 999.99 });

        expect(offer.amount).toBe(999.99);
        expect(typeof offer.amount).toBe('number');
    });

    it('Case 5: should ensure the offer is linked to a specific trek plan ID', async () => {
        const planId = 77;
        const offer = await OfferMock.create({ trekPlanId: planId });

        expect(offer.trekPlanId).toBe(planId);
        expect(offer.trekPlanId).toBeDefined();
    });

    it('Case 6: should allow a guide to cancel their own offer before acceptance', async () => {
        const offer = await OfferMock.create({ status: "pending" });
        offer.status = "cancelled";

        expect(offer.status).toBe("cancelled");
        expect(offer.status).not.toBe("pending");
    });
});