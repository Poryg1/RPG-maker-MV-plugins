/*:
 *
 * @plugindesc V1.0 Event pages amount enhancement
 * @author Poryg
 *
 * @help Plugin designed for enhancement of your event past 20 pages.
 * Normally it is impossible and if you copy the pages from another event
 * to the event you want them in, it results in a crash.
 * 
 * For this reason there's this plugin; It uses a map of your choice as a
 * dummy to store your events.
 * 
 * map notetags:
 * <POR_extraPages: event1, event2, begin, end>
 * event1 - event ID of the event on current map
 * event2 - event ID of the dummy map event
 * begin - first page that you want to copy (optional)
 * end - last page that you want to copy (optional)
 * Multiple instances are separated by a comma:
 * 
 * <POR_extraPages:
 * 1,3,4,5;
 * 3,3,11,16;
 * 16,32,3;
 * 20,40>
 * 
 * gives pages 4 and 5 from dummy event 3 to event 1
 * gives pages 11-16 from dummy event 3 to event 3
 * gives pages from 3 till the end of dummy event 32 to event 16
 * gives all pages of event 40 to event 20 
 * 
 * 
 * plugin commands:
 * extrapage event1 event2 page
 * event1 - event ID of the event on current map
 * event2 - event ID of the dummy map event
 * page - the page number you want to copy. 
 * 
 * extrapage 3 2 15
 * gives page 15 of dummy event 2 to event 3.
 * 
 * Note: These pages always go at the end of the event!
 * 
 * @param dummyMapId
 * @text Dummy map ID
 * @desc Sets the ID of the map you will use as a dummy for the stored events.
 * @type number
 * @default 1
 * */


var imported = imported || {};
imported.POR_extraEventPages = true;
PORParameters = PluginManager.parameters("POR_ExtraEventPages");
var PORParams = PORParams || {};
PORParams.extraEventPages = {};
PORParams.extraEventPages.dummyMapId = Number(PORParameters.dummyMapId);
DataManager.loadDataFile("$dummyMap", "Map" + PORParams.extraEventPages.dummyMapId.padZero(3) + ".json");


POR_extraEventPages_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    POR_extraEventPages_pluginCommand.call(this, command, args)
    if (command === 'extrapage') this.addExtraEventPage(args[0], args[1], args[2] - 1);
};

Game_Interpreter.prototype.addExtraEventPage = function (event1Id, event2Id, page) {
    SceneManager._scene.addExtraEventPage(event1Id, event2Id, page);
    $gameMap.requestRefresh();
} 

POR_extraPages_SceneMap_onMapLoaded = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function() {
    if ($dataMap.meta.POR_extraPages) this.addExtraEventPages();
    POR_extraPages_SceneMap_onMapLoaded.call(this);
};

Scene_Map.prototype.addExtraEventPages = function () {
    /* Splits the metatag into multidimensional arrays of four for each event edit you want to make.
    0 - event1 id
    1 - event2 id
    2 - beginning page. If you omit it, it will begin from first page
    3 - end page. If you omit it, it will go until it reaches the end.
    */
    var extraPages = $dataMap.meta.POR_extraPages;
    extraPages = extraPages.replace(/\n/g, "");
    extraPages = extraPages.replace (/ /g, "");
    extraPages = extraPages.split(";");
    for (var i in extraPages) {
        extraPages[i] = extraPages[i].split(",");
        for (var j = extraPages[i][2] - 1 || 0; j < (extraPages[i][3] || $dummyMap.events[extraPages[i][1]].pages.length); j++) {
            this.addExtraEventPage(extraPages[i][0], extraPages[i][1], j);
            //$dataMap.events[extraPages[i][0]].pages.push ($dummyMap.events[extraPages[i][1]].pages[j]);
        } 
    }
    /*var events = $dataMap.events;
    for (var i = 1; i < events.length; i++) {
        if (!events[i].meta.event) continue;
        events[i].meta.event = events[i].meta.event.replace (/ /g, "");
        events[i].meta.event = events[i].meta.event.split(";");
        for (var j in events[i].meta.event) {
            events[i].meta.event[j] = events[i].meta.event[j].split(",");
            for (var k = events[i].meta.event[j][1] - 1 || 0; k < (events[i].meta.event[j][2] || $dummyMap.events[events[i].meta.event[j][0]].pages.length); k++) {
                events[i].pages.push ($dummyMap.events[events[i].meta.event[j][0]].pages[k]);
                console.log (k);
            }
            /*for (var k = events[i].meta.event[j][1] - 1 || 0; k < (events[i].meta.event[j][2] || 20); k++) {
                events[i].pages.push ($dummyMap.events[events[i].meta.event[j][0]].pages[k]);
                console.log (events[i].meta.event[j][2]);
            }
        }
    }*/
}

Scene_Map.prototype.addExtraEventPage = function (event1Id, event2Id, page) {
    $dataMap.events[event1Id].pages.push ($dummyMap.events[event2Id].pages[page]);
}