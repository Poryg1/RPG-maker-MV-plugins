/*:
 * @plugindesc Plugin that saves a snapshot of current map into parallax BG
 * @author Poryg
 * 
 * @param switch
 * @text Checkup switch
 * @type number
 * @desc Switch that serves for checking whether the image has been saved or not
 * @default 1
 * 
 * @help
 * Plugin command: POR_snap
 * 
 * Once you make it, you need to have a loop with these commands:
 * wait 1 frame
 * conditional branch: chosen switch: is ON
 * break loop if yes
 * 
 * This way you'll make sure the image is saved before you transfer to menu.
 * Don't worry, the switch resets itself before each saving, so it will
 * never happen that you will transfer into an unsnapped shot.
 * */

var PORParameters = PORParameters || {};
PORParameters.snapPlugin = {};
PORParameters.snapPlugin.switchID = PluginManager.parameters("POR_SnapPlugin")["switch"];

var POR_GI_pC = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    POR_GI_pC.call(this, command, args)
    if (command === 'POR_snap') POR_snapBackground(); 
};

function POR_snapBackground () {
    $gameSwitches.setValue(PORParameters.snapPlugin.switchID, false);
    var rt = PIXI.RenderTexture.create(Graphics.boxWidth, Graphics.boxHeight);
    Graphics._renderer.render (SceneManager._scene, rt);
    var canvas;
    if (Graphics.isWebGL()) {
        canvas = Graphics._renderer.extract.canvas(rt);
    } else {
        canvas = rt.baseTexture._canvasRenderTarget.canvas;
    }
    canvas.toBlob (function (blob) {
        var fr = new FileReader();
        fr.readAsArrayBuffer(blob);
        fr.onload = function () {
            var ui = new Uint8Array(fr.result);
            var fs = require("fs");
            fs.writeFileSync ("./img/parallaxes/!MenuBG.png", ui, "binary");
            $gameSwitches.setValue(PORParameters.snapPlugin.switchID, true);
        }
    })
}
