const Sequelize = require('sequelize')
const pg = require('pg')
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme-nouns')

const uuidDefinition = {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
}
const nameDefinition = {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    notEmpty: true
}

const Person = conn.define('person', {
    id: uuidDefinition,
    name: nameDefinition
})
const Place = conn.define('place', {
    id: uuidDefinition,
    name: nameDefinition
})
const Thing = conn.define('thing', {
    id: uuidDefinition,
    name: nameDefinition
})

Person.belongsTo(Place)
Place.hasMany(Person)
Thing.belongsTo(Person)
Person.hasMany(Thing)

const syncAndSeed = async() => {
    await conn.sync({ force: true})

    const [ecuador, elSalvador, mexico] = await Promise.all([
        Place.create({name: 'Ecuador'}),
        Place.create({name: 'El Salvador'}),
        Place.create({name: 'Mexico'})
    ])
    const [jonathan, adriana, diana, rodrigo] = await Promise.all([
        Person.create({name: 'Jonathan', placeId: ecuador.id}),
        Person.create({name: 'Adriana', placeId: ecuador.id}),
        Person.create({name: 'Diana', placeId: elSalvador.id}),
        Person.create({name: 'Rodrigo', placeId: mexico.id}),
    ])
    const [laptop, llama, Rodrigo] = await Promise.all([
        Thing.create({name: 'laptop', personId: jonathan.id}),
        Thing.create({name: 'llama', personId: adriana.id}),
        Thing.create({name: 'tacos', personId: diana.id}),
        Thing.create({name: 'jarritos', personId: rodrigo.id}),
    ])
}

module.exports = {
    syncAndSeed,
    models: {
        Person,
        Place,
        Thing
    }
}