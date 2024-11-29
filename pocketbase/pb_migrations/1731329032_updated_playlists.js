/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8tnqzsmfqmtsly1")

  // remove
  collection.schema.removeField("s88cwxqx")

  // add
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
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8tnqzsmfqmtsly1")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "s88cwxqx",
    "name": "videos_id",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "9vrhpngz6uwafs5",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  // remove
  collection.schema.removeField("p1zcehgu")

  return dao.saveCollection(collection)
})
