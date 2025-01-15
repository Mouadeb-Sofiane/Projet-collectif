/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "iekg5le0smi7865",
    "created": "2025-01-15 15:44:36.670Z",
    "updated": "2025-01-15 15:44:36.670Z",
    "name": "rediffusions",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "ccm2fwy5",
        "name": "fddf",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
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
  const collection = dao.findCollectionByNameOrId("iekg5le0smi7865");

  return dao.deleteCollection(collection);
})
