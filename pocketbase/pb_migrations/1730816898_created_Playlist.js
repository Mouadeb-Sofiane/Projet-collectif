/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "8tnqzsmfqmtsly1",
    "created": "2024-11-05 14:28:18.303Z",
    "updated": "2024-11-05 14:28:18.303Z",
    "name": "Playlist",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "j4xw0zqa",
        "name": "Video_de_la_playlist",
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
  const collection = dao.findCollectionByNameOrId("8tnqzsmfqmtsly1");

  return dao.deleteCollection(collection);
})
