/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ra2eqo6jgg5ujyu")

  // remove
  collection.schema.removeField("q7ennnt8")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ra2eqo6jgg5ujyu")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "q7ennnt8",
    "name": "id_playlists",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "8tnqzsmfqmtsly1",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
})
