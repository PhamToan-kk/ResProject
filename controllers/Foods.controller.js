const createError = require('http-errors')
const model = require('../models/Model')
const Foods = model.Foods

module.exports = {
    addFood: async (req, res,next) => {
        try {
            const {
                name,
                type,
                price,
                url,
                intro,
                components
            } = req.body
            if (!name || !type || !price || !url || !intro || !components) throw createError.BadRequest() //status 400
            
            const doesExitFood = await Foods.findOne({
                name: name
            })
            if(doesExitFood) throw createError.Conflict("username have existed") //staus 409 

            const food = new Foods({
                name,
                type,
                price,
                url,
                intro,
                components
            })

            const saveFood = await food.save()
            res.send(saveFood)
            // res.send('ok')
        } catch (err) {
            next(err)
        }
    },
    deleteFood: async (req,res)=>{
        const {
            _id
        } = req.body
        const foodDeleted = await Foods.deleteOne({
            _id:_id
        })
        res.send(foodDeleted)

    },
    updateFood: async (req,res)=>{
        const {
            _id,
            name,
            type,
            price,
            url,
            intro,
            components
        } = req.body
        const foodUpdated = await Foods.updateOne({
            _id:_id,
        },{
            name:name,
            type:type,
            price:price,
            url:url,
            intro:intro,
            components:components

        })
        res.send(foodUpdated)
        
    },
    getFoods:async(req,res)=>{
        const foods = await Foods.find({})
        // console.log('foods',foods)
        res.send(foods)
    },
    getPageFood :async(req,res)=>{
        const page = req.query.page
        const limit = req.query.limit

        console.log(req.query)
        const foods = await Foods.find({})
        const startIndex = (page-1)*limit
        const endIndex = page*limit
        const result = {
            foodcount : foods.length
        }
        
        if(endIndex<foods.length ){
            result.next={
                page:page+1,
                limit:limit
            }
        }
        if(startIndex>0)
        {
            result.previous={
                page:page-1,
                limit:limit
            }
        }
        result.resultFoods =  foods.slice(startIndex,endIndex)
        res.send(result)
    },
}