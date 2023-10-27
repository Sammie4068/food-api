const express = require("express")
const cors = require("cors");
const morgan = require("morgan")
const recipeRoute = require("./routes/recipe")

const app = express();

app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());
app.use("/api/v1", cors(), recipeRoute)

const PORT = process.env.PORT || 5050

app.use((req, res, next) => {
    let err = new Error("Not Found");
    err.status =404;
    next(err);
});

if(app.get("env") === "development"){
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.send({
            message: err.message,
            error: err
        })
    })
}

app.listen(PORT, ()=>{
    console.log("serving running...")
})