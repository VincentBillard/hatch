var exec     = require('child_process').exec,
    path     = require('path'),
    fs       = require('fs'),
    mkdirp   = require('mkdirp'),
    readline = require('readline'),
    ncp      = require('ncp').ncp;

module.exports = function(opt) {

  var stages = ['production', 'pre-production'];
  var src_path = opt.src_path + '/';
  var now = new Date();
  var month = (now.getMonth() + 1);
  if (month < 10) {
    month = '0' + month;
  }
  var day = now.getDate();
  if (day < 10) {
    day = '0' + day;
  }
  var hours = now.getHours();
  if (hours < 10) {
    hours = '0' + hours;
  }
  var minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  var seconds = now.getSeconds();
  if (seconds < 10) {
    seconds = '0' + seconds;
  }
  var file_path = path.join(__dirname, '../../logs/' + opt.name + '-commits.txt');
  var args = process.argv.slice(2);
  var stage = "production";

  // stage
  if (args[0] && stages.indexOf(args[0]) != '-1') {
    stage = args[0];
  }

  // Ancien commit (présent sur le distant)
  var hash_from = null;
  if (args[1]) {
    hash_from = args[1];
  } else if (opt.commits && opt.commits.from) {
    hash_from = opt.commits.from;
  } else {
    console.log('Le hash du premier commit est manquant');
    return;
  }

  // Nouveau commit (le dernier commit pret à etre déployé)
  var hash_to = null;
  if (args[2]) {
    hash_to = args[2];
  } else if (opt.commits && opt.commits.to) {
    hash_to = opt.commits.to;
  } else {
    console.log('Le hash du dernier commit est manquant');
    return;
  }

  // Création du dossier principal (/dossier-de-deploiements/{date}/{stage})
  var deploy_path = opt.deploy_path + '/' + opt.name + '/' + now.getFullYear() + "-" + month + "-" + day + '_' + hours + "-" + minutes + "-" + seconds + '/';
  var stage_path = deploy_path + stage + '/';
  mkdirp(stage_path);
  mkdirp(path.join(__dirname, '../../logs/'));

  // Git - diff et préparation des fichiers par rapport à 2 commits
  var cmd = ' cd ' + src_path + ' && git diff --name-only --diff-filter=ACMR ' + hash_from + ' ' + hash_to + ' > ' + file_path;
  exec(cmd, function(error, stdout, stderr) {
     var rd = readline.createInterface({
        input: fs.createReadStream(file_path),
        output: process.stdout,
        terminal: false
    });
    rd.on('line', function(line) {
      var lineFilePath = path.join(src_path, line);
      var onlyPath = require('path').dirname(line);
      fs.exists(lineFilePath, function(exists) {
        if (exists) {
          console.log(stage_path + onlyPath);
          mkdirp(stage_path + onlyPath, function() {
            fs.createReadStream(lineFilePath).pipe(fs.createWriteStream(stage_path + line));
          });
        }
      });
    });
  });

  // Préparation des fichiers générés
  if (opt.generated_files) {
      opt.generated_files.forEach(function(generated_file) {
      var file_path = path.join(src_path, generated_file);
      fs.stat(file_path, function(err, stats) {
        if (stats.isFile() == true) {
          var onlyPath = require('path').dirname(generated_file);
          console.log(stage_path + onlyPath);
          mkdirp(stage_path + onlyPath, function() {
            fs.createReadStream(file_path).pipe(fs.createWriteStream(stage_path + generated_file));
          });
        } else if (stats.isDirectory()) {
          var dist_path = path.join(stage_path, generated_file);
          var onlyPath = require('path').dirname(generated_file);
          console.log(stage_path + onlyPath);
          mkdirp(stage_path + onlyPath, function() {
            ncp(file_path, dist_path);
          });
        }
      });
    });
  }

  // Création des dossiers de backup
  mkdirp(deploy_path + 'backup-' + stage);

};