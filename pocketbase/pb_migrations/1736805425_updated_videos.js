/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("njiqagomw069iff")

  // remove
  collection.schema.removeField("r43ipml7")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("njiqagomw069iff")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "r43ipml7",
    "name": "minia",
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
})
