# Api NoweWatch
<p align="center"> 
  <img src="https://raw.githubusercontent.com/nowecompany/Nowe-watch/main/img/main_black.png" width="400"> 
  <img src="https://raw.githubusercontent.com/nowecompany/Nowe-watch/main/img/icon_black.png" width="400"> 
</p> 

# About
This is a video platform project, this API provides services to our CLIENT [Nowe Watch](https://github.com/NoweCompany/Nowe-watch), its main services are:
- User management
- User authentication
- Upload of videos
- Show videos

# Initialization

1. Create a ".env" file in the root of the project and add the ".env.example" variables in it according to your environment
``` env
    PORT = 3300
    DATABASE_URL="mysql://<User>:<Password>@localhost:<Port>/<database name>"
```

2. Intall dependences
```
    npm install
```

3. run migrations of the Prisma
```
    npx prisma migrate dev
```

4. run the build and start project
```
    npm run build &&
```
```
    npm run start
```
