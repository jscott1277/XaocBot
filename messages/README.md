# Mognet

An FFXIV Bot running through XIVDB and the XIVSync API. I started this to feed my curiosity for learning discord bots. The core components are working and the next stage would be to implement all the desired commands.

**Features:**
- Can handle multi-message from different users at the same time.
- Handles Async responses through various APIs with NodeJS non-blocking IO.
- Is broken up by languages so that users can get responses in their desired language.
- Provides chained requests, eg: `find` = search all, `find item` = search items

## To use

- Clone
- Create your bot and copy `src/app/config.js.dist` to `src/app/config.js`
- Run: `yarn` (or `npm install` if you're old)
- `node mognet`

## Requirements:

- Node 6+

## Dev

This link is my own bot, it is not active.
- https://discordapp.com/api/oauth2/authorize?client_id=257201600429424651&scope=bot&permissions=0