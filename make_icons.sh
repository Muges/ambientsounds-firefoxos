#!/usr/bin/env sh
for s in 32 60 64 128 512
do
    inkscape -z -e "icons/icon-$s.png" -w $s -h $s "icons/icon.svg"
done
