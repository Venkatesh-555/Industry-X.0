var map, initExtent;
var industryLayers;

initialize();

function initialize() {
    require([

        "esri/map",
        "esri/geometry/Extent",
        "esri/SpatialReference",
        "esri/geometry/webMercatorUtils",
        "esri/geometry/Point",

        "dojo/domReady!"
    ],
        function (
            Map,
            Extent,
            SpatialReference,
            webMercatorUtils,
            Point

        ) {

            initExtent = Extent(16364171.340738166, -1044523.526243979, 16367993.192152526, -1043305.3111056519, new SpatialReference({
                "wkid": 102100
            }));

            map = new Map("map", {
                basemap: "satellite",  //For full list of pre-defined basemaps, navigate to http://arcg.is/1JVo6Wd
                // center: [72, 15], // longitude, latitude
                extent: initExtent,
                zoom: 16
            });

        });
}
