#!/bin/bash

set -eu

cd frontend/
npm run build

scp -r dist/* wallbuttons:~/WallButtons/backend/public/
