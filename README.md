#gulp-config

## Deployment

To deploy your page to gh-pages, using created gulpfile.js, follow the instructions below.
Make sure node_modules is listed in .gitignore:

```sh
node_modules/
```

So you won’t accidentally push all of your sites Node depedencies. You can add your "dist/" folder too:

```sh
node_modules/
dist/
.publish/
```

When you’re ready to deploy, push the latest changes to your repo to Github.

```she
git add . # Add any untracked files
git commit -va # Commit the changes
git push # Push it to Github
```

You’ll also need to create a gh-pages branch, if you don’t already.

```she
git checkout --orphan gh-pages
git rm -rf . # Be careful when using git rm -rf .
touch README.md
git add README.md
git commit -m "Init gh-pages"
git push --set-upstream origin gh-pages
git checkout master
```

So, you have this deploy task:

```javascript
var gulp = require('gulp');
var ghPages = require('gulp-gh-pages');

gulp.task('deploy', function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});
```

Now you just need to run it.

```she
gulp deploy
```
