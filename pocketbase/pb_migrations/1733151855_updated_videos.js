/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("njiqagomw069iff")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "p0xtj9j0",
    "name": "casting",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qqxtsa3q",
    "name": "realisation",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("njiqagomw069iff")

  // remove
  collection.schema.removeField("p0xtj9j0")

  // remove
  collection.schema.removeField("qqxtsa3q")

  return dao.saveCollection(collection)
})
