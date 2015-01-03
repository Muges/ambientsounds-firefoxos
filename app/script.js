/*
 *  Copyright (c) 2014-2015 Muges
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation files
 * (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 * BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

// Create the audio context
var context;
if (typeof(window.AudioContext) != "undefined") {
    context = new AudioContext("content");
} else {
    context = new WebkitAudioContext();
}

// Create the master volume control node and connect it to the
// destination
var masterGainNode = context.createGain();
masterGainNode.connect(context.destination);

/*
 * Object used to seamlessly loop an audio file using the Web Audio API
 * (it should work on most recent browsers)
 */
function Loop(filename) {
    var self = this;
    
    self.filename = filename
    self.loaded = false;
    self.playing = false;
    
    self.sourceNode = context.createBufferSource();
    self.sourceNode.loop = true;
    self.gainNode = context.createGain();
    
    self.sourceNode.connect(self.gainNode);
    self.gainNode.connect(masterGainNode);
}

/*
 * Load the audio file in the buffer of the source node
 */
Loop.prototype.load = function() {
    var self = this;
    
    var xhr = new XMLHttpRequest();
    xhr.open('GET', this.filename, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function() {
        context.decodeAudioData(xhr.response, function(buffer) {
            if (buffer) {
                self.loaded = true;
                self.sourceNode.buffer = buffer;
            }
        });
    };
    xhr.send();
}

/*
 * Set the volume of the audio file (between 0 and 1)
 */
Loop.prototype.setVolume = function(volume) {
    var self = this;
    
    self.gainNode.gain.value = volume;
    
    if (!self.playing && volume > 0) {
        if (!self.loaded) {
            self.load();
        }
        self.playing = true;
        self.sourceNode.start(0);
    } else if (self.playing && volume == 0) {
        self.sourceNode.stop();
        self.playing = false;
    }
}

function add_sound(sound) {
    var loop = new Loop(sound.filename);
    
    var form = $(document.createElement("form"));
    form.addClass("sound");
    $("#sounds").append(form);
    
    // Display the name of the sound
    var label = $(document.createElement("div"));
    label.addClass("label");
    label.text(sound.name);
    form.append(label);

    // Volume slider
    var range = $(document.createElement("div"));
    form.append(range);
    
    range.noUiSlider({
        start: [ 0 ],
        behaviour: 'snap',
        connect: 'lower',
        range: {
            'min': [ 0 ],
            'max': [ 1 ]
        },
        step: 0.01
    });
    range.on('slide', function() {
        loop.setVolume(range.val());
    });
    
    // Credits
    var item = $(document.createElement("li"));
    $("#soundsinfo").append(item);
    
    var link = $(document.createElement("a"));
    link.attr("href", sound.url);
    link.attr("target", "_blank");
    link.text(sound.name+" by "+sound.author+" ("+sound.license+")");
    item.append(link);
}

function create_master_slider() {
    var form = $(document.createElement("form"));
    form.addClass("range");
    $("#master").prepend(form);

    var range = $(document.createElement("div"));
    form.append(range);

    range.noUiSlider({
        start: [ 1 ],
        behaviour: 'snap',
        connect: 'lower',
        range: {
            'min': [ 0 ],
            'max': [ 1 ]
        },
        step: 0.01
    });
    range.on('slide', function() {
        masterGainNode.gain.value = range.val();
    });
}

function show_credits() {
    $("#sounds").hide();
    $("#credits").show();
    $("#credits-icon").hide();
    $("#back-icon").show();
}

function show_sounds() {
    $("#credits").hide();
    $("#sounds").show();
    $("#back-icon").hide();
    $("#credits-icon").show();
}

window.onload = function() {
    show_sounds();
    
    $("#credits-icon").click(show_credits);
    $("#back-icon").click(show_sounds);
    
    create_master_slider();

    for (var i = 0, len = sounds.length; i < len; i++) {
        add_sound(sounds[i]);
    }
}
