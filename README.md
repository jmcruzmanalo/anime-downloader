# Anime Downloader (powered with webtorrent.io and nyaa.si)
A simple web-based anime downloader.

# Built with ( v0.0.1 )

## Typescript | ReactJS | NestJS | Electron | GraphQL (Query, Mutations, and Subscriptions a.k.a Graphql Websockets ) | Apollo Client | TypeORM (SQLite3) | Nyaapi | webtorrent.io

# Features

- Subscribe to anime and list them with a download button.
- Has a download all button for a certain anime

# Todo Features
- 

## To be made features

- Notification if there is a new episode.
- Auto-download setting
- Resolution drop down

## Issues

- Sometimes shit stops and you have to restart the server haha. Feels bad.

# Technical TODOS

- Right now it uses both Graphql and REST APIs. Graphql (and gql websockets) were adopted later into development so it's a little over the place.

# Technical notes
- NestJS entry point was changed from main.ts/js to server.ts/js. This was done to avoid conflicts with electronJS. Electron's entry point is much more difficult to change it seems.