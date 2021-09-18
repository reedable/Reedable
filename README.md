# Reedable Chrome Extension

We declare a thumb war against the self-centered, self-absorbed, 
self-grrrrr-whatever web designers, and take back the world wide web for the
rest of us.

Tiny fonts, tightly positioned text, elegant typeface that no one can see and
read... If you have experienced any of these things, we are here to help.

Override the typeface. Tweak that text space. (Oh, I just rhymed.) Reedable
Chrome Extension provides the reader (that's you) the freedom to choose.


## Boring stuff...

Reedable Chrome Extension is a Free and Open Source Software (FOSS), and its
license is provided in the accompanying LICENSE file.

Reedable Chrome Extension depends on the following third-party libraries, which
may come under their own licenses. Reedable Chrome Extension's licensing terms
and conditions do not override those of the third-party library licenses.

What this means is that: Above all, do not be an asshole. Be respectful.
Someone wasted their time, so you do not have to.

### Fontawesome

Fontawesome is used to render icons on the extension's popup and options user
interface, and governed by the following license.

- https://fontawesome.com/v4.7/license/

### OpenDyslexic

OpenDyslexic is a font library used in order to override the typeface of the
website content, and governed by the following license.

- https://opendyslexic.org/license


## Documentation

Documentation for the production version of Reedable Chrome Extension is
available at Github pages site.

https://reedable.github.io/Reedable/


## How to install unpacked Chrome extension

*WARNING*

If you wish, you can clone this git repository, checkout the source code to
your disk, and load the unpacked version of Reedable Chrome Extension to your
browser... BUT, we highly discourage you from doing this. If you are a casual
user, you really should install Chrome Extensions from
[Chrome Web Store](https://chrome.google.com/webstore/category/extensions).
The Chrome Extensions available at the store are at least reviewed by someone
more competent than we are, and it is less likely that you end up installing
malware through the store. (Malware still does get through the review, but it
is still better than blindly trusting someone on Github.)

While we have no intentions to harm you, after all, we are mostly humans. We
make mistakes, we might get hacked, and someone might hitch a ride with our
code and inject malicious software into your computer.

Unless you are absolutely sure you know what you are doing, please do NOT
install the unpacked version of this extension.

You have been warned. Do you still want to install an unpacked version of the
extension? Well, here it goes.

1. Clone the repository

    `git clone https://github.com/reedable/Reedable.git`
    
2. Open Chrome Browser and enter `chrome://extensions` in the addressbar.
![chrome://extensions](https://reedable.github.io/Reedable/images/Reedable_unpacked_1.png)

3. Turn on "Developer mode"
![Developer mode](https://reedable.github.io/Reedable/images/Reedable_unpacked_2.png)

4. Click "Load unpacked" button, and select "src" inside Reedable project
   you just checked out.
![Load unpacked](https://reedable.github.io/Reedable/images/Reedable_unpacked_3.png)
   
   Once loaded, the Reedable Chrome Extension should appear on the
   extensions page.
![Pin the Reedable icon](https://reedable.github.io/Reedable/images/Reedable_unpacked_4.png)

5. Pin the Reedable icon to the toolbar (optional)
![Reedable popup](https://reedable.github.io/Reedable/images/Reedable_unpacked_5.png)

6. Click Reedable icon to reveal the popup.
![Reedable popup](https://reedable.github.io/Reedable/images/Reedable_unpacked_6.png)


## Stuff we're going to do

- TODO Package: https://www.booyagadget.com/2011/05/how-to-package-your-google-chrome-extensions-and-install.html
- TODO Publish: https://developer.chrome.com/docs/webstore/publish/

### Content

- TODO Refactor the UI script code, so it is unit testable
- TODO Figure out how to manage multiple windows
- TODO Figure out how to manage tab switches.
- TODO Figure out how to traverse IFRAME content.
- TODO Add an option to underline all link text, e.g. a[href] and [role=link]
- TODO Consider adding minimum text color contrast feature
- TODO Consider adding color inversion feature

### Popup

- TODO Refactor the UI script code, so it is unit testable
- TODO Make the popup pretty and accessible.
- TODO Decide whether preview panel should be added to the popup HTML?
- TODO Decide whether to add error handling to popup form input.

### Options

- TODO Add options panel to restore all values to the default.

### Testing, samples, and documentation

- TODO Supply favicon for the documentation
- TODO Add unit tests
- TODO Add web component samples in sample/index.html

### Other

- TODO Consider building a separate Outliner (injects TOC panel with landmarks/header links).

## Links

- https://reedable.github.io/Reedable/
- https://github.com/reedable/Reedable
