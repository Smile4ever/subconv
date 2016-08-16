#TODO

##General

* Generate a man page
* Make a internal representation of the data that is contained in the file format instead of internally converting to SRT
* Implement more subtitle formats, see "Other file formats"
* Test SRT multi line subtitles
* Allow the user to select the profile "advanced SubRip" to have color codes / tags

###LRC and WebVTT support

Currently, only basic LRC support is implemented. These features should be implemented as well:

* ID Tags
* Simple format extended
* Enhanced format &lt;mm:ss.xx&gt;

https://en.wikipedia.org/wiki/LRC_%28file_format%29#Formats

Currently, only basic WebVTT support is implemented. Also, there is no way to tell subconv it's WebVTT as input when there is no vtt or webvtt extension used.

https://en.wikipedia.org/wiki/WebVTT
https://w3c.github.io/webvtt/

##Other file formats

###Priority Medium
* MicroDVD ("sub") - https://en.wikipedia.org/wiki/MicroDVD
* SubViewer ("sub") - https://en.wikipedia.org/wiki/SubViewer
* W3C TTML, includes profiles such as SMPTE-TT, so we're gonna need a "profiles" system

###Priority Low

* Kate file format

<pre>
    kate{
    	event { 00:00:05 --> 00:00:10 "This is a text" }
    }
</pre>
* XSUB - https://wiki.multimedia.cx/index.php?title=XSUB - https://www.ffmpeg.org/doxygen/0.5/xsubdec_8c-source.html
* MPEG-4 Part 17 / 3GPP Timed Text (TTXT)
https://gpac.wp.mines-telecom.fr/mp4box/ttxt-format-documentation/

Other file formats worth considering:
https://en.wikipedia.org/wiki/Category:Subtitle_file_formats
https://en.wikipedia.org/wiki/DirectVobSub (includes an overview of file extensions vs formats)