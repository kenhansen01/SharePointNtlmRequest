import * as gulp from 'gulp';
import * as util from 'gulp-util';
import * as runSequence from 'run-sequence';

import Login from './tools/tasks/sp.get_input';

gulp.task('signin', (done: any) => {
  Login(done);
});
