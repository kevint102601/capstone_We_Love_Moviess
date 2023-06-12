const service = require("./movies.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res){

    const data = await service.list(req.query.is_showing)
    res.json({data})
}

async function read(req, res){
    res.json({data: res.locals.movie})
}

async function movieExists(req,res,next){
    const movie = await service.read(req.params.movieId)
    if(movie){
        res.locals.movie = movie
        return next();
    }
    next({ status: 404, message: `Movie cannot be found.` });
}

async function movieExists2(req,res,next){
    const movie = await service.readMovieTheater(req.params.movieId)
    if(movie){
        res.locals.movie = movie
        return next();
    }
    next({ status: 404, message: `Movie cannot be found.` });
}

async function movieExists3(req,res,next){
    const movie = await service.readMovieReviews(req.params.movieId)
    if(movie){
        movie.map((review, indx)=>{
            return review.critic = review.critic[0]
        });
        res.locals.movie = movie
        return next();
    }
    next({ status: 404, message: `Movie cannot be found.` });
}


module.exports = {
    list: asyncErrorBoundary(list),
    read: [asyncErrorBoundary(movieExists), read],
    read2: [asyncErrorBoundary(movieExists2), read],
    read3:[asyncErrorBoundary(movieExists3), read]
}