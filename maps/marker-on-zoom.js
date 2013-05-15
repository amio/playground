/**
 * User: Amio
 * Date: 5/9/13
 */

(function (window){
    var GM = google.maps;

    //noinspection JSUnresolvedFunction
    var app = {
        initialize: function (){
            // Init map
            var mapCanvas = document.getElementById('map-canvas'),
                mapOptions = {
                    center: new GM.LatLng(-34.397, 150.644),
                    zoom: 9,
                    mapTypeId: GM.MapTypeId.ROADMAP
                };
            window.map = new GM.Map(mapCanvas, mapOptions);

            // Init markers
            GM.event.addListenerOnce(map, 'idle', function (){
                app.initMarkers(20);
            });

            // Change markers style on zoom
            GM.event.addListener(map, 'zoom_changed', function (){
                app.markers.forEach(function (mk){
                    app.updateMarkerIcon(mk);
                });
            });
        },

        initMarkers: function (num){
            app.markers = [];

            // Auto Generate Markers by num
            for (var i = num; i--;) {
                setTimeout(function (){
                    app.genMarker(app.randomLatLng());
                }, 90 * i);
            }

            // Create an Marker when click
            GM.event.addListener(map, 'click', function (e){
                app.genMarker(e.latLng);
            });
        },

        // Create an Marker by GM.latLng
        genMarker: function (latLng){
            var mk = new GM.Marker({
                title: latLng.toString(),
                position: latLng,
                draggable: true,
                animation: GM.Animation.DROP,
                optimized: true
            });

            app.markers.push(mk);
            app.updateMarkerIcon(mk);
            mk.setMap(map);

            return mk;
        },

        // Generate a random GM.LatLng object inside the viewport
        randomLatLng: function (){
            var bounds = map.getBounds();
            var ne = bounds.getNorthEast(),
                sw = bounds.getSouthWest();
            return new GM.LatLng(
                Math.random() * ( ne.lat() - sw.lat() ) * 0.9 + sw.lat(),
                Math.random() * ( ne.lng() - sw.lng() ) * 1.2 + sw.lng()
            );
        },

        updateMarkerIcon: function (marker){
            var zoomLevel = window.map.getZoom();
            //noinspection JSValidateTypes
            marker.setIcon({
                path: GM.SymbolPath.CIRCLE,
                fillColor: 'hsl(' + (360 - zoomLevel * 15) + ', 70%, 70%)',
                fillOpacity: 0.6,
                strokeColor: 'hsl(' + (360 - zoomLevel * 15) + ', 60%, 40%)',
                strokeOpacity: 0.8,
                strokeWeight: 1 + parseInt(zoomLevel / 3),
                scale: zoomLevel + 2
            });
        }
    };

    window.app = app;

    document.addEventListener("DOMContentLoaded", app.initialize, false);

})(this);