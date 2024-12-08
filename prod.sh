#!/bin/bash
SERVER_DEPLOY=192.168.30.6
TARGET_DIR=/opt/deploy/lf/fe
APP_ID=fe
PORT=8002

# # Build source
echo "--> build source..."
cd source
npm ci
npm run build:staging

# Copy config file
echo "--> copy config file..."
cp appServer.js build/
sed -i '' "s/{PORT}/$PORT/g" build/appServer.js
cp package.json build/
cp package-lock.json build/
cp .env build/

echo "Compress source..."
gtar -czf fe.tar.gz build


echo "Deploy to server $SERVER_DEPLOY"
ssh root@$SERVER_DEPLOY "pm2 stop $APP_ID"
ssh root@$SERVER_DEPLOY "mkdir -p $TARGET_DIR && rm -rf $TARGET_DIR/* && rm -rf $TARGET_DIR/.env"
scp fe.tar.gz root@$SERVER_DEPLOY:$TARGET_DIR/fe.tar.gz
ssh root@$SERVER_DEPLOY "cd $TARGET_DIR && tar -xzf fe.tar.gz && rm -rf fe.tar.gz && cp -r build/* . && cp -r build/.env . && rm -rf build && npm install --production"

echo "starting application"
ssh root@$SERVER_DEPLOY "cd $TARGET_DIR && pm2 start appServer.js --name fe -x -- --prod"

echo "Cleanup..."
rm -rf build
rm -rf fe.tar.gz
echo "############# DONE #############"
