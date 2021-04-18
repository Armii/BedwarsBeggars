const Mineflayer = require("mineflayer");
const config = require("./config/config.json");
const regex = require("./regex.js");

const mc = Mineflayer.createBot({
    cacheChannels: true,
    host: config.minecraft.server.address,
    port: parseInt(config.minecraft.server.port ? config.minecraft.server.port : 25565),
    username: config.minecraft.username,
    password: config.minecraft.password,
    version: config.minecraft.server.version,
    auth: config.minecraft.authType ? config.minecraft.authType : 'mojang',
});
mc.settings.viewDistance = "tiny";

var whereami = "";

function get2BwLob1(t) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            if (whereami != "bedwarslobby1") {
                if (/bedwarslobby\d{1,3}/gi.test(whereami)) {
                    console.log("Attempting to switch to bedwars lobby 1...")
                    mc.chat("/swaplobby 1")
                } else {
                    console.log("Sending to any bedwars lobby...")
                    mc.chat("/l bw");
                }
            }
        }, t);
    });
}

mc.on("login", () => {
    mc.chat("/whereami");
});

mc.on("message", async (msg) => {
    msg = msg.toString();
    var beggar = false;

    if (msg.startsWith("You are currently ") && (msg.includes("in limbo") || msg.includes("connected to server "))) {
        let waiSplt = msg.split(" ");
        whereami = waiSplt[waiSplt.length - 1];
        console.log("Currently in \x1b[33m" + whereami);
        await get2BwLob1(1000);
    }

    if (msg.startsWith("You were kicked while joining that server!")) {
        await get2BwLob1(500);
    }

    regex.forEach((pattern) => {
        if (pattern.test(msg)) beggar = true;
    });

    if (beggar) {
        console.log("\x1b[31mBEGGAR > \x1b[0m" + msg);
    } else {
        console.log("\x1b[32mIngame > \x1b[0m" + msg);
    }

});