#!/bin/sh
# Démarre PocketBase sur l'adresse et le port spécifiés
./pocketbase.exe serve --http 0.0.0.0:${PORT:-8090}
