
subconv converts subtitles between subtitle formats.

Installation
==

Linux / Windows
- Install NodeJS.
- Execute the following commands

    git clone https://github.com/Smile4ever/subconv
    cd subconv
    sudo npm update
    sudo npm install -g

(for Windows, execute the command without sudo and do this in an elevated command prompt as Administrator)

Usage
==

See subconv --help for all switches.

Convert from SRT to WebVTT:

    subconv -f webvtt "Vixen - Cryin.srt"

Convert from LRC to SRT:

    subconv -f srt "Vixen - Cryin.lrc"

Supported formats
==

- SRT (SubRip)
- LRC (LyRiCs)
- WebVTT

For planned formats, have a look at the TODO.