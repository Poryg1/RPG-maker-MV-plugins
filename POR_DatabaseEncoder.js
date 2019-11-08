//=============================================================================
// POR_DatabaseEncoder
//=============================================================================
/*:
 * @plugindesc Compresses the database files so they're not human readable
 * @author Poryg
 * 
 * @help
 * How to use:
 * 1. Activate the plugin
 * 2. Launch the game in playtest mode
 * 3. Deploy the game
 * 4. Open the deployed game's data folder
 * 5. Delete the base json files
 * 
 * Plugin is not compatible with any plugins that use JSON files
 * from other folders than the base /data one
 * Terms of use: MIT License
 * 
 * FAQ:
 * Does this make your game more secure?
 * Yes and no. It's a basic security feature, so it's easy to break through,
 * but nobody is able to read your data files, so they can't just open it
 * in a text editor.
 * 
 * What's the performance cost?
 * The base64 encoding increases the file size to 1.6-2x. So it will increase
 * loading times too. With small files it's not a bother, but you can expect
 * some increased loading times especially with large maps. 
 * 
 * Is the performance cost unavoidable?
 * You're always going to have to pay with performance for safety. I'm not sure
 * if you can avoid this much performance loss though, because I don't know how
 * much performance other compression methods work. 
 */

if (Utils.isOptionValid("test")) {
    var fs = require("fs");
    var datadir = fs.readdirSync("./data/");
    for (var i in datadir) {
        if (!datadir[i].contains(".json") && !datadir[i].contains("EncData")) continue;
        var file = fs.readFileSync("./data/" + datadir[i], {encoding: "utf-8"});
        var LZCompressed = LZString.compressToBase64(file);
        fs.writeFileSync("./data/EncData" + datadir[i], LZCompressed);
    }
};

DataManager.loadDataFile = function(name, src) {
    var xhr = new XMLHttpRequest();
    var url = 'data/EncData' + src;
    xhr.open('GET', url);
    xhr.onload = function() {
        if (xhr.status < 400) {
            var LZDecompressed = LZString.decompressFromBase64(xhr.responseText);
            window[name] = JSON.parse(LZDecompressed);
            DataManager.onLoad(window[name]);
        }
    };
    xhr.onerror = this._mapLoader || function() {
        DataManager._errorUrl = DataManager._errorUrl || url;
    };
    window[name] = null;
    xhr.send();
};