const knex = require("../db/connection");

async function list(){
    return knex('reviews')
    .select("*")
}

function update(updatedReview){
    return knex('reviews')
    .select('*')
    .where({review_id: updatedReview.review_id})
    .update(updatedReview, '*')
}

function read(review_id){
    return knex('reviews')
    .select("*")
    .where({review_id})
    .first()
}
function readCritic(criticId){
    return knex('critics')
    .select("*")
    .where({critic_id: criticId})
    .first()
}

function destroy(review_id){
    return knex('reviews')
    .where({ review_id })
    .del()
}

module.exports ={
    list,
    update,
    read,
    delete: destroy,
    readCritic
}