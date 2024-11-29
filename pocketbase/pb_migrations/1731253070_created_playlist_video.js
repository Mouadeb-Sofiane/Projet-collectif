/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "9vrhpngz6uwafs5",
    "created": "2024-11-10 15:37:50.543Z",
    "updated": "2024-11-10 15:37:50.543Z",
    "name": "playlist_video",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "ybpar7py",
        "name": "id_playlist",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "8tnqzsmfqmtsly1",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "x5zprx0a",
        "name": "id_video",
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
  const collection = dao.findCollectionByNameOrId("9vrhpngz6uwafs5");

  return dao.deleteCollection(collection);
})
