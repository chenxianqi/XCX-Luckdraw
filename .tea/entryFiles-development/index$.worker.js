require('./config$');

function success() {
require('../..//app');
require('../..//pages/game/game');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
