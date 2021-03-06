
/*
Copyright 2016 Resin.io

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 */

(function() {
  exports.set = {
    signature: 'note <|note>',
    description: 'set a device note',
    help: 'Use this command to set or update a device note.\n\nIf note command isn\'t passed, the tool attempts to read from `stdin`.\n\nTo view the notes, use $ resin device <uuid>.\n\nExamples:\n\n	$ resin note "My useful note" --device 7cf02a6\n	$ cat note.txt | resin note --device 7cf02a6',
    options: [
      {
        signature: 'device',
        parameter: 'device',
        description: 'device uuid',
        alias: ['d', 'dev'],
        required: 'You have to specify a device'
      }
    ],
    permission: 'user',
    action: function(params, options, done) {
      var Promise, _, resin;
      Promise = require('bluebird');
      _ = require('lodash');
      resin = require('resin-sdk');
      return Promise["try"](function() {
        if (_.isEmpty(params.note)) {
          throw new Error('Missing note content');
        }
        return resin.models.device.note(options.device, params.note);
      }).nodeify(done);
    }
  };

}).call(this);
