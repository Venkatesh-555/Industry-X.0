var map, initExtent;
var industryLayers;
var legend = "";
var id = 1, legendDiv;
var panorama;
var layer, visible = [];
var routeTask, routeParams;
var stopSymbol, routeSymbol, lastStop;
var handler, handlerroute;
var toc, dynaLayer1;
var popup, clusterLayer, geocoder, infoTemplate, defaultSym, selectedSym, activeClusterElement;
var densityLayer;

var proxyURL = "https://138.91.36.52/DotNet/proxy.ashx";
var printURL = "https://138.91.36.52/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task";
var plantLayerURL = "https://138.91.36.52/arcgis/rest/services/IndustryX0/IndustryX0/MapServer/1";
var equipmentLayerURL = "https://138.91.36.52/arcgis/rest/services/IndustryX0/IndustryX0/MapServer/0";
var industryLayerURL = "https://138.91.36.52/arcgis/rest/services/IndustryX0/IndustryX0/MapServer";
var routeURL = "https://138.91.36.52/arcgis/rest/services/NetworkAnalysis/NAServer/Route";


require([
    "esri/map",
    "esri/dijit/HomeButton",
    "esri/dijit/Search",
    "esri/dijit/Bookmarks",
    "esri/geometry/Extent",
    "esri/SpatialReference",
    "esri/geometry/webMercatorUtils",
    "esri/geometry/Point",
    "esri/dijit/BasemapGallery",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/layers/FeatureLayer",
    "esri/graphic",
    "esri/InfoTemplate",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/PictureMarkerSymbol",
    "esri/tasks/IdentifyTask",
    "esri/tasks/IdentifyParameters",
    "esri/dijit/Popup",
    "dojo/_base/array",
    "dojo/query",
    "esri/Color",
    "dojo/dom-construct",
    "dojo/dom",
    "dojo/on",
    "esri/arcgis/utils",
    "esri/tasks/query",
    "esri/tasks/QueryTask",
    "esri/layers/LabelLayer",
    "esri/symbols/Font",
    "esri/renderers/SimpleRenderer",
    "esri/renderers/UniqueValueRenderer",
    "esri/tasks/LegendLayer",
    "esri/dijit/Legend",
    "dojo/number",
    "esri/renderers/HeatmapRenderer",
    "esri/dijit/Directions",

    
    "gis/dijit/Print",
    "esri/tasks/PrintTemplate",
    

    "esri/layers/ArcGISTiledMapServiceLayer",
    "esri/renderers/DotDensityRenderer",
    "esri/renderers/ScaleDependentRenderer",
    "dojo/_base/array",

    "esri/tasks/RouteTask",
    "esri/tasks/RouteParameters",
    "esri/tasks/FeatureSet",
    "esri/symbols/SimpleMarkerSymbol",
    "dijit/registry",

    "dojo/parser",
    "dojo/_base/connect",
    "agsjs/dijit/TOC",

    "esri/graphicsUtils",
    "app/clusterfeaturelayer",
    "esri/renderers/ClassBreaksRenderer",
    "dojo/_base/Color",
    "dojo/dom-style",
    "dojo/_base/fx",
    "dojo/fx/easing",

    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane",
    "dijit/form/HorizontalSlider",
    "dijit/form/HorizontalRuleLabels",

    "dojo/domReady!"
],
    function (
        Map,
        HomeButton,
        Search,
        Bookmarks,
        Extent,
        SpatialReference,
        webMercatorUtils,
        Point,
        BasemapGallery,
        ArcGISDynamicMapServiceLayer,
        FeatureLayer,
        Graphic,
        InfoTemplate,
        SimpleFillSymbol,
        SimpleLineSymbol,
        PictureMarkerSymbol,
        IdentifyTask,
        IdentifyParameters,
        Popup,
        arrayUtils,
        query,
        Color,
        domConstruct,
        dom,
        on,
        arcgisUtils,
        Query,
        QueryTask,
        LabelLayer,
        Font,
        SimpleRenderer,
        UniqueValueRenderer,
        LegendLayer,
        Legend,
        number,
        HeatmapRenderer,
        Directions,

        Print,
        PrintTemplate,

        ArcGISTiledMapServiceLayer,
        DotDensityRenderer,
        ScaleDependentRenderer,
        array,

        RouteTask,
        RouteParameters,
        FeatureSet,
        SimpleMarkerSymbol,
        registry,
        parser,
        connect,
        TOC,

        graphicsUtils,
        ClusterFeatureLayer,
        ClassBreaksRenderer,
        Color,
        domStyle,
        fx,
        easing


    ) {

        parser.parse();
        //  esriConfig.defaults.io.proxyUrl = "/proxy/";
        esriConfig.defaults.io.proxyUrl = proxyURL;

        initExtent = Extent(16364171.340738166, -1044523.526243979, 16367993.192152526, -1043305.3111056519, new SpatialReference({
            "wkid": 102100
        }));

        // ********** Map Code Starts from here*************\\
        map = new Map("map", {
            basemap: "satellite",  //For full list of pre-defined basemaps, navigate to http://arcg.is/1JVo6Wd
           // center: [-122.45, 37.75], // longitude, latitude
            extent: initExtent,
            zoom: 16
        });

        // ********** Home Code Starts from here*************\\
        var home = new HomeButton({
            map: map
        }, "HomeButton");
        home.startup();

        // ********** Search Code Starts from here*************\\
        var search = new Search({
            map: map
        }, "search");
        search.startup();

          // ********** Print Code Starts from here*************\\

        var printWidget = new Print({
            printTaskURL: printURL,    //Url from utilities
            map: map,
            authorText: "Accenture Devlopers Team",             //Text to be displayed on print
            copyrightText: "Copyright © 2020 Accenture. All rights reserved.",
            defaultTitle: "IndustryX.0 Map",                        //Default title for the print
            defaultFormat: "PDF",                             // Default Format and you can select in many formats
            defaultLayout: "A4 Landscape"                      // Default Format and you can select in many formats
        }, 'printDijit');                                      // Legend to be Displayed on print
        printWidget.startup();


        // ********** TOC Code Starts from here*************\\
       

        dynaLayer1 = new ArcGISDynamicMapServiceLayer(industryLayerURL, {
            opacity: 0.8
        });

        var industryLayer1, industryLayer2, selectedIndustryLayer, selectedIndustryLayer1 = "";
        var pictureMarkerSymbol1 = new PictureMarkerSymbol('img/active.png', 24, 24)
        var pictureMarkerSymbol2 = new PictureMarkerSymbol('img/notactive.gif', 20, 20);

        var infoTemplate = new InfoTemplate();
        infoTemplate.setTitle("Equipment in ${ID}");
        //infoTemplate.setContent("<b>Status:</b> ${status} <br/><b> ID:</b> ${ID} <br/> <b>Error Description:</b> ${error_discription} <br/> <b>Lattitude:</b> ${Lat} <br/> <b>Longitude:</b> ${Long} <br/> <b>Inlet Temperature °C</b> : ${Inlet_Temperature} <br/> <b>Outlet Temperature °C:</b> ${Outlet_Temperature} <br/> <b>Flow Rate kg/h:</b> ${Flow_Rate} <br/> <b>Working Temperature Top °C:</b> ${Working_Temperature_Top} <br/> <b>Working Temperature Bottom °C:</b> ${Working_Temperature_Bottom} <br/> <b>Working Pressure Top bar (g):</b> ${Working_Pressure_Top} <br/> <b>Working Pressure Bottom bar (g):</b> ${Working_Pressure_Bottom} <br/> <b>Working Pressure bar (g):</b> ${Working_Pressure} <br/> <b>Vibration mm/sec:</b> ${Vibration} <br/> <b>Temperature °C:</b> ${Temperature} <br/> <b>Pressure kg/cm2:</b> ${Pressure} <br/><b> <p onclick='modelclick()' ><b style='color:blue'>Click here to view 3D Model</b></p> ");
        infoTemplate.setContent("<b><a style='font-size:12px; color:blue' href ='#' class='iconic' data-toggle='collapse' data-target='#menu7' aria-expanded='true'> Click here to view 3D Model </a></b><br/><b>Status:</b> ${status} <br/><b> ID:</b> ${ID} <br/> <b>Error Description:</b> ${error_discription} <br/> <b>Lattitude:</b> ${Lat} <br/> <b>Longitude:</b> ${Long} <br/> <b>Inlet Temperature °C</b> : ${Inlet_Temperature} <br/> <b>Outlet Temperature °C:</b> ${Outlet_Temperature} <br/> <b>Flow Rate kg/h:</b> ${Flow_Rate} <br/> <b>Working Temperature Top °C:</b> ${Working_Temperature_Top} <br/> <b>Working Temperature Bottom °C:</b> ${Working_Temperature_Bottom} <br/> <b>Working Pressure Top bar (g):</b> ${Working_Pressure_Top} <br/> <b>Working Pressure Bottom bar (g):</b> ${Working_Pressure_Bottom} <br/> <b>Working Pressure bar (g):</b> ${Working_Pressure} <br/> <b>Vibration mm/sec:</b> ${Vibration} <br/> <b>Temperature °C:</b> ${Temperature} <br/> <b>Pressure kg/cm2:</b> ${Pressure} <br/>");

        industryLayer2 = new FeatureLayer(equipmentLayerURL, {
            mode: FeatureLayer.MODE_ONDEMAND,
            outFields: ["*"],
            infoTemplate: infoTemplate
        });

        var renderer = new UniqueValueRenderer(pictureMarkerSymbol1, "status");
        renderer.addValue("Active", pictureMarkerSymbol1);
        renderer.addValue("Not Active", pictureMarkerSymbol2);
        industryLayer2.setRenderer(renderer);

        map.on('layers-add-result', function (evt) {
            // overwrite the default visibility of service.
            // TOC will honor the overwritten value.
            //  dynaLayer1.setVisibleLayers([0, 2, 3, 4, 5, 6]);
            //try {
            toc = new TOC({
                map: map,
                layerInfos: [{
                    layer: dynaLayer1,
                    title: "Industry X.0"
                }, {
                    layer: industryLayer2,
                    title: "Equipment Layer"
                }
                ]
            }, 'tocDiv');
            toc.startup();
            toc.on('toc-node-checked', function (evt) {
                if (console) {
                    console.log("TOCNodeChecked, rootLayer:"
                        + (evt.rootLayer ? evt.rootLayer.id : 'NULL')
                        + ", serviceLayer:" + (evt.serviceLayer ? evt.serviceLayer.id : 'NULL')
                        + " Checked:" + evt.checked);
                    if (evt.checked && evt.rootLayer && evt.serviceLayer) {
                        // evt.rootLayer.setVisibleLayers([evt.serviceLayer.id])
                    }
                }
            });
            //} catch (e) {  alert(e); }
        });
       map.addLayers([dynaLayer1, industryLayer2]);



        // ********** Onload Layer Code Starts from here*************\\

        var pictureMarkerSymbol = new PictureMarkerSymbol('img/green-marker.png', 36, 36)
        var simpleJson = {
            "type": "simple",
            "label": "",
            "description": "",
            "symbol": pictureMarkerSymbol
        }
        var rend = new SimpleRenderer(simpleJson);
        var labelField = 'Plant';
        var industryPlantsLayer = new FeatureLayer(plantLayerURL, {
            "id": "testlayer",
            outFields: ['*']
        });
        industryPlantsLayer.setRenderer(rend);
        map.addLayers([industryPlantsLayer]);

        var labelColor = new esri.Color([255, 255, 255, 3]);
        var font = new Font();
        font.setSize(26);
        //create a text symbol and renderer to define the style of labels
        var labelSymbol = new esri.symbol.TextSymbol().setColor(labelColor);
        labelSymbol.setFont(font);
        var labelRenderer = new SimpleRenderer(labelSymbol);
        var labels = new LabelLayer({
            id: "alabellyr123"
        });
        labels.addFeatureLayer(industryPlantsLayer, labelRenderer, "{" + labelField + "}");
       map.addLayer(labels);

        legendDiv = "";
        if (legend != "") {
            legend.destroy();
            document.getElementById("legendDiv").innerHTML = "";
        }
        $("#legendDiv").empty();
        //   create a new div for the legend

        legendDiv = domConstruct.create("div", {
            // id: "legendDiv"
        }, dom.byId("legendDiv"));

        legend = new Legend({
            map: map,
            autoUpdate: true,
            layerInfos: [{ layer: industryPlantsLayer, title: "" }]
        }, legendDiv);
        legend.startup();


        // ********** Info Window Summary Code Starts from here*************\\

        var industryLayer1, industryLayer2, selectedIndustryLayer, selectedIndustryLayer1 = "";
        var pictureMarkerSymbol1 = new PictureMarkerSymbol('img/active.png', 24, 24)
        var pictureMarkerSymbol2 = new PictureMarkerSymbol('img/notactive.gif', 20, 20);

        $('#equipmentClick').click(function () {

            if (industryLayer1 != undefined) {
                map.removeLayer(industryLayer1);
                industryLayer1 = undefined;
            }

            if (industryLayer2 != undefined) {
                map.removeLayer(industryLayer2);
                industryLayer2 = undefined;
            }
            else {
                addGraphictomap();
            }

        });


        function addGraphictomap() {
            var currentExtent;
            map.on("extent-change", function (currentMap) {
                currentExtent = map.extent;
                var query = new esri.tasks.Query();
                query.outSpatialReference = { wkid: 102100 };
                query.returnGeometry = true;
                query.outFields = ["*"];
                var queryTask = "";
                queryTask = new esri.tasks.QueryTask(equipmentLayerURL);
                query.where = "1=1";
                query.geometry = currentExtent;
                queryTask.execute(query, function (featureSet) {
                    var features = featureSet.features;
                    var featureslength = featureSet.features.length;
                    console.log("featureslength", featureslength);
                    $("#equipmentCount").text(featureslength);
                    var layerDefinition = "";
                    layerDefinition = {
                        "geometryType": featureSet.geometryType,
                        "fields": featureSet.fields
                    }
                    var fs = "";
                    fs = new esri.tasks.FeatureSet(featureSet);
                    var featureCollection = "";
                    featureCollection = {
                        layerDefinition: layerDefinition,
                        featureSet: fs
                    };
                    industryLayer1 = new FeatureLayer(equipmentLayerURL, {
                        mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
                        id: "" + selectedIndustryLayer + "",
                        showLabels: true
                    });
                    // console.log("industryLayer1", industryLayer1);

                    var Renderer = new SimpleRenderer(pictureMarkerSymbol1);
                    industryLayer1.setRenderer(Renderer);
                    industryLayer1.setDefinitionExpression("status='Active'");

                    map.addLayers([industryLayer1]);


                    var labels1 = new LabelLayer({ id: "labels" });
                    labels1.addFeatureLayer(industryLayer1, labelRenderer, "{ID}");
                    //add the label layer to the map
                    map.addLayer(labels1);


                    industryLayer2 = new FeatureLayer(equipmentLayerURL, {
                        mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
                        id: "" + selectedIndustryLayer1 + "",
                        showLabels: true
                    });
                    // console.log("industryLayer2", industryLayer2);

                    var Renderer1 = new SimpleRenderer(pictureMarkerSymbol2);
                    industryLayer2.setRenderer(Renderer1);
                    industryLayer2.setDefinitionExpression("status='Not Active'");
                    //console.log("industryLayer2", industryLayer2);
                    map.addLayers([industryLayer2]);


                    var labels2 = new LabelLayer({ id: "labels" });
                    labels2.addFeatureLayer(industryLayer2, labelRenderer, "{ID}");
                    //add the label layer to the map
                    map.addLayer(labels2);

                });
            });
        }




        // ********** Street View Code Starts from here*************\\

        setTimeout(function () {
            //var lat = 42.345573;
            //var lan = -71.098326;
            var lat = -9.337767825540846;
            var lan = 147.0209281438718;
            fenway = { lat: lat, lng: lan };
            panorama = new google.maps.StreetViewPanorama(
                document.getElementById('pano'), {
                position: fenway,
                pov: {
                    heading: 34,
                    pitch: 10
                }
            });
        }, 3000);


        var markerSymbol = new PictureMarkerSymbol("img/google.svg", 60, 60)
        map.on("extent-change", function (evt) {
            // alert("123");
            var initialExtent = new esri.geometry.Extent({
                "xmin": evt.extent.xmin,
                "ymin": evt.extent.ymin,
                "xmax": evt.extent.xmax,
                "ymax": evt.extent.ymax,
                "spatialReference":
                {
                    "wkid": 102100
                }
            });
           // console.log("Initial Extent",initialExtent);
            var mp = webMercatorUtils.webMercatorToGeographic(initialExtent.getCenter());
            lat = mp.y;
            lan = mp.x;
            var fenway = { lat: lat, lng: lan };
            //console.log("Fenway", fenway);
            panorama = new google.maps.StreetViewPanorama(
                document.getElementById('pano'), {
                position: fenway,
                pov: {
                    heading: 34,
                    pitch: 10
                }
            });

            panorama.addListener('position_changed', function () {
                var posi = panorama.getPosition().toString();
                var posi1 = posi.replace('(', '');
                posi1 = posi1.replace(')', '');
                var latpano = posi1.split(',')[0];
                var longpano = posi1.split(',')[1];
                map.graphics.clear();
                var point = new Point([longpano, latpano], new SpatialReference({ wkid: 4326 }));
                map.graphics.add(new Graphic(point, markerSymbol));
                //var graphicsLayer = new GraphicsLayer();
                //map.addLayer(graphicsLayer);
            });

        });

        // ********** BookMarks Code Starts from here*************\\
        // Create the bookmark widget
        // specify "editable" as true to enable editing
        var bookmarks = new Bookmarks({
            map: map,
            bookmarks: [],
            editable: true
        }, "bookmarks");

        // Bookmark data objects
        var bookmarkJSON = {
            first: {
                "extent": {
                    "xmin": -12975100,
                    "ymin": 3993900,
                    "xmax": -12964100,
                    "ymax": 4019500,
                    "spatialReference": {
                        "wkid": 102100,
                        "latestWkid": 3857
                    }
                },
                "name": "Palm Springs, CA"
            },
            second: {
                "extent": {
                    "xmin": -13052100,
                    "ymin": 4024900,
                    "xmax": -13041100,
                    "ymax": 4050500,
                    "spatialReference": {
                        "wkid": 102100,
                        "latestWkid": 3857
                    }
                },
                "name": "Redlands, California"
            },
            third: {
                "extent": {
                    "xmin": -13048800,
                    "ymin": 3844800,
                    "xmax": -13037800,
                    "ymax": 3870400,
                    "spatialReference": {
                        "wkid": 102100,
                        "latestWkid": 3857
                    }
                },
                "name": "San Diego, CA"
            },
        };

        // Add bookmarks to the widget
        Object.keys(bookmarkJSON).forEach(function (bookmark) {
            bookmarks.addBookmark(bookmarkJSON[bookmark]);
        });

        // ********** Base map Gallery Code Starts from here*************\\

        //add the basemap gallery, in this case we'll display maps from ArcGIS.com including bing maps
        var basemapGallery = new BasemapGallery({
            showArcGISBasemaps: true,
            map: map
        }, "basemapGallery");
        basemapGallery.startup();

        basemapGallery.on("error", function (msg) {
            console.log("basemap gallery error:  ", msg);
        });


        // ********** Heatmap Code Starts from here*************\\


        // --------------------------------------------------------------------
        // Format the magnitude value in the pop up to show one decimal place.
        // Uses the dojo/number module to perform formatting.
        // --------------------------------------------------------------------
        formatMagnitude = function (value, key, data) {
            return number.format(value, { places: 1, locale: "en-us" });
        };
        var content = "Name: ${Name}<br>Magnitude: ${Magnitude:formatMagnitude}" +
            "Name: ${Name}<br>Focal: ${Focal}" +
            "Name: ${Name}<br>Num_Deaths: ${Num_Deaths}" +
            "Name: ${Name}<br>Num_Injured: ${Num_Injured}" +
            "Name: ${Name}<br>Mill_Damages: ${Mill_Damages}" +
            "Name: ${Name}<br>Num_Houses_Dest: ${Num_Houses_Dest}" +
            "Name: ${Name}<br>Num_Houses_Dam: ${Num_Houses_Dam}";
        // var infoTemplate = new InfoTemplate("Attributes",
        //   "Name: ${Name}<br>Magnitude: ${Magnitude:formatMagnitude}");
        var infoTemplate = new InfoTemplate("Attributes",
            content);



        var serviceURL = "//services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Earthquakes_Since_1970/FeatureServer/0";
        var heatmapFeatureLayerOptions = {
            mode: FeatureLayer.MODE_SNAPSHOT,
            outFields: ["Name", "Magnitude", "Focal", "Num_Deaths", "Num_Injured", "Mill_Damages", "Num_Houses_Dest", "Num_Houses_Dam"],
            infoTemplate: infoTemplate
        };
        var heatmapFeatureLayer = new FeatureLayer(serviceURL, heatmapFeatureLayerOptions);



        var blurCtrl = document.getElementById("blurControl");
        var maxCtrl = document.getElementById("maxControl");
        var minCtrl = document.getElementById("minControl");
        // var e = document.getElementById("myList");
        // var selected_option = e.options[e.selectedIndex].value;
        var heatmapRenderer = new HeatmapRenderer({
            field: "",
            blurRadius: blurCtrl.value,
            maxPixelIntensity: maxCtrl.value,
            minPixelIntensity: minCtrl.value
        });

        heatmapFeatureLayer.setRenderer(heatmapRenderer);
        map.addLayer(heatmapFeatureLayer);



        $(document).ready(function () {
            $("select.myList").change(function () {
                var selectedField = $(this).children("option:selected").val();
                //  console.log("You have selected the field - " + selectedField);
                heatmapRenderer.field = selectedField;
                heatmapFeatureLayer.redraw();
            });
        });

        /** Add event handlers for interactivity **/

        var sliders = document.querySelectorAll(".blurInfo p~input[type=range]");
        var addLiveValue = function (ctrl) {
            var val = ctrl.previousElementSibling.querySelector("span");
            ctrl.addEventListener("input", function (evt) {
                val.innerHTML = evt.target.value;
            });
        };
        for (var i = 0; i < sliders.length; i++) {
            addLiveValue(sliders.item(i));
        }

        blurCtrl.addEventListener("change", function (evt) {
            var r = +evt.target.value;
            if (r !== heatmapRenderer.blurRadius) {
                heatmapRenderer.blurRadius = r;
                heatmapFeatureLayer.redraw();
            }
        });
        maxCtrl.addEventListener("change", function (evt) {
            var r = +evt.target.value;
            if (r !== heatmapRenderer.maxPixelIntensity) {
                heatmapRenderer.maxPixelIntensity = r;
                heatmapFeatureLayer.redraw();
            }
        });
        minCtrl.addEventListener("change", function (evt) {
            var r = +evt.target.value;
            if (r !== heatmapRenderer.minPixelIntensity) {
                heatmapRenderer.minPixelIntensity = r;
                heatmapFeatureLayer.redraw();
            }
        });

        // ********** Direction Code Starts from here*************\\

        var directions = new Directions({
            map: map,
            routeTaskUrl: routeURL
            // --------------------------------------------------------------------
            // New constuctor option and property showSaveButton added at version
            // 3.17 to allow saving route. For more information see the API Reference.
            // https://developers.arcgis.com/javascript/3/jsapi/directions-amd.html#showsavebutton
            //
            // Uncomment the line below to add the save button to the Directions widget
            // --------------------------------------------------------------------
            // , showSaveButton: true
        }, "dir");
        directions.startup();


        // ********** Route Analysis Code Starts from here*************\\

        $('#AddRoute').click(function () {

            var handlerroute = map.on("click", addStop);
            routeTask = new RouteTask(routeURL);

            //setup the route parameters
            routeParams = new RouteParameters();
            routeParams.stops = new FeatureSet();
            routeParams.outSpatialReference = {
                "wkid": 102100
            };
            // console.log("routeParams", routeParams);

            routeTask.on("error", errorHandler);

            //define the symbology used to display the route
            stopSymbol = new SimpleMarkerSymbol().setStyle(SimpleMarkerSymbol.STYLE_CROSS).setSize(15);
            stopSymbol.outline.setWidth(4);
            routeSymbol = new SimpleLineSymbol().setColor(new dojo.Color([0, 0, 255, 0.5])).setWidth(5);

            //Adds a graphic when the user clicks the map. If 2 or more points exist, route is solved.
            function addStop(evt) {

                var stop = map.graphics.add(new Graphic(evt.mapPoint, stopSymbol));
                routeParams.stops.features.push(stop);

                if (routeParams.stops.features.length >= 2) {
                    routeTask.solve(routeParams);
                    lastStop = routeParams.stops.features.splice(0, 1)[0];
                }

            }
            //Adds the solved route to the map as a graphic


        });
        $('#SolveRoute').click(function () {
            routeTask.on("solve-complete", showRoute);
            function showRoute(evt) {
                map.graphics.add(evt.result.routeResults[0].route.setSymbol(routeSymbol));
                console.log("Route params", routeParams);
            }
        });



         // ********** Dot Density Code Starts from here*************\\

        $('#dotDensity').click(function () {
            
            if (heatmapFeatureLayer != 'undefined') {
                map.removeLayer(heatmapFeatureLayer);
            }

            densityLayer = new FeatureLayer("https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/USA_County_Crops_2007/FeatureServer/0", {
                outFields: ["STATE", "COUNTY", "M163_07"],
              //  infoTemplate: new InfoTemplate("${COUNTY}, ${STATE}", "Corn Planted: ${M163_07:NumberFormat} Acres")
            });
            densityLayer.setDefinitionExpression("M163_07>10000");

            // update the alias for the field being mapped so it 
            // displays nicely in the legend
            densityLayer.on("load", function (e) {
               
                array.forEach(e.layer.fields, function (field) {
                    if (field.alias === "M163_07") {
                        field.alias = "Acres of Corn";
                    }
                });
            });

            var renderer = new ScaleDependentRenderer({
                rendererInfos: [{
                    renderer: new DotDensityRenderer({
                        fields: [{
                            name: "M163_07",
                            color: new Color("#FF5733")
                        }],
                        dotValue: 3200,
                        dotSize: 2
                    })
                   // maxScale: 17000000,
                  //  minScale: 20000001
                }, {
                    renderer: new DotDensityRenderer({
                        fields: [{
                            name: "M163_07",
                            color: new Color("#FF5733")
                        }],
                        dotValue: 1600,
                        dotSize: 2
                    })
                  //  maxScale: 8500000,
                  //  minScale: 17000000
                }, {
                    renderer: new DotDensityRenderer({
                        fields: [{
                            name: "M163_07",
                            color: new Color("#FF5733")
                        }],
                        dotValue: 800,
                        dotSize: 2
                    })
                   // maxScale: 5000000,
                   // minScale: 8500000
                }]
            });
            densityLayer.setRenderer(renderer);
           
            map.addLayers([densityLayer]);

            var refLayer = new ArcGISTiledMapServiceLayer("https://tiles.arcgis.com/tiles/nGt4QxSblgDfeJn9/arcgis/rest/services/Dark_Gray_Albers_North_America_Reference/MapServer");
           // map.addLayer(refLayer);

            map.on("layers-add-result", function (e) {
                var corn = e.layers[0].layer;
                var legend = new Legend({
                    map: map,
                    layerInfos: [{
                        layer: corn,
                        title: "US Corn Production (2007)"
                    }]
                }, "legend");
                legend.startup();
            });

        });



       // ********** Point Clusters Code Starts from here*************\\

        $('#pointClusters').click(function () {

            //if (heatmapFeatureLayer != 'undefined') {
            //    map.removeLayer(heatmapFeatureLayer);
            //}      
            //if (industryLayer2 != 'undefined') {
            //    map.removeLayer(industryLayer2);
            //}
            
            addClusterLayer();

        });
        // Option 1: Esri marker for single locations and selections
        // defaultSym = new createPictureSymbol("./images/blue-cluster-pin.png", 0, 8, 9, 16);
        // selectedSym = new createPictureSymbol("./images/blue-cluster-pin.png", 0, 9, 11, 20);

        // Option 2: Use circle markers for symbols - Red
        defaultSym = new SimpleMarkerSymbol("circle", 16,
            new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([102, 0, 0, 0.55]), 3),
            new Color([255, 255, 255, 1]));

        selectedSym = new SimpleMarkerSymbol("circle", 16,
            new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([102, 0, 0, 0.85]), 3),
            new Color([255, 255, 255, 1]));

        // Create a feature layer to get feature service
        function addClusterLayer() {
            var renderer,small,medium,large,xlarge;

            // Add cluster renderer
            clusterLayer = new ClusterFeatureLayer({
                "url": equipmentLayerURL,
                "distance": 110,
                "id": "clusters",
                "labelColor": "#fff",
                "resolution": map.extent.getWidth() / map.width,
                //"singleColor": "#888",
                "singleSymbol": defaultSym,
                "singleTemplate": infoTemplate,
                "useDefaultSymbol": false,
                "zoomOnClick": true,
                "showSingles": true,
                "objectIdField": "FID",
                outFields: ["*"]
            });

            renderer = new ClassBreaksRenderer(defaultSym, "clusterCount");

            // Red Clusters
            small = new SimpleMarkerSymbol("circle", 25,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([212, 116, 60, 0.5]), 15),
                new Color([212, 116, 60, 0.75]));
            medium = new SimpleMarkerSymbol("circle", 50,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([178, 70, 37, 0.5]), 15),
                new Color([178, 70, 37, 0.75]));
            large = new SimpleMarkerSymbol("circle", 80,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([144, 24, 13, 0.5]), 15),
                new Color([144, 24, 13, 0.75]));
            xlarge = new SimpleMarkerSymbol("circle", 110,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([102, 0, 0, 0.5]), 15),
                new Color([102, 0, 0, 0.75]));

            // Break values - can adjust easily
            renderer.addBreak(2, 10, small);
            renderer.addBreak(10, 20, medium);
            renderer.addBreak(30, 40, large);
            renderer.addBreak(40, 50, xlarge);
            
            // Providing a ClassBreakRenderer is also optional
            clusterLayer.setRenderer(renderer);
            map.addLayer(clusterLayer);
        }

         // ********** Clear Route Code Starts from here*************\\
        $('#ClearRoute').click(function () {
           // alert("Test");
            map.graphics.clear();
        });

        $('#clearGraphics').click(function () {
            map.graphics.clear();
            if (clusterLayer != 'undefined') {
                map.removeLayer(clusterLayer);
            }
            if (densityLayer != undefined) {
                map.removeLayer(densityLayer);
            }
        });

        //Displays any error returned by the Route Task
        function errorHandler(err) {
            alert("An error occured\n" + err.message + "\n" + err.details.join("\n"));

            routeParams.stops.features.splice(0, 0, lastStop);
            map.graphics.remove(routeParams.stops.features.splice(1, 1)[0]);
        }


        //$('#Clusters').click(function () {
        //    alert("Cluster Layer");

        //})



    });

// ********** Model click Code Starts from here*************\\

function modelclick() {
    var a = document.getElementById('menu7');
    console.log("test", a);
    //var $myGroup = $('#myGroup');
    //$myGroup.on('show.bs.collapse', '.collapse', function () {
    //    $myGroup.find('.collapse.show').collapse('hide');
    //});
    $('#menu7').show();

}
