/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9vrhpngz6uwafs5")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "x5zprx0a",
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
  const collection = dao.findCollectionByNameOrId("9vrhpngz6uwafs5")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "x5zprx0a",
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
