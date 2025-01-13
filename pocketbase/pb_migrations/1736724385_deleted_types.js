/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("3gw17uim3vereba");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "3gw17uim3vereba",
    "created": "2025-01-12 23:09:31.592Z",
    "updated": "2025-01-12 23:26:03.254Z",
    "name": "types",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "ntgd3htw",
        "name": "id_videos",
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
      },
      {
        "system": false,
        "id": "ncyfiulc",
        "name": "emissions",
        "type": "bool",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "yt5f4rbh",
        "name": "reportages",
        "type": "bool",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "yetehegz",
        "name": "rediffusion",
        "type": "bool",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {}
      }
    ],
    "indexes": [
      "CREATE INDEX `idx_AETnGhc` ON `types` (\n  `emissions`,\n  `reportages`,\n  `rediffusion`,\n  `created`,\n  `updated`,\n  `id_videos`\n)"
    ],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
})
