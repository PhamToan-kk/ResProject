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
            name
        } = req.body
        const foodDeleted = await Foods.deleteOne({
            name:name
        })
        res.send(foodDeleted)

    },
    updateFood: async (req,res)=>{
        const {
            name,
            newPrice,
            newName
        } = req.body
        const foodUpdated = await Foods.updateOne({
            name:name,
        },{
            name:newName,
            price:newPrice,
        })
        res.send(foodUpdated)
        
    },
    getFoods:async(req,res)=>{
        const foods = await Foods.find({})
        res.send(foods)
    }
}