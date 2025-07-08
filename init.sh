#!/usr/bin/env bash
set -e

cd core || exit 1

# DIRS="./node_modules ./frontend/node_modules ./backend/node_modules"
DIRS="./node_modules"

none_exist=true
for d in $DIRS; do
  if [ -d "$d" ]; then
    none_exist=false
    break
  fi
done

if $none_exist; then
  echo "Kein node_modules-Ordner gefunden. Führe make run aus."
  make run2
#   exit 0
fi

# 2) Wenn irgendein Ordner fehlt oder leer ist → make remodule
for d in $DIRS; do
  if [ ! -d "$d" ] || [ -z "$(ls -A "$d" 2>/dev/null)" ]; then
    echo "Ordner '$d' fehlt oder ist leer. Führe make remodule aus."
    make remodule
    # exit 0
  fi
done

# 3) Sonst → make run
echo "Alle node_modules-Ordner sind vorhanden und gefüllt. Führe make run aus."
make run2

exec bash
