const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mockingoose = require("mockingoose");
const Article = require("../api/articles/articles.schema");
const articlesService = require("../api/articles/articles.service");
const User = require("../api/users/users.model");

describe("tester API articles", () => {
    let token;
    const USER_ID = "fake";
    const ARTICLE_ID = "fakeArticle";

    const MOCK_ARTICLE = {
        _id: ARTICLE_ID,
        title: "Article Title",
        content: "This is the content of the article.",
        user: USER_ID,
        status: "draft",
    };

    const MOCK_ARTICLE_CREATED = {
        title: "New Article Title",
        content: "This is a new article content.",
        user: USER_ID,
        status: "published",
    };

    const MOCK_USER = {
        _id: USER_ID,
        name: "ana",
        email: "nfegeg@gmail.com",
        password: "azertyuiop",
        // role: "admin",
    };

    beforeEach(() => {
        token = jwt.sign({ userId: USER_ID }, config.secretJwtToken);

        mockingoose(Article).toReturn(MOCK_ARTICLE, "findOne");
        mockingoose(Article).toReturn(MOCK_ARTICLE_CREATED, "save");
        mockingoose(Article).toReturn(MOCK_ARTICLE, "findByIdAndUpdate");
        mockingoose(Article).toReturn(MOCK_ARTICLE, "deleteOne");

        mockingoose(User).toReturn(MOCK_ARTICLE, "find");
        mockingoose(User).toReturn(MOCK_ARTICLE_CREATED, "save");
        mockingoose(User).toReturn(MOCK_USER, "findById");

    });

    test("[Articles] Create Article", async () => {
        const res = await request(app)
            .post("/api/articles")
            .send(MOCK_ARTICLE_CREATED)
            .set("x-access-token", token);
        expect(res.status).toBe(201);
        expect(res.body.title).toBe(MOCK_ARTICLE_CREATED.title);
        expect(res.body.content).toBe(MOCK_ARTICLE_CREATED.content);
    });

    test("[Articles] Update Article", async () => {
        const updatedArticleData = {
            title: "Updated Article Title",
            content: "Updated content",
            status: "published",
        };

        console.log(token)
        const res = await request(app)
            .put(`/api/articles/${ARTICLE_ID}`)
            .send(updatedArticleData)
            .set("x-access-token", token);

        expect(res.status).toBe(200);
        expect(res.body.title).toBe(updatedArticleData.title);
        expect(res.body.content).toBe(updatedArticleData.content);
        expect(res.body.status).toBe(updatedArticleData.status);
    });

    test("[Articles] Delete Article", async () => {
        const res = await request(app)
            .delete(`/api/articles/${ARTICLE_ID}`)
            .set("x-access-token", token);

        expect(res.status).toBe(204);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });
});
