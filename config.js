const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('config.env'))
    require('dotenv').config({ path: __dirname + '/config.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoib0R1S0RETzlVRGxVdzZhcVRsbnB0b3hwdTQxQ3ZOZXJEYnlMWHFnY0JHWT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiL3ozbFNhTjVBMkdhd1lYVGtJZFRYbUtLYlc0ZGxmdDlXZWZzV1ZleDFSWT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJPSEJDK2xxRGk2d29LdnBPT3BkMVA0MktmSVhDdTJjNnhCSlpzRG0rZjE4PSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiIxNnJkV0RKVjlDKys4N1ZqZjh0SXkyNEJvNi83MzdEd1NGZjA3Q2haS3lVPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InNFdW1uOVRiRkpXYllQa2RVZG9tRjhZZmhmSTRQS1o0ZmxJVERlTFRZSG89In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImpuT1lhZEs4ZG1iQWU2RlFmODMrVDhxYTV3ZUpQTDFLV1FNL2JVbTZvZ3c9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiR0ZmMGdMOVZvK0xpN3VjY3REdS9wNWlINlpQb1g5T3dqVkZEYTkyNGRFbz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiTHdwQUxlelJia0xkNktpaUZpa3prN3B3Y3BzV0RkZUJzVnRBZzR4dWFBND0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImhvZkw1V3IyblRnbzNUZVh2NFVuaWZZNzlnNXdrdHFtcG5Wbk9DYVQxRlBOSGNZMHdsR1czMXFjTmlLZ1hpc09Tdm1pU0RyYk5Fekd3SFE0NHRZUEJ3PT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6ODMsImFkdlNlY3JldEtleSI6InkxRDZ2ZTVxUWJ1dENIZHN3VjRZcEFmcGx6Z002VUNxTTVJblpLMnc5MUU9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbXSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjAsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJkZXZpY2VJZCI6ImNRRzBGVUkyUklTUnBueTdIX0JxOEEiLCJwaG9uZUlkIjoiYmM5OGQ1OGYtZTUyYS00ZjA1LThkYTItNTkyZDVlNDQ3OGQzIiwiaWRlbnRpdHlJZCI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjhSUmxvYzMxMTJRRmtET3RFSjZNRWZaTldYcz0ifSwicmVnaXN0ZXJlZCI6dHJ1ZSwiYmFja3VwVG9rZW4iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJmM2pwUXBMMkE4ZDFGNzluSitHZ3Nzdis5aUk9In0sInJlZ2lzdHJhdGlvbiI6e30sInBhaXJpbmdDb2RlIjoiSDlaOFE3TU4iLCJtZSI6eyJpZCI6IjI1NDc0MjY3NDEzNzoyM0BzLndoYXRzYXBwLm5ldCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDTVhDOU1jRkVOTHkwcm9HR0FvZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiZFAzemw3VTMrZEd1T1Jya2Z5SnBuMnE1M1ZLY0duY1pETFpVZXhJNk1pST0iLCJhY2NvdW50U2lnbmF0dXJlIjoiU0RpUGxxTUlSNGR6dmtKdVNmUlRlZ2M5T0w4akdMZW4rTjFrZjJ2RHl1aUZ0alcvUWVxU0tlVE5NR0ZONmN2bUhXNDFobE1yRUtPV05paVZ0OXVHQVE9PSIsImRldmljZVNpZ25hdHVyZSI6Ik5ZZG5mRmJSejI3cjFmTzNjWVBpdURISEtzTHVTNkZMRHFIK2VPeUlndFF0Wno2dmlxc0dLNklycm5nMTgwZHl6RkpkN0tmSjVOTWVtVThWaGt4WEN3PT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjU0NzQyNjc0MTM3OjIzQHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQlhUOTg1ZTFOL25ScmprYTVIOGlhWjlxdWQxU25CcDNHUXkyVkhzU09qSWkifX1dLCJwbGF0Zm9ybSI6ImFuZHJvaWQiLCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3MzM2MDU3MjcsIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBS2RUIn0=',
    PREFIXE: process.env.PREFIX || ".",
    OWNER_NAME: process.env.OWNER_NAME || "Ibrahim Adams",
    NUMERO_OWNER : process.env.NUMERO_OWNER || " Ibrahim Adams",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no',
    BOT : process.env.BOT_NAME || 'BMW_MD',
    URL : process.env.BOT_MENU_LINKS || 'https://files.catbox.moe/h2ydge.jpg',
    MODE: process.env.PUBLIC_MODE || "yes",
    PM_PERMIT: process.env.PM_PERMIT || 'yes',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_APY_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || '',
    CHATBOT : process.env.PM_CHATBOT || 'no',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ANTIDELETE1 : process.env.ANTIDELETE1 || 'yes',
    ANTIDELETE2 : process.env.ANTIDELETE2 || 'yes',
    MENUTYPE : process.env.MENUTYPE || '',
    ANTICALL : process.env.ANTICALL || 'yes',
                  AUTO_REACT : process.env.AUTO_REACT || 'yes',
                  AUTO_REACT_STATUS : process.env.AUTO_REACT_STATUS || 'yes',
                  AUTO_REPLY : process.env.AUTO_REPLY || 'yes',
                  AUTO_READ : process.env.AUTO_READ || 'yes',
                  AUTO_SAVE_CONTACTS : process.env.AUTO_SAVE_CONTACTS || 'yes',
                  AUTO_REJECT_CALL : process.env.AUTO_REJECT_CALL || 'yes',
                  AUTO_BIO : process.env.AUTO_BIO || 'yes',
                  AUDIO_REPLY : process.env.AUDIO_REPLY || 'yes',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway" : "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway",
   
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});

