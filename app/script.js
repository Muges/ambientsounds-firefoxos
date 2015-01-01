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

/*
 * Object used to seamlessly loop an audio file (this should work on
 * Firefox)
 */
function Loop(filename, length) {
    this.length = length;
    this.player = [document.createElement("audio"),
                   document.createElement("audio")];
    this.current = 0;
    
    this.player[0].src = filename;
    this.player[1].src = filename;
    this.player[0].setAttribute("mozaudiochannel", "content");
    this.player[1].setAttribute("mozaudiochannel", "content");
    this.player[0].volume = 0;
    this.player[1].volume = 0;
    
    this.timeout = null;
}

/*
 * Callback called to start the playback
 */
Loop.prototype.callback = function() {
    this.current = 1 - this.current;
    
    this.player[this.current].play();
    
    this.timeout = setTimeout(this.callback.bind(this), this.length-25);
}

/*
 * Set the volume of the audio file (between 0 and 100)
 */
Loop.prototype.setVolume = function(volume) {
    this.player[0].volume = volume/100;
    this.player[1].volume = volume/100;
    if (this.timeout == null && volume > 0) {
        this.callback();
    } else if (this.timeout != null && volume == 0) {
        this.player[this.current].pause();
        clearTimeout(this.timeout);
        this.timeout = null;
    }
}

function create_player(sound) {
    // Create the volume slider and its label and add them to the page
    var form = $(document.createElement("form"));
    form.addClass("sound");
    var label = $(document.createElement("div"));
    label.addClass("label");
    label.text(sound.name);
    
    var range = $(document.createElement("div"));
    
    this.append(form);
    form.append(label);
    form.append(range);
    
    range.noUiSlider({
        start: [ 0 ],
        behaviour: 'snap',
        connect: 'lower',
        range: {
            'min': [   0 ],
            'max': [ 100 ]
        }
    });

    // Load the sound
    var loop = new Loop(sound.filename, sound.length);
    
    callback = function() {
        loop.setVolume(range.val());
    };
    
    range.on('slide', callback);
}

window.onload = function() {
    sounds.forEach(create_player, $("body"));
}
