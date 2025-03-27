* Start libSQL DB

```docker run --name pm-sqld -p 8080:8080 -ti -e SQLD_NODE=primary -e SQLD_AUTH_JWT_KEY=[publicAuthKey] ghcr.io/tursodatabase/libsql-server:latest```


* Connect to DB started by Docker using auth token from CLI

```
./LoadEnv.ps1 .env -Verbose
curl -s -H "Authorization: bearer $Env:AUTH_TOKEN" -d '{"statements": ["SELECT name FROM sqlite_master WHERE type=\"table\";"]}' $Env:DB_URL
```

* Connect to DB using DBeaver

- Connection type: LibSQL
- Server URL: http://localhost:8080
- Authentication > Token: private key from env

* Start backend & frontend from root

Backend:

```
bun run --hot server/src/index.ts
```

Frontend:

```
bun --cwd client dev
```

* Env file

For now, `.env` file with all env variables set (see `.env.sample` for reference) should be put in two different places: 
root folder, and client folder.