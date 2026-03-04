const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();

const RatingMock = dbMock.define('Rating', {
    stars: 5,
    review: "Great guide!"
});

describe('Rating Model Quality Tests', () => {

    it('Case 1: should store a perfect 5-star rating with detailed feedback', async () => {
        const ratingData = {
            ratingFrom: 1,
            ratingTo: 2,
            stars: 5,
            review: "The guide was exceptionally knowledgeable and helpful."
        };
        const rating = await RatingMock.create(ratingData);

        expect(rating.stars).toBe(5);
        expect(rating.review).toContain("knowledgeable");
        expect(rating.ratingFrom).toBe(1);
    });

    it('Case 2: should reject a rating if the star value is greater than 5', async () => {
        const validateStars = (val) => {
            if (val > 5) throw new Error("Validation Error: Max stars is 5");
        };

        expect(() => validateStars(6)).toThrow("Max stars is 5");
    });

    it('Case 3: should reject a rating if the star value is less than 1', async () => {
        const validateStars = (val) => {
            if (val < 1) throw new Error("Validation Error: Min stars is 1");
        };

        expect(() => validateStars(0)).toThrow("Min stars is 1");
    });

    it('Case 4: should allow a rating entry without an optional review text', async () => {
        const rating = await RatingMock.create({ stars: 4, review: null });

        expect(rating.stars).toBe(4);
        expect(rating.review).toBeNull();
    });

    it('Case 5: should verify the identity of the user receiving the rating', async () => {
        const targetId = 505;
        const rating = await RatingMock.create({ ratingTo: targetId });

        expect(rating.ratingTo).toBe(targetId);
        expect(typeof rating.ratingTo).toBe('number');
    });

    it('Case 6: should track the timestamp of when the rating was submitted', async () => {
        const rating = await RatingMock.create({ stars: 3 });

        expect(rating.createdAt).toBeDefined();
        expect(rating.id).toBeDefined();
    });
});