const express = require("express")
const Project = require("../data/helpers/projectModel")
const router = express.Router()

router.get("/", (req, res) => {
    Project.get()
        .then(results => res.status(200).json(results))
        .catch(() => {
            res.status(500).json({ errorMessage: "Couldn't retrieve all Projects" })
        })
})

router.get("/:id", validateProjectId, (req, res) => {
    Project.get(req.params.id).then(results =>
        res
            .status(200)
            .json(results)
            .catch(() =>
                res
                    .status(500)
                    .json({ errorMessage: "Couldnt sent the specific project" })
            )
    )
})

router.post("/", validateProjectResource, (req, res) => {
    Project.insert(req.body)
        .then(add => res.status(201).json({ Created: add }))
        .catch(() =>
            res
                .status(500)
                .json({ errorMessage: "Error with adding new project to database" })
        )
})

function validateProjectResource(req, res, next) {
    if (req.body.name === undefined) {
        res.status(400).json({
            errorMessage: "Make sure your project has name field"
        })
    } else if (req.body.description === undefined) {
        res.status(400).json({
            errorMessage: "Make sure your project has description field"
        })
    } else {
        next()
    }
}

function validateProjectId(req, res, next) {
    Project.get(req.params.id)
        .then(results => {
            if (results) {
                next()
            } else {
                res.status(400).json({ errorMessage: "Invalid Project ID" })
            }
        })
        .catch(() =>
            res.status(500).json({ errorMessage: "Error with accessing Projects" })
        );
}

module.exports = router