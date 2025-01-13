/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3gw17uim3vereba")

  // remove
  collection.schema.removeField("rwcg9b7k")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ncyfiulc",
    "name": "emissions",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "yt5f4rbh",
    "name": "reportages",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "yetehegz",
    "name": "rediffusion",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3gw17uim3vereba")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "rwcg9b7k",
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

  // remove
  collection.schema.removeField("ncyfiulc")

  // remove
  collection.schema.removeField("yt5f4rbh")

  // remove
  collection.schema.removeField("yetehegz")

  return dao.saveCollection(collection)
})
