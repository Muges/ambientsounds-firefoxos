#!/usr/bin/env sh

function print_sounds {
    cd app
    
    echo "sounds = ["
    for f in sounds/*.ogg
    do
        echo -n "    {"
        
        # Filename
        echo -n "filename: \""
        echo -n $f
        echo -n "\", "
        
        # Name
        echo -n "name: \""
        ogginfo $f | grep "TITLE" | awk "{sub(/\\s+TITLE=/, \"\", \$0); printf(\$0)}"
        echo -n "\", "
        
        # Author
        echo -n "author: \""
        ogginfo $f | grep "ARTIST" | awk "{sub(/\\s+ARTIST=/, \"\", \$0); printf(\$0)}"
        echo -n "\", "
        
        # URL
        echo -n "url: \""
        ogginfo $f | grep "CONTACT" | awk "{sub(/\\s+CONTACT=/, \"\", \$0); printf(\$0)}"
        echo -n "\", "
        
        # License
        echo -n "license: \""
        ogginfo $f | grep "COPYRIGHT" | awk "{sub(/\\s+COPYRIGHT=/, \"\", \$0); printf(\$0)}"
        echo -n "\""
        
        echo "},"
    done
    echo "]"
    
    cd ..
}

print_sounds > app/sounds.js

rm -f ambientsounds.zip
zip ambientsounds.zip -r app manifest.webapp -x "*.git*"
