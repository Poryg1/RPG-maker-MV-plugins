/*:
 * @plugindesc Plugin that saves a snapshot of current map into parallax BG
 * @author Poryg
 * 
 * @help
 * Plugin command: POR_snap
 * */


var POR_SP_GI_pC = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    POR_SP_GI_pC.call(this, command, args);
    if (command === 'POR_snap') POR_snapBackground(); 
};

function POR_snapBackground () {
    var rt = PIXI.RenderTexture.create(Graphics.boxWidth, Graphics.boxHeight);
    Graphics._renderer.render(SceneManager._scene, rt);
    var base = Graphics._renderer.extract.base64(rt);
    var bin = atob(base.split(",")[1]);
    var ab = new ArrayBuffer(bin.length);
    var ui = new Uint8Array(ab);
    for (var i in bin) ui[i] = bin.charCodeAt(i);
    var fs = require ("fs");
    fs.writeFileSync ("./img/parallaxes/!MenuBG.png", ui, "binary");
}
