const { Router } = require("express");
const db = require("../db/db")

const router = Router()

router.get("/:name", async (req, res, next) => {
    try {
        const results = await db.query("SELECT * from foodrecipes WHERE food_name =$1",[req.params.name]);
        return res.json(results.rows)
    } catch (err) {
        return next(err)
    }
})
module.exports = router;