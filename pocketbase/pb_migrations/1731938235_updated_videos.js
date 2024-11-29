/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("njiqagomw069iff")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "gnjclwzi",
    "name": "VideoTele",
    "type": "file",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "mimeTypes": [],
      "thumbs": [],
      "maxSelect": 1,
      "maxSize": 99999999999,
      "protected": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("njiqagomw069iff")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "gnjclwzi",
    "name": "VideoTele",
    "type": "file",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "mimeTypes": [],
      "thumbs": [],
      "maxSelect": 1,
      "maxSize": 99999999,
      "protected": false
    }
  }))

  return dao.saveCollection(collection)
})
