# Discord bot

This bot proxies Blue Sky posts to a Discord channel.

## Local development

To run the bot locally, you'll need to follow the instructions below.

### Clone the repo

```bash
git clone git@github.com:trezy-studios/bsky.git
```

### Install dependencies

```bash
yarn install
```

### Set up environment variables

1. Copy the `.env.template` file to `.env` in your project directory (the `.env` file is excluded from source control for security purposes).
1. [Create a new Discord app](https://discordjs.guide/preparations/setting-up-a-bot-application.html).
1. Fill in the `.env` file with the appropriate values from your Discord app.

### Run the bot!

```bash
yarn dev:bot
```
