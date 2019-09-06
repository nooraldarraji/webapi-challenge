const express = require("express")
const actions = require("../data/helpers/actionModel")
const router = express.Router()

router.get("/:id", validateActionId, (req, res) => {
    actions.get(req.params.id)
        .then(results => res.status(200).json(results))
        .catch(() =>
            res.status(500).json({ errorMessage: "Couldnt sent the action project" })
        )
})

router.post("/", validateActionResource, (req, res) => {
    actions.insert(req.body)
        .then(add => res.status(201).json({ Created: add }))
        .catch(() =>
            res
                .status(500)
                .json({ errorMessage: "Error with adding new action to database" })
        )
})

router.delete("/:id", validateActionId, (req, res) => {
    actions.remove(req.params.id)
        .then(results => res.status(200).json({ recordsDeleted: results }))
        .catch(() =>
            res
                .status(500)
                .json({ errorMessage: "Error in removing specific project" })
        )
})

router.put("/:id", [validateActionId, validateActionResource], (req, res) => {
    Actions.update(req.params.id, req.body)
        .then(update => res.status(202).json({ projectUpdated: update }))
        .catch(() =>
            res
                .status(500)
                .json({ errorMessage: "Error updating the specific Project" })
        );
});

function validateActionId(req, res, next) {
    actions.get(req.params.id)
        .then(results => {
            if (results) {
                next()
            } else {
                res.status(400).json({ errorMessage: "Invalid Action ID" })
            }
        })
        .catch(() =>
            res.status(500).json({ errorMessage: "Error with accessing actions" })
        )
}

function validateActionResource(req, res, next) {
    if (req.body.project_id === undefined) {
        res.status(400).json({
            errorMessage: "Make sure your action has a project_id"
        })
    } else if (req.body.description === undefined) {
        res.status(400).json({
            errorMessage: "Make sure your action has description field"
        })
    } else if (req.body.notes === undefined) {
        res
            .status(404)
            .json({ errorMessage: "Make sure your action has a notes field" })
    } else if (req.body.description.length > 128) {
        res.status(404).json({
            errorMessage:
                "Woah there, description has too many characters, keep it under 128 characters"
        })
    } else {
        next()
    }
}

module.exports = router