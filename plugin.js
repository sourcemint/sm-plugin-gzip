
const ZLIB = require("zlib");
const TAR = require("tar");


exports.for = function(API, plugin) {

    plugin.extract = function(fromPath, toPath, locator, options) {
        var deferred = API.Q.defer();
        // TODO: Use os command if available as it is much faster.
        var stream = API.FS.createReadStream(fromPath);
        stream.on("error", function(err) {
            deferred.reject(err);
        });
        var unzipper = ZLIB.createGunzip();
        unzipper.on("error", function(err) {
            deferred.reject(err);
        });
        var extracter = TAR.Extract({
            path: toPath,
            strip: 1
        });
        extracter.on("error", function(err) {
            deferred.reject(err);
        });
        extracter.on("end", function() {
            deferred.resolve(200);
        });
        stream.pipe(unzipper).pipe(extracter);
        return deferred.promise;
    };

}

