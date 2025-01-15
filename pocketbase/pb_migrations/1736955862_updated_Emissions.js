/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ra2eqo6jgg5ujyu")

  collection.name = "reportages"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ra2eqo6jgg5ujyu")

  collection.name = "Emissions"

  return dao.saveCollection(collection)
})
