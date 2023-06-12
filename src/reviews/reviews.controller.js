const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const methodNotAllowed = require("../errors/methodNotAllowed");

async function list(req, res, next){

    const test = await service.list()
    res.json({test})
}

async function update(req, res){
    const updatedReview = {
        ...req.body.data,
        review_id: res.locals.review.review_id
    }
    const critic1 = await service.readCritic(res.locals.review.critic_id)
    await service.update(updatedReview)
    const data = await service.read(res.locals.review.review_id)
    console.log('********************************************************')
    console.log(data)
    console.log('*******************************************************')
    data.critic = critic1
    res.json({data})
}

async function read(req, res) {
    res.json({ data: res.locals.review });
  }


async function reviewExists(req, res, next){
    const review = await service.read(req.params.reviewId)
    if(review){
        res.locals.review = review
        return next()
    }
    next({ status: 404, message: `Review cannot be found.` });
}


async function destroy(req, res) {
    await service.delete(res.locals.review.review_id);
    res.sendStatus(204);
  }

module.exports={
    list: asyncErrorBoundary(list),
    update: [
        // hasValidFields,
        asyncErrorBoundary(reviewExists),
        asyncErrorBoundary(update)
    ],
    read:[
        asyncErrorBoundary(reviewExists),
        read
    ],
    delete: [
        asyncErrorBoundary(reviewExists),
        asyncErrorBoundary(destroy)
    ]
}