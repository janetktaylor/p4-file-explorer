# File Explorer

A simple file explorer implemented with node.js modules, you can navigate through
folders and open files.

NOTE: Right now this only works on POSIX systems so we can display the realname when we see who last modified the file.  (We require the pwuid Node module in file_info_bar.)

## APIs

* [fs module](http://nodejs.org/api/fs.html)
* [events module](http://nodejs.org/api/events.html)
* [path module](http://nodejs.org/api/path.html)
* [util module](http://nodejs.org/api/util.html)
* [child_process module](http://nodejs.org/api/child_process.html)

## Screenshot

![screenshot](/file-explorer/screenshot/screenshot.png)
