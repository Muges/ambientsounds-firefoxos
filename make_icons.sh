#!/usr/bin/env sh
for s in 32 60 64 128 512
do
    inkscape -z -e "app/icons/icon-$s.png" -w $s -h $s "app/icons/icon.svg"
done
