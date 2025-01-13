/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "ra2eqo6jgg5ujyu",
    "created": "2025-01-12 23:27:06.901Z",
    "updated": "2025-01-12 23:27:06.901Z",
    "name": "Emissions",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "ujyvjnhn",
        "name": "video_id",
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
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("ra2eqo6jgg5ujyu");

  return dao.deleteCollection(collection);
})
