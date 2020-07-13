var map;

require([
   
    "esri/map",
    "esri/dijit/BasemapGallery",
    "dojo/domReady!"
],
    function (
        Map,
        BasemapGallery,
        
    ) {
        //add the basemap gallery, in this case we'll display maps from ArcGIS.com including bing maps
        var basemapGallery = new BasemapGallery({
            showArcGISBasemaps: true,
            map: map
        }, "basemapGallery");
        basemapGallery.startup();

        basemapGallery.on("error", function (msg) {
            console.log("basemap gallery error:  ", msg);
        });


    });
