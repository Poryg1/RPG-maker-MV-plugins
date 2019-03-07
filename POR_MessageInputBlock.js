/*:
 * @plugindesc Prevents any input in a message window.
 * @author Poryg
 *
 * @param Switch
 * @desc The switch that is turned on 
 * @default 1
 */

var PORParameters = PORParameters || {};
PORParameters.messageInputBlock = {};
PORParameters.messageInputBlock.switch = PluginManager.parameters("POR_MessageInputBlock")["Switch"];

 Window_Message.prototype.isTriggered = function() {
    if ($gameSwitches.value(PORParameters.messageInputBlock.switch)) return Utils.isOptionValid('test') && Input.isRepeated('shift');
    return (Input.isRepeated('ok') || Input.isRepeated('cancel') ||
            TouchInput.isRepeated());
};