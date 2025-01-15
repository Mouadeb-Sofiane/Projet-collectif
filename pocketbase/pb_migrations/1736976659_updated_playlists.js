/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8tnqzsmfqmtsly1")

  // remove
  collection.schema.removeField("vwgdpji5")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8tnqzsmfqmtsly1")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "vwgdpji5",
    "name": "id_reportages",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "ra2eqo6jgg5ujyu",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
})
