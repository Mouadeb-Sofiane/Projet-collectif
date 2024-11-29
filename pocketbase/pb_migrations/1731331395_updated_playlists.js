/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8tnqzsmfqmtsly1")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "mu8c6z9n",
    "name": "playlists_id",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "9vrhpngz6uwafs5",
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

  // remove
  collection.schema.removeField("mu8c6z9n")

  return dao.saveCollection(collection)
})
