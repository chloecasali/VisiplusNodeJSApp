const articleService = require("./articles.service");
const UnauthorizedError = require("../../errors/unauthorized");

class ArticlesController {
    async create(req, res, next) {
        try {
            if (!req.user) {
                throw new UnauthorizedError();
            }

            const data = {
                ...req.body,
                user: req.user._id,
            };

            const article = await articleService.create(data);
            req.io.emit("article:create", article);
            res.status(201).json(article);
        } catch (err) {
            next(err);
        }
    }

    async update(req, res, next) {
        try {
            const id = req.params.id;

            if (req.user.role !== "admin") {
                throw new UnauthorizedError();
            }

            const data = req.body;
            const article = await articleService.update(id, data);
            req.io.emit("article:update", article);
            res.json(article);
        } catch (err) {
            next(err);
        }
    }

    async delete(req, res, next) {
        try {
            const id = req.params.id;

            if (req.user.role !== "admin") {
                throw new UnauthorizedError();
            }

            await articleService.delete(id);
            req.io.emit("article:delete", { id });
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new ArticlesController();
