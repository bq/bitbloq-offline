
# Bitbloq Offline

[![Build Status](https://api.travis-ci.org/Luisangonzalez/bitbloq-offline.svg?branch=develop)]

## Introduction ##
This is the offline version of the Bitbloq project, a [visual programming tool](https://en.wikipedia.org/wiki/Visual_programming_language) for [Arduino](https://www.arduino.cc/).

The current version supports the following boards:

 - Arduino UNO
 - Freaduino UNO
 - BQ ZUM

And the following robots:

 - ZOWI




## Getting Started ##

Clone the repo:

    git clone https://github.com/bq/bitbloq-offline.git

Get into the directory:

       cd bitbloq-offline/

Install npm and Bower components:

    npm install
    bower install
Launch the app:

    electron .


## Packaging ##
Just build for all Operating systems:

    grunt dist

Or depending on the operating system:


- Windows:

        grunt dist:windows
- Linux:

        grunt dist:linux
- Mac:

        grunt dist:mac

This will generate a `/dist/{os}` folder with the app ready to be launched.


## App Structure ##
```
app
├── fonts // App fonts
├── images // App images
│   ├── boards // Images for boards
│   ├── components // Images for components
│   ├── icons // Icons for svgstore
│   └── robots // Images for robots
├── res // Common resources
│   ├── locales // Language translations
│   ├── menus // JSON files for generating menus
│   └── web2board // web2board nested app
├── scripts // Angular scripts
│   ├── controllers // Angular controllers
│   ├── directives // Angular directives
│   ├── factories // Angular factories
│   └── services // Angular services
├── styles // App styles
│   ├── components // Styles for components
│   ├── vendor // Vendor styles
│   └── views // Styles for views
└── views // All views
│   ├── components // Views for components
│   └── view.html // App normal view
└── main.js // Electron config
```



## Developing ##

You can set your own config in `main.js` file.  

Grunt tasks

    grunt svgstore // Generates an svg sprite from icons folder.
    grunt sass // Compiles scss files to a single main.css file.
    grunt watch // Watches yout changes and reloads the app.
