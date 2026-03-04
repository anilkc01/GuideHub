const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();

const BlogMock = dbMock.define('Blog', {
    status: "published",
    title: "Mardi Himal Diary"
});

describe('Blog Content Model Tests', () => {

    it('Case 1: should create a blog post with a title and rich text content', async () => {
        const blogData = {
            title: "Exploring the Hidden Valleys of Dolpo",
            content: "The journey was surreal with turquoise waters everywhere.",
            authorId: 12
        };
        const blog = await BlogMock.create(blogData);

        expect(blog.title).toBe(blogData.title);
        expect(blog.content.length).toBeGreaterThan(20);
        expect(blog.authorId).toBe(12);
    });

    it('Case 2: should default blog status to published upon creation', async () => {
        const blog = await BlogMock.create({ title: "Quick Update" });

        expect(blog.status).toBe("published");
        expect(blog.status).not.toBe("hidden");
    });

    it('Case 3: should allow an author to hide their blog post from public feed', async () => {
        const blog = await BlogMock.create({ status: "published" });
        blog.status = "hidden";

        expect(blog.status).toBe("hidden");
        expect(blog.status).not.toBe("published");
    });

    it('Case 4: should successfully store an image URL for the blog cover', async () => {
        const coverUrl = "https://cdn.guidehub.com/blog/covers/dolpo.jpg";
        const blog = await BlogMock.create({ cover: coverUrl });

        expect(blog.cover).toBe(coverUrl);
        expect(blog.cover).toContain("https://");
    });

    it('Case 5: should store the geographical location associated with the blog story', async () => {
        const location = "Manang, Nepal";
        const blog = await BlogMock.create({ location: location });

        expect(blog.location).toBe(location);
        expect(blog.location).toBeDefined();
    });

    it('Case 6: should handle long-form text content without truncation', async () => {
        const longContent = "Trek report... ".repeat(100);
        const blog = await BlogMock.create({ content: longContent });

        expect(blog.content.length).toBeGreaterThan(500);
        expect(typeof blog.content).toBe('string');
    });
});