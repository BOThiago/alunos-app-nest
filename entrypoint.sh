#!/bin/sh
set -e

npx prisma migrate dev
npx prisma generate
npm run start:dev
