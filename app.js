const express = require('express')
const {sync, Facilities, Members, Bookings, member_bookings}= require('./db')


const app = express()

app.get('/',(req,res,next)=>{
    res.redirect('/api/facilities')
})

app.get('/api/facilities',async(req,res,next)=>{
    const facils = await Facilities.findAll({
        include: [Bookings]
    })
    res.send(facils)
})

app.get('/api/members',async(req,res,next)=>{
    const mems = await Members.findAll({include: [{model:Members,as:'sponsor'}]})
    res.send(mems)
})

app.get('/api/bookings',async(req,res,next)=>{
    const books = await Bookings.findAll({
        include:[Members, Facilities]
    })
    res.send(books)
})

app.get('/api/memberbookings',async (req,res,next)=>{
    const books = await member_bookings.findAll({include: [Members, Bookings]})
    res.send(books)
})

const init=async()=>{
    await sync()
    const PORT = 3000
    app.listen(PORT,()=> console.log(`Listening on ${PORT}`))

}

init()