const Sequelize = require('sequelize')
const {STRING, INTEGER, UUID,UUIDV4, DATE}= Sequelize

const db = new Sequelize('postgres://localhost/countryclub')

const Facilities =db.define('facilities',{
    id: {
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4,
        notNull: true,
    },
    name:{
        type:STRING,
        unique: true,
        notNull: true
    }
})

const Members = db.define('members',{
    id: {
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4,
        notNull: true,
    },
    firstName: {
        type: STRING,
        notNull: true,
    },

})

const Bookings = db.define('bookings',{
    id: {
        type: INTEGER,
        primaryKey: true,
        notNull: true,
    },
    startTime:{
        type: DATE,
        notNull: true
    },
    endTime:{
        type: DATE,
        notNull: true
    }
})

const member_bookings = db.define('memberBookings',{
    id:{
        type: INTEGER,
        primaryKey: true,
        notNull: false
    }
})
member_bookings.belongsTo(Members)
member_bookings.belongsTo(Bookings)
Bookings.belongsTo(Members)
Members.hasMany(Bookings)
Members.belongsTo(Members,{as:'sponsor'})
Bookings.belongsTo(Facilities)
Facilities.hasMany(Bookings)

const sync=async()=>{
    try{
        await db.sync({force:true})
        const [tennisCourt, swimmingPool, John, Susan, book1,book2]= await Promise.all([
            Facilities.create({name: 'tennisCourt'}),
            Facilities.create({name: 'swimmingPool'}),
            Members.create({firstName:'John'}),
            Members.create({firstName:'Susan'}),
            Bookings.create({id: 1,startTime: new Date(), endTime: new Date()}),
            Bookings.create({id:2,startTime: new Date(), endTime: new Date()})
        ])
        book1.memberId = John.id
        book2.memberId = Susan.id
        book1.facilityId = tennisCourt.id
        book2.facilityId = swimmingPool.id
        John.sponsorId = Susan.id
        Susan.sponsorId = John.id
        
        await Promise.all([book1.save(),book2.save(), John.save(), Susan.save()])
        }
    catch(err){
        console.log(err)
    }
}

module.exports={
    sync, Facilities, Members, Bookings, member_bookings
}