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
        echo -n "\""
        
        echo "},"
    done
    echo "]"
    
    cd ..
}

print_sounds > app/sounds.js

rm -f ambientsounds.zip
zip ambientsounds.zip -r app icons manifest.webapp -x "*.git*"
