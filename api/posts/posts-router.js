// implement your posts router here
const express = require('express')
const router = express.Router()
const post = require('./posts-model')

 router.get('/', (req, res) => {
    post.find()
        .then(found => {
            res.json(found)
        })
        .catch(err => {
            res.status(500).json({
                message: "The posts information could not be retrieved",
                err: err.message,
                stack: err.stack
            })
        })
 })

 router.get('/:id', async (req, res) => {
    try{
        const id = await post.findById(req.params.id)
        if (!id) {
            res.status(404).json({
            message: "The post with the specified ID does not exist"
            })
        } else {res.json(id)}
    }
    catch(err) {
        res.status(500).json({
            message: "The post information could not be retrieved",
            err: err.message,
            stack: err.stack
        })
    }
 })

 router.post('/', (req, res) => {
    const {title, contents} = req.body
    if (!title || !contents){
        res.status(400).json({
            message: "Please provide title and contents for the post"
            })
    } else {
        post.insert({title, contents})
            .then(
                ({id}) => {return post.findById(id)}
            )
            .then(post => {
                res.status(201).json(post)
            })
            .catch(err => {
                res.status(500).json({
                    message: "There was an error while saving the post to the database",
                    err: err.message,
                    stack: err.stack
                })
        })

    }
 })

 router.delete('/:id', async (req, res) => {
    try{
        const id = await post.findById(req.params.id)
        if (!id){
                res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        } else {
            await post.remove(req.params.id)
            res.json(id)
        }
    }
    catch(err) {
        res.status(500).json({
            message: "The post could not be removed",
            err: err.message,
            stack: err.stack
        })
    }   
 })

 router.put('/:id', (req, res) => {
    const {title, contents} = req.body
    if (!title || !contents){
            res.status(400).json({
            message: "Please provide title and contents for the post"
            })
    } else {
        post.findById(req.params.id)
            .then(id => {
                if(!id){
                    res.status(404).json({
                    message: "The post with the specified ID does not exist",
                    })
                } else {
                    return post.update(req.params.id, req.body)
                }
            })
            .then(data => {
                if(data){
                    return post.findById(req.params.id)
                }
            })
            .then(post => {
                if (post){
                   return res.json(post)
                }
            })
            .catch(err => {
                res.status(500).json({
                    message: "The post information could not be modified",
                    err: err.message,
                    stack: err.stack
                })
        })

    }
 })

 router.get('/:id/messages', async (req, res) => {
    try{
        const id = await post.findById(req.params.id)
        if (!id) {
            res.status(404).json({
            message: "The post with the specified ID does not exist"
            })
        } else {
            const messages = await post.findPostComments(req.params.id)
            res.json(messages)
        }
    }
    catch(err) {
        res.status(500).json({
            message: "The post information could not be retrieved",
            err: err.message,
            stack: err.stack
        })
    }
 })



module.exports = router