
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
  var commandOptions;

  commandOptions = require('./command-options');

  exports.create = {
    signature: 'app create <name>',
    description: 'create an application',
    help: 'Use this command to create a new resin.io application.\n\nYou can specify the application type with the `--type` option.\nOtherwise, an interactive dropdown will be shown for you to select from.\n\nYou can see a list of supported device types with\n\n	$ resin devices supported\n\nExamples:\n\n	$ resin app create MyApp\n	$ resin app create MyApp --type raspberry-pi',
    options: [
      {
        signature: 'type',
        parameter: 'type',
        description: 'application type',
        alias: 't'
      }
    ],
    permission: 'user',
    primary: true,
    action: function(params, options, done) {
      var patterns, resin;
      resin = require('resin-sdk');
      patterns = require('../utils/patterns');
      return resin.models.application.has(params.name).then(function(hasApplication) {
        if (hasApplication) {
          throw new Error('You already have an application with that name!');
        }
      }).then(function() {
        return options.type || patterns.selectDeviceType();
      }).then(function(deviceType) {
        return resin.models.application.create(params.name, deviceType);
      }).then(function(application) {
        return console.info("Application created: " + application.app_name + " (" + application.device_type + ", id " + application.id + ")");
      }).nodeify(done);
    }
  };

  exports.list = {
    signature: 'apps',
    description: 'list all applications',
    help: 'Use this command to list all your applications.\n\nNotice this command only shows the most important bits of information for each app.\nIf you want detailed information, use resin app <name> instead.\n\nExamples:\n\n	$ resin apps',
    permission: 'user',
    primary: true,
    action: function(params, options, done) {
      var resin, visuals;
      resin = require('resin-sdk');
      visuals = require('resin-cli-visuals');
      return resin.models.application.getAll().then(function(applications) {
        return console.log(visuals.table.horizontal(applications, ['id', 'app_name', 'device_type', 'online_devices', 'devices_length']));
      }).nodeify(done);
    }
  };

  exports.info = {
    signature: 'app <name>',
    description: 'list a single application',
    help: 'Use this command to show detailed information for a single application.\n\nExamples:\n\n	$ resin app MyApp',
    permission: 'user',
    primary: true,
    action: function(params, options, done) {
      var resin, visuals;
      resin = require('resin-sdk');
      visuals = require('resin-cli-visuals');
      return resin.models.application.get(params.name).then(function(application) {
        return console.log(visuals.table.vertical(application, ["$" + application.app_name + "$", 'id', 'device_type', 'git_repository', 'commit']));
      }).nodeify(done);
    }
  };

  exports.restart = {
    signature: 'app restart <name>',
    description: 'restart an application',
    help: 'Use this command to restart all devices that belongs to a certain application.\n\nExamples:\n\n	$ resin app restart MyApp',
    permission: 'user',
    action: function(params, options, done) {
      var resin;
      resin = require('resin-sdk');
      return resin.models.application.restart(params.name).nodeify(done);
    }
  };

  exports.remove = {
    signature: 'app rm <name>',
    description: 'remove an application',
    help: 'Use this command to remove a resin.io application.\n\nNotice this command asks for confirmation interactively.\nYou can avoid this by passing the `--yes` boolean option.\n\nExamples:\n\n	$ resin app rm MyApp\n	$ resin app rm MyApp --yes',
    options: [commandOptions.yes],
    permission: 'user',
    action: function(params, options, done) {
      var patterns, resin;
      resin = require('resin-sdk');
      patterns = require('../utils/patterns');
      return patterns.confirm(options.yes, 'Are you sure you want to delete the application?').then(function() {
        return resin.models.application.remove(params.name);
      }).nodeify(done);
    }
  };

}).call(this);
