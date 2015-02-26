# Overview
Support materials for Drexel CS338 UI programming class.

### Contents
- class_slides - slides used during class
- [v1](v1) - example from Monday class
- [v4](v4) - project from Wednesday class
- [v5](v5) - basis for assignment (a more developed version of the Wednesday project)
- [v6](v6) - basis for assignment with guidelines of where to work in comments
- ["State" and "Render"](state-and-render.md) - diagram and notes about keeping UI `state` separate, and using a `render` method up update what the user sees

### Cloning this repository
To run these projects locally, first you'll need to clone this git repository to your local computer.  For instructions on how to clone a git repository, check out Github: [https://help.github.com/articles/fetching-a-remote/#clone](https://help.github.com/articles/fetching-a-remote/#clone).  As an example, I have a folder on my laptop called `/home/krobinson/github`.  I'll open a terminal window, `cd` to that folder, and then run `git clone git@github.com:kevinrobinson/drexel-ui-programming.git`.  That will clone the repository from GitHub and put in in the `/home/krobinson/github/drexel-ui-programming` folder.

If you're unfamiliar with using the terminal and command line, check [this article](http://blog.teamtreehouse.com/introduction-to-the-mac-os-x-command-line) out to help you get started.

### Running the projects in this repository
Once you've cloned the repository, you'll also need to install [node.js](http://nodejs.org/) to run the minimal server on your local computer.

After that, you have everything you set up that you need to get started.  Open a terminal window in the folder where you cloned the repository.  And then `cd` into the folder you want to work with, e.g., `cd v5`.

From here, use these commands to get the project running:

```
# This will look at the project setup in `package.json` and download
# all the dependencies you need from the internet.
$ npm install

# Now you can start the server.  This will keep running the server
# program forver, so when you're done working you can press `ctrl+c`
# to stop the server.
$ node server.js

# Now, in a separate terminal window, run this command to watch all
# of the JavaScript files in the folder, and compile and re-package
# them into a single file whenever anything is saved.  It will also
# keep running forever, so when you're done working use `ctrl+c` to
# stop it.
# If you're curious, this works using [browserify](http://browserify.org/),
# [watchify](https://github.com/substack/watchify), and
# [jstify](https://github.com/zertosh/jstify).
$ npm run-script build
```

Now you're all ready to work!  Open `http://localhost:3055/index.html` in a web browser to see the project.  Note that the port number may be different for each project, check the port number that server output when you started it up.

### Troubleshooting
If you're using Windows, and `npm run-script build` fails with an error message like this:

```
`node_modules` is not recognized as an internal or external command.
```

This should get you going:
```
# Install the `watchify` package globally into your node.js setup
$ npm install -g watchify

# Use the globally installed `watchify` instead of the local one
$ npm run-script build-windows
```

### Web inspector
When developing in Chrome, Web Inspector is an incredibly useful tool.  See [https://developer.chrome.com/devtools](https://developer.chrome.com/devtools) for more information.  If you prefer Firefox or Safari, they have similar tools as well.

### Contact
- Email: krobinson@twitter.com
- Twitter: @krob

### Credits
Parts of this project are adapted from the awesome work by Romain Huet (@romainhuet) for Twitter Platform demos: https://github.com/romainhuet/twitter-platform-demos