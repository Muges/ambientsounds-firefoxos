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
        
        # Length
        echo -n "length: "
        sox "$f" -n stats 2>&1| grep "Length" | awk "{gsub(/[a-zA-Z\\. ]/, \"\", \$0);printf(\$0);}"
        
        echo "},"
    done
    echo "]"
    
    cd ..
}

print_sounds > app/sounds.js

rm -f ambientsounds.zip
zip ambientsounds.zip -r app icons manifest.webapp -x "*.git*"
