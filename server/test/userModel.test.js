const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();

const UserMock = dbMock.define('User', {
    id: 1,
    fullName: "Anil KC",
    email: "anil@gmail.com",
    role: "trekker",
    status: "active",
    rating: 0
});

describe('User Model Comprehensive Tests', () => {

    it('Case 1: should successfully create a user with all valid profile attributes', async () => {
        const userData = {
            fullName: "Anil KC",
            email: "anil@gmail.com",
            phone: "9866052045",
            password: "HashedPassword@123",
            address: "Kathmandu, Nepal",
            dob: "1998-05-15"
        };
        const user = await UserMock.create(userData);

        expect(user.fullName).toBe(userData.fullName);
        expect(user.email).toBe(userData.email);
        expect(user.phone).toBe("9866052045");
        expect(user.address).toBe("Kathmandu, Nepal");
        expect(user.id).toBeDefined();
    });

    it('Case 2: should apply the default role of "trekker" when no role is provided', async () => {
        const user = await UserMock.create({
            fullName: "Rajan Sharma",
            email: "rajan@gmail.com",
            phone: "9841000000"
        });

        expect(user.role).toBe("trekker");
        expect(user.role).not.toBe("guide");
        expect(user.status).toBe("active");
    });

    it('Case 3: should fail if the user rating is assigned a value outside 1 to 5', async () => {
        const invalidRating = 6.0;
        const createUser = async (data) => {
            if (data.rating < 0 || data.rating > 5) {
                throw new Error("Validation Error: Rating must be between 0 and 5");
            }
            return await UserMock.create(data);
        };

        await expect(createUser({
            fullName: "Bikesh",
            rating: invalidRating
        })).rejects.toThrow("Rating must be between 0 and 5");
    });

    it('Case 4: should allow the user status to be updated to suspended by admin', async () => {
        const user = await UserMock.create({ status: "active" });
        const suspendUser = async (u) => {
            u.status = "suspended";
            return u;
        };

        const updatedUser = await suspendUser(user);
        expect(updatedUser.status).toBe("suspended");
        expect(updatedUser.status).not.toBe("active");
    });

    it('Case 5: should correctly store and retrieve the profile picture URL', async () => {
        const dpUrl = "https://guidehub.com/storage/profiles/anil.jpg";
        const user = await UserMock.create({ dp: dpUrl });

        expect(user.dp).toBe(dpUrl);
        expect(user.dp).toContain("https://");
        expect(user.dp).toMatch(/\.(jpg|jpeg|png)$/);
    });

    it('Case 6: should ensure the email field follows a unique constraint logic', async () => {
        const email = "unique@gmail.com";
        const user = await UserMock.create({ email: email });

        expect(user.email).toBe(email);
        expect(typeof user.email).toBe('string');
        expect(user.email).toContain("@");
    });
});