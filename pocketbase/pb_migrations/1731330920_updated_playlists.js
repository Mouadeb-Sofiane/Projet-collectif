/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8tnqzsmfqmtsly1")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "p1zcehgu",
    "name": "videos_id",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "njiqagomw069iff",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8tnqzsmfqmtsly1")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "p1zcehgu",
    "name": "id_videos",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "njiqagomw069iff",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
})
