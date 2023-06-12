const knex = require("../db/connection");

const reduceP = require("../utils/reduce-properties");

const reduceCritics = reduceP("review_id", {
    critic_id: ["critic", null, "critic_id"],
    preferred_name: ["critic", null, "preferred_name"],
    surname: ["critic", null, "surname"],
    organization_name: ["critic", null, "organization_name"],
    created_at: ["critic", null, "created_at"],
    updated_at: ["critic", null, "updated_at"]
});





function list(is_showing = false){
    return knex('movies')
    .select('*')
    .modify((yeet)=>{
        if (is_showing){
            yeet.join('movies_theaters as mt', "movies.movie_id", "mt.movie_id")
            .select('*')
            .where({'mt.is_showing': true})
            .groupBy('movies.movie_id')
        }
    })
}

function read(movie_id){
    return knex('movies')
    .select("*")
    .where({movie_id})
    .first()
}

function readMovieTheater(movie_id){
    return knex('movies as m')
    .join('movies_theaters as mt', 'mt.movie_id', 'm.movie_id')
    .join('theaters as t', 't.theater_id','mt.theater_id')
    .select("*")
    .where({"m.movie_id": movie_id})
 
}

function readMovieReviews(movie_id){
return knex('reviews as r')
.join('critics as c', 'c.critic_id', 'r.critic_id')
.select("*")
.where({movie_id: movie_id})
.then(reduceCritics)
}

module.exports = {
    list,
    read,
    readMovieTheater,
    readMovieReviews
}