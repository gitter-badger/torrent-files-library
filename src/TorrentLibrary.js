// JSDoc custom typedef
/**
 * The result of parsing file name
 * @typedef {Object} TPN
 * @see {@link https://github.com/jy95/torrent-name-parser}
 * @property {(string)} title - The file title
 * @property {(number|undefined)} season - The season number
 * @property {(number|undefined)} episode - The episode number
 * @property {(string|undefined)} episodeName - The episode name
 * @property {(number|undefined)} year - The year
 * @property {(string|undefined)} resolution - The resolution
 * @property {(string|undefined)} quality - The quality
 * @property {(string|undefined)} codec - The codec
 * @property {(string|undefined)} audio - The audio
 * @property {(string|undefined)} group - The group that releases this file
 * @property {(string|undefined)} region - The quality
 * @property {(string|undefined)} extended - extended ?
 * @property {(string|undefined)} hardcoded - hardcoded ?
 * @property {(string|undefined)} proper - proper ?
 * @property {(string|undefined)} repack - repack ?
 * @property {(string|undefined)} container - The container
 * @property {(string|undefined)} website - The website that releases this file
 * @property {(string|undefined)} language - The file language
 * @property {(string|undefined)} excess - Unmatched text from filename
 */

/**
 * The extended TPN object
 * @typedef {TPN} TPN_Extended
 * @property {string} filePath - additionnal property useful for this library
 */

/**
 * The variable where we store all kind of media files found in paths
 * @typedef {Map.<string, {(TPN_Extended[]| Map.<string,TPN_Extended[]> )}>} StoreVar
 * @example
 * // An example of the variable after the scan method
 * [
 *      "MOVIES" : [
 *         {
 *            "year": 2014,
 *            "resolution": '1080p',
 *            "quality": 'BrRip',
 *            "codec": 'x264',
 *            "container": 'MKV',
 *            "title": 'Captain Russia The Summer Soldier',
 *            "filePath": "D:\somePath\Captain Russia The Summer Soldier (2014) 1080p BrRip x264.MKV"
 *         }
 *      ],
 *      "TV_SERIES" : [
 *          "The Blacklist" : [
 *              {
 *                  "season": 4,
 *                  "episode": 21,
 *                  "quality": "WEBRip",
 *                  "codec": "XviD",
 *                  "container": "avi",
 *                  "language": "FRENCH"
 *                  "filePath" : "D:\somePath\The.Blacklist.S04E21.FRENCH.WEBRip.XviD.avi"
 *              }
 *          ]
 *      ]
 * ]
 */


/**
 * module for exploring directories
 * @see {@link https://nspragg.github.io/filehound/}
 */
import FileHound  from 'filehound';

/**
 * module fs from node
 * @see {@link https://nodejs.org/api/fs.html}
 */
import {access} from 'fs';

/**
 * A promise object provided by the bluebird promise library.
 * @external Promise
 * @see {@link http://bluebirdjs.com/docs/api-reference.html}
 */
import PromiseLib from 'bluebird'

/**
 * List of video file extensions
 * @see {@link https://github.com/sindresorhus/video-extensions}
 */
import videosExtension from 'video-extensions';

import {
    EventEmitter
} from 'events';

/**
 * Class representing the TorrentLibrary
 * @extends EventEmitter
 * @see {@link https://nodejs.org/api/events.html#events_class_eventemitter } for further information.
 */
class TorrentLibrary extends EventEmitter {

    /**
     * constant for movie category
     * @since 0.0.0
     * @return {string}
     */
    static get MOVIES_TYPE() { return "MOVIES" }

    /**
     * constant for tv series category
     * @return {string}
     */
    static get TV_SERIES_TYPE() { return "TV_SERIES"}

    /**
     * Create a TorrentLibrary
     */
    constructor() {
        super();
        /**
         * just an easy way to scan the current directory path, if not other paths provided
         * @member  {string}
         * @default the directory from which you invoked the node command
         */
        this.defaultPath = process.cwd();
        /**
         * the paths where we are looking the media files
         * @member {String[]}
         * @default []
         * @example
         * // after have added some paths ...
         * [ "D:\somePath", "D:\anotherPath" ]
         */
        this.paths = [];
        /**
         * The variable where we store all kind of media files found in paths
         * @member {StoreVar}
         */
        this.stores = new Map([
            [ TorrentLibrary.MOVIES_TYPE , [] ],
            [ TorrentLibrary.TV_SERIES_TYPE, new Map()]
        ])
    }

    /**
     * Provides the array of files extensions considered to be media extensions
     * @return {string[]} array of files extensions
     * @since 0.0.0
     * @example
     * // Returns [..., 'webm', 'wmv']
     * TorrentLibrary.listVideosExtension()
     * @static
     */
    static listVideosExtension(){
        return videosExtension;
    }

    /**
     * Add the path(s) to be analyzed by the library if they exist and are readable
     * @param {(string|string[])} paths - A path or an array of paths
     * @since 0.0.0
     * @example
     * // return resolved Promise "All paths were added!"
     * TorrentLibraryInstance.addNewPath("C:\Users\jy95\Desktop\New folder");
     * @return {external:Promise}  On success the promise will be resolved with "All paths were added!"<br>
     * On error the promise will be rejected with an "Missing parameter" if the argument is missing<br>
     * or "Cannot find/read a path" if one of the provided paths doesn't exist or is not readable<br>
     */
    addNewPath(...paths){
        // the user should provide us at lest a path
        if (paths.length === 0)
            return missingParam();

        let that = this;
        return new PromiseLib(function (resolve,reject) {

            return new PromiseLib.map(paths, function (path) {
                // https://nodejs.org/api/fs.html#fs_fs_access_path_mode_callback
                // check if directory exists and is readable
                return access(path, fs.constants.F_OK | fs.constants.R_OK);
            }).then(function () {
                that.paths = [...that.paths, ...paths];
                resolve("All paths were added!");
            }).catch(e => {
                reject("Cannot find/read a path");
            })

        });

    }

    /**
     * Tell us if the user has provided us paths
     * @since 0.0.0
     * @returns {boolean}
     */
    hasPathsProvidedByUser(){
        return this.paths.length === 0;
    }

    /**
     * @todo Write the documentation.
     * @todo Implement this function.
     */
    scan(){
        /*
        const files = FileHound.create()
            .paths( (this.paths.length === 0) ? this.defaultPath : this.paths)
            .ext(videosExtension)
            .find();
        */
        return null;
    }

}

// rejected promise when someone doesn't provide
function missingParam() {
    return new PromiseLib(function (resolve,reject) {
       reject("Missing parameter");
    });
}

export default TorrentLibrary;