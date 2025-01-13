/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3gw17uim3vereba")

  collection.indexes = [
    "CREATE INDEX `idx_AETnGhc` ON `types` (\n  `emissions`,\n  `reportages`,\n  `rediffusion`,\n  `created`,\n  `updated`,\n  `id_videos`\n)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3gw17uim3vereba")

  collection.indexes = []

  return dao.saveCollection(collection)
})
