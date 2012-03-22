/**
 * © Glan Thomas 2012
 */

define('views/LayerAttributesPanel', ['models/Rect' ,'models/ColorStops', 'models/ColorStop', 'models/Length', 'models/Direction','views/InputColor'], function (Rect, ColorStops, ColorStop, Length, Direction, InputColor) {
    'use strict';

    function LayerAttributesPanel() {
        //$('#info-panel').unbind();
        document.getElementById('info-panel').addEventListener('input', this);
        document.getElementById('info-panel').addEventListener('change', this);

        document.getElementById('info-panel').addEventListener('click', function (event) {
            var spawnEvent;
            if (event.target.className === 'remove') {
                spawnEvent = document.createEvent('UIEvents');
                event.target.parentNode.parentNode.removeChild(event.target.parentNode);
                spawnEvent.initUIEvent('change', true, true, window, 1);
                document.getElementById('info-panel').dispatchEvent(spawnEvent);
            }
        });

        document.getElementById('info_add_colorstop').addEventListener('click', function (event) {
            var template = document.querySelector('#templates>.colorstop');
            var colorStopElement = template.cloneNode(true);
            document.getElementById('info_layer_stops').appendChild(colorStopElement);
            new InputColor(colorStopElement.querySelector('input[type=color]'));
        });

        document.getElementById('info_linear_direction').addEventListener('focus', function(event) {
            document.querySelector('#info_linear_direction_set input[type=radio].manual').checked = true;
            var spawnEvent = document.createEvent('UIEvents');
            spawnEvent.initUIEvent('change', true, true, window, 1);
            document.getElementById('info-panel').dispatchEvent(spawnEvent);
        });

        document.getElementById('info_layer_opacity_range').addEventListener('change', function(event) {
            document.getElementById('info_layer_opacity').value = this.value;
        });
        document.getElementById('info_layer_opacity').addEventListener('input', function(event) {
            document.getElementById('info_layer_opacity_range').value = this.value;
        });

        document.getElementById('info-hsl-hue-range').addEventListener('change', function(event) {
            document.getElementById('info-hsl-hue').value = this.value;
        });
        document.getElementById('info-hsl-hue').addEventListener('input', function(event) {
            document.getElementById('info-hsl-hue-range').value = this.value;
        });

        document.getElementById('info-hsl-saturation-range').addEventListener('change', function(event) {
            document.getElementById('info-hsl-saturation').value = this.value;
        });
        document.getElementById('info-hsl-saturation').addEventListener('input', function(event) {
            document.getElementById('info-hsl-saturation-range').value = this.value;
        });

        document.getElementById('info-hsl-lightness-range').addEventListener('change', function(event) {
            document.getElementById('info-hsl-lightness').value = this.value;
        });
        document.getElementById('info-hsl-lightness').addEventListener('input', function(event) {
            document.getElementById('info-hsl-lightness-range').value = this.value;
        });

        $("#info_layer_stops").sortable({cursor:'-webkit-grabbing', containment:'document', items: 'li', axis: 'y' });
        $("#info_layer_stops").disableSelection();

        document.getElementById('info-panel').addEventListener('sortupdate', this, true);
        // Nasty jQuery events relay hack for catching sortupdate as a real UI event
        $('#info-panel').parent().bind("sortupdate", function() {
            var spawnEvent = document.createEvent('UIEvents');
            spawnEvent.initUIEvent("sortupdate", false, false, window, 1);
            document.getElementById('info-panel').dispatchEvent(spawnEvent);
        });
    }

    var layerAttributesPanel = {
        setData : function (layers) {
            var layer = layers.first(),
                rect = layers.getRect(),
                radio,
                template = document.querySelector('#templates>.colorstop');

            document.getElementById('info_size_width').value = 1 * rect.getWidth().getValue();
            document.getElementById('info_size_width_unit').value = rect.getWidth().getUnit();
            document.getElementById('info_size_height').value = 1 * rect.getHeight().getValue();
            document.getElementById('info_size_height_unit').value = rect.getHeight().getUnit();
            document.getElementById('info_position_x').value = 1 * rect.getLeft().getValue();
            document.getElementById('info_position_x_unit').value = rect.getLeft().getUnit();
            document.getElementById('info_position_y').value = 1 * rect.getTop().getValue();
            document.getElementById('info_position_y_unit').value = rect.getTop().getUnit();

            document.getElementById('info_repeating').checked = layer.getRepeating();

            document.getElementById('info_layer_composite').value = layer.attributes.composite;
            document.getElementById('info_layer_opacity').value = Math.round(layers.getOpacity() * 100);
            document.getElementById('info_layer_opacity_range').value = Math.round(layers.getOpacity() * 100);

            this.hue = document.getElementById('info-hsl-hue').value = document.getElementById('info-hsl-hue-range').value = 0;
            this.saturation = document.getElementById('info-hsl-saturation').value = document.getElementById('info-hsl-saturation-range').value = 0;
            this.lightness = document.getElementById('info-hsl-lightness').value = document.getElementById('info-hsl-lightness-range').value = 0;

            if (layers.length > 1) {
                document.getElementById('info-panel').className = 'multi';
            } else {
                if (layer.attributes.image.name === 'radial-gradient') {
                    document.getElementById('info-panel').className = 'single radial';

                    document.getElementById('info_radial_shape').value = layer.attributes.image.shape;
                    document.getElementById('info_radial_size').value = layer.attributes.image.size;

                    document.getElementById('info_radial_position_x').value = layer.attributes.image.getPosition().x.getValue();
                    document.getElementById('info_radial_position_x_units').value =layer.attributes.image.getPosition().x.getUnit();

                    document.getElementById('info_radial_position_y').value = layer.attributes.image.getPosition().y.getValue();
                    document.getElementById('info_radial_position_y_units').value = layer.attributes.image.getPosition().y.getUnit();

                    document.getElementById('info_radial_size_width').value = layer.attributes.image.width.getValue();
                    document.getElementById('info_radial_size_width_units').value =layer.attributes.image.width.getUnit();

                    document.getElementById('info_radial_size_height').value = layer.attributes.image.height.getValue();
                    document.getElementById('info_radial_size_height_units').value = layer.attributes.image.height.getUnit();

                } else if (layer.attributes.image.name === 'linear-gradient') {
                    document.getElementById('info-panel').className = 'single linear';

                    radio = document.querySelector('#info_linear_direction_set input[value=\''+layer.attributes.image.direction.toString()+'\']');
                    if (radio)
                        radio.checked = true;
                    else
                        document.querySelector('#info_linear_direction_set input[type=radio].manual').checked = true;
                    document.getElementById('info_linear_direction').value = layer.attributes.image.direction.getValue();
                }

                document.getElementById('info-hsl-hue-range').value = document.getElementById('info-hsl-hue').value = this.hue = ((180 - layer.attributes.hue) % 360) - 180;
                document.getElementById('info-hsl-saturation-range').value = document.getElementById('info-hsl-saturation').value = this.saturation = layer.attributes.saturation;
                document.getElementById('info-hsl-lightness-range').value = document.getElementById('info-hsl-lightness').value = this.lightness = layer.attributes.lightness;

                //document.querySelector('#info-panel .color-stops-options').style.display = 'block';

                document.getElementById('info_layer_stops').innerHTML = '';
                layer.attributes.image.colorStops.getColorStops().forEach(function(colorStop) {
                    var newStop = template.cloneNode(true);
                    newStop.querySelector('input[type=color]').value = colorStop.color;
                    new InputColor(newStop.querySelector('input[type=color]'));
                    if (colorStop.length) {
                        newStop.querySelector('.stop').value = colorStop.length.getValue();
                        newStop.querySelector('.unit').value = colorStop.length.getUnit();
                    }
                    document.getElementById('info_layer_stops').appendChild(newStop);
                });
                document.getElementById('info_gradient_preview').setAttribute('style',
                    'background: -webkit-linear-gradient(0deg,'+layer.attributes.image.colorStops.getColorStops().toString()+');' +
                    'background: -moz-linear-gradient(0deg,'+layer.attributes.image.colorStops.getColorStops().toString()+');'
                );
            }
        },
        handleEvent : function (event) {
            // We need to suppress change events for the colorstop field since these should only use input
            if ((event.type !== 'change') || (event.target.className !== 'color' && event.target.className !== 'stop')) {
                var spawnEvent = document.createEvent('UIEvents'),
                    radio,
                    rect = new Rect({
                        width: ((document.getElementById('info_size_width').value > 0) ? document.getElementById('info_size_width').value : 1) + document.getElementById('info_size_width_unit').value,
                        height: ((document.getElementById('info_size_height').value > 0) ? document.getElementById('info_size_height').value : 1) + document.getElementById('info_size_height_unit').value,
                        left: document.getElementById('info_position_x').value + document.getElementById('info_position_x_unit').value,
                        top: document.getElementById('info_position_y').value + document.getElementById('info_position_y_unit').value
                    });

                spawnEvent.initUIEvent('infopanel_update', true, true, window, 1);
                spawnEvent.rect = rect;
                spawnEvent.repeating = document.getElementById('info_repeating').checked;
                spawnEvent.composite = document.getElementById('info_layer_composite').value;
                spawnEvent.opacity = document.getElementById('info_layer_opacity').value / 100;

                spawnEvent.image = {};
                spawnEvent.image.position = {};
                spawnEvent.image.position.x = new Length().parseLength(document.getElementById('info_radial_position_x').value + document.getElementById('info_radial_position_x_units').value);
                spawnEvent.image.position.y = new Length().parseLength(document.getElementById('info_radial_position_y').value + document.getElementById('info_radial_position_y_units').value);
                spawnEvent.image.shape = document.getElementById('info_radial_shape').value;
                spawnEvent.image.size = document.getElementById('info_radial_size').value;
                spawnEvent.image.width = new Length().parseLength(document.getElementById('info_radial_size_width').value + document.getElementById('info_radial_size_width_units').value);
                spawnEvent.image.height = new Length().parseLength(document.getElementById('info_radial_size_height').value + document.getElementById('info_radial_size_height_units').value);

                spawnEvent.hue = this.hue - (1 * document.getElementById('info-hsl-hue').value);
                this.hue = 1 * document.getElementById('info-hsl-hue').value;

                spawnEvent.saturation = (1 * document.getElementById('info-hsl-saturation').value) - this.saturation;
                this.saturation = 1 * document.getElementById('info-hsl-saturation').value;

                spawnEvent.lightness = (1 * document.getElementById('info-hsl-lightness').value) - this.lightness;
                this.lightness = 1 * document.getElementById('info-hsl-lightness').value;

                radio = document.querySelector('#info_linear_direction_set input:checked');
                if (radio && radio.value) {
                    spawnEvent.image.direction = new Direction(radio.value);
                } else {
                    spawnEvent.image.direction = new Direction(document.getElementById('info_linear_direction').value + 'deg');
                }

                spawnEvent.colorStops = new ColorStops();
                $('#info_layer_stops .colorstop').each(function(e, el) {
                    spawnEvent.colorStops.add(new ColorStop(el.querySelector('.color').value + ((el.querySelector('.stop').value != '') ? + ' ' + (1 * el.querySelector('.stop').value) + el.querySelector('.unit').value : '')));
                });

                document.getElementById('info_gradient_preview').setAttribute('style',
                    'background: -webkit-linear-gradient(0deg,'+spawnEvent.colorStops.toString()+');' +
                    'background: -moz-linear-gradient(0deg,'+spawnEvent.colorStops.toString()+');'
                );
                document.dispatchEvent(spawnEvent);
            }
        },
        show : function () {
            $(document.body).addClass('showInfo');
        },
        hide : function () {
            $(document.body).removeClass('showInfo');
        }
    }

    LayerAttributesPanel.prototype = layerAttributesPanel;
    return LayerAttributesPanel;

});