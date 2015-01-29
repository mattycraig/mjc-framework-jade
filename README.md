# Getting Started

To get started, we need to install all dependencies for our new project:

```bash
npm install && bower install
```

Next, let's start our local webserver. Our watch task will compile all neseccary files when changed (Jade, SCSS, JS, etc):

```bash
grunt serve
```

Before we build our project, let's ensure our files are up to standards (optional):

```bash
grunt scsslint && grunt validation && grunt jshint
```

If this is a project that will be integrated into a CMS:

```bash
grunt build
```

If this is a project that will be a static flat site:

```bash
grunt build-nocms
```

## Useful Tasks

If this project requires responsive images, use the following grunt task which will produce resized images in the /images/resp/ folder.

```bash
grunt responsive_images
```
