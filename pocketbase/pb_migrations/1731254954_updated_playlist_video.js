/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9vrhpngz6uwafs5")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "egceiin1",
    "name": "videoId",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "njiqagomw069iff",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9vrhpngz6uwafs5")

  // remove
  collection.schema.removeField("egceiin1")

  return dao.saveCollection(collection)
})
