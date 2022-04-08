var favorites = {
  extMan: null,
  fs: null,
  hdir: null,
  configdir: null,
  init: async function(extManager) {
    //
    // This function adds all the commands for working with favorites and 
    // setting up references to variables that are used.
    //
    favorites.extMan = extManager;
    favorites.fs = favorites.extMan.getLocalFS();
    favorites.hdir = await favorites.fs.getHomeDir();
    favorites.configdir = await favorites.extMan.getConfigDir();
    var addCommand = favorites.extMan.getCommands().addCommand;
    addCommand('Go to Favorite Directory', 'favorites.gotToFavorite', 'Open a list of favorite directories to jump to.', favorites.goToFavorite);
    addCommand('Make Favorite Directory', 'favorites.makeFavorite', 'Create a favorite directory.', favorites.makeFavorite);
    addCommand('Create Alias Directory', 'favorites.createAlias', 'Create a directory Alias', favorites.createAlias);
    addCommand('Delete Favorite Directory', 'favorites.deleteFavorite', 'Deletes a favorite directory assignment.', favorites.deleteFavorite);
    addCommand('Delete Directory Alias', 'favorites.deleteAlias', 'Deletes a favorite directory alias.', favorites.deleteAlias);
    addCommand('Backup One Directory', 'favorites.popDir1', 'Go back one directory.', () => {
      favorites.popDir(1);
    });
    addCommand('Backup Two Directory', 'favorites.popDir2', 'Go back one directories.', () => {
      favorites.popDir(2);
    });
    addCommand('Backup Three Directory', 'favorites.popDir3', 'Go back one directories.', () => {
      favorites.popDir(3);
    });
    addCommand('Backup Four Directory', 'favorites.popDir4', 'Go back one directories.', () => {
      favorites.popDir(4);
    });
    addCommand('Backup Five Directory', 'favorites.popDir5', 'Go back five directories.', () => {
      favorites.popDir(5);
    });
    addCommand('Save Directory to 1', 'favorites.saveDir1', 'Save to the first directory location.', () => {
      favorites.saveDir(1);
    });
    addCommand('Save Directory to 2', 'favorites.saveDir2', 'Save to the second directory location.', () => {
      favorites.saveDir(2);
    });
    addCommand('Save Directory to 3', 'favorites.saveDir3', 'Save to the third directory location.', () => {
      favorites.saveDir(3);
    });
    addCommand('Save Directory to 4', 'favorites.saveDir4', 'Save to the forth directory location.', () => {
      favorites.saveDir(4);
    });
    addCommand('Save Directory to 5', 'favorites.saveDir5', 'Save to the fifth directory location.', () => {
      favorites.saveDir(5);
    });
    addCommand('Go to Directory 1', 'favorites.saveDir1', 'Save to the first directory location.', () => {
      favorites.goToSavedDir(1);
    });
    addCommand('Go to Directory 2', 'favorites.saveDir2', 'Save to the second directory location.', () => {
      favorites.goToSavedDir(2);
    });
    addCommand('Go to Directory 3', 'favorites.saveDir3', 'Save to the third directory location.', () => {
      favorites.goToSavedDir(3);
    });
    addCommand('Go to Directory 4', 'favorites.saveDir4', 'Save to the forth directory location.', () => {
      favorites.goToSavedDir(4);
    });
    addCommand('Go to Directory 5', 'favorites.saveDir5', 'Save to the fifth directory location.', () => {
      favorites.goToSavedDir(5);
    });
    addCommand('Set Favorite Directory Mode', 'favorites.setFavMode', 'Set the current mode to Favorite Directory mode with abriviation of fav.', favorites.setFavMode);

    //
    // Add a listener for directory changes.
    //
    favorites.extMan.getExtCommand('addDirectoryListener').command(favorites.dirListener);
  },
  installKeyMaps: function() {
    var newKeyboard = favorites.extMan.getExtCommand('addKeyboardShort').command;
    favorites.extMan.getExtCommand('createNewMode').command('fav', 'blue');
    newKeyboard('normal', false, false, false, 'f', favorites.setFavMode);
    newKeyboard('fav', false, false, false, 'q', () => {
      favorites.goToSavedDir(1);
      favorites.extMan.getExtCommand('changeMode').command('normal');
    });
    newKeyboard('fav', false, false, false, 'w', () => {
      favorites.goToSavedDir(2);
      favorites.extMan.getExtCommand('changeMode').command('normal');
    });
    newKeyboard('fav', false, false, false, 'e', () => {
      favorites.goToSavedDir(3);
      favorites.extMan.getExtCommand('changeMode').command('normal');
    });
    newKeyboard('fav', false, false, false, 'r', () => {
      favorites.goToSavedDir(4);
      favorites.extMan.getExtCommand('changeMode').command('normal');
    });
    newKeyboard('fav', false, false, false, 't', () => {
      favorites.goToSavedDir(5);
      favorites.extMan.getExtCommand('changeMode').command('normal');
    });
    newKeyboard('fav', false, true, false, 'Q', () => {
      favorites.saveDir(1);
      favorites.extMan.getExtCommand('changeMode').command('normal');
    });
    newKeyboard('fav', false, true, false, 'W', () => {
      favorites.saveDir(2);
      favorites.extMan.getExtCommand('changeMode').command('normal');
    });
    newKeyboard('fav', false, true, false, 'E', () => {
      favorites.saveDir(3);
      favorites.extMan.getExtCommand('changeMode').command('normal');
    });
    newKeyboard('fav', false, true, false, 'R', () => {
      favorites.saveDir(4);
      favorites.extMan.getExtCommand('changeMode').command('normal');
    });
    newKeyboard('fav', false, true, false, 'T', () => {
      favorites.saveDir(5);
      favorites.extMan.getExtCommand('changeMode').command('normal');
    });
  },
  setFavMode: function() {
    favorites.extMan.getExtCommand('changeMode').command('fav');
  },
  dirRing: ['', '', '', '', '', '', '', '', '', ''],
  dirRingIndex: 0,
  dirListener: function(newPath, name) {
    if (!favorites.dirRing[favorites.dirRingIndex].includes(newPath)) {
      favorites.dirRingIndex = (favorites.dirRingIndex + 1) % favorites.dirRing.length;
      favorites.dirRing[favorites.dirRingIndex] = newPath;
    }
  },
  popDir: function(index) {
    var nInd = (favorites.dirRingIndex - (1 + index));
    if (nInd < 0) nInd = nInd + favorites.dirRing.length;
    favorites.extMan.getExtCommand('changeDir').command({
      path: favorites.dirRing[nInd]
    });
  },
  dirSaved: ['', '', '', '', ''],
  saveDir: function(inx) {
    //
    // Get the cursor
    //
    var cursor = favorites.extMan.getExtCommand('getCursor').command();

    //
    // Save the directory.
    //
    favorites.dirSaved[inx] = cursor.entry.dir;
  },
  goToSavedDir: function(inx) {
    if (favorites.dirSaved[inx] !== '') {
      favorites.extMan.getExtCommand('changeDir').command({
        path: favorites.dirSaved[inx]
      });
    }
  },
  getFavDirFile: async function() {
    var fdir = await favorites.fs.appendPath(favorites.configdir, '.favoritedirs');
    if (! await favorites.fs.dirExists(fdir)) {
      await favorites.fs.writeFile(fdir, "");
    }
    return (fdir);
  },
  getFavAliasFile: async function() {
    var adir = await favorites.fs.appendPath(favorites.configdir, '.shortenerdirs');
    if (! await favorites.fs.dirExists(adir)) {
      await favorites.fs.writeFile(adir, "");
    }
    return (adir);
  },
  getFavDir: async function(title, fdirs, returnFun) {
    var favs = await favorites.fs.readFile(fdirs);
    favs = new String(favs).split('\n');
    var dirs = [];
    favs.forEach(fav => {
      if (fav.includes('|')) {
        var part = fav.split('|');
        dirs.push({
          name: part[0],
          value: part[1]
        })
      }
    });
    if (dirs.length > 0) favorites.extMan.getExtCommand('pickItem').command(title, dirs, returnFun);
    else favorites.extMan.getExtCommand('showMessage').command('Favorites', 'Sorry, no favorites defined yet.');
  },
  clearEmpties: function(ar) {
    return ar.filter(it => it.includes('|'));
  },
  goToFavorite: async function() {
    var favdir = await favorites.getFavDirFile();
    favorites.getFavDir('Which Directory?', favdir, async (result) => {
      if(typeof result.value !== "undefined") result = result.value;
      var path = await favorites.fs.normalize(result);
      var match = path.match(/\{\{(.*)\}\}/);
      if (match !== null) {
        var alfile = await favorites.getFavAliasFile();
        var shortDirs = await favorites.fs.readFile(alfile);
        shortDirs = shortDirs.split('\n');
        var sdir = shortDirs.filter(el => {
          parts = el.split('|');
          return (parts[0].includes(match[1]))
        });
        path = await favorites.fs.appendPath(sdir[0].split('|')[1], path.slice(match[0].length + 1, path.length));
      }
      favorites.extMan.getExtCommand('changeDir').command({
        path: path
      });
    });
  },
  makeFavorite: async function() {
    //
    // Get the cursor
    //
    var cursor = favorites.extMan.getExtCommand('getCursor').command();
    favorites.extMan.getExtCommand('askQuestion').command('Favorite Directory', 'What do you want to name this Favorite Directory?', async (result) => {
      if(typeof result.value !== "undefined") result = result.value;
      var ndir = cursor.entry.dir.trim();
      //
      // Find all alias paths with an alias.
      //
      var alfile = await favorites.getFavAliasFile();
      var sdirs = await favorites.fs.readFile(alfile);
      sdirs = sdirs.split('\n');
      sdirs.forEach(el => {
        if (el.includes('|')) {
          var parts = el.split('|');
          if (ndir.includes(parts[1])) {
            ndir = ndir.replace(parts[1], '{{' + parts[0] + '}}');
          }
        }
      });

      //
      // Create and add the new favorite.
      //
      var line = result.trim() + '|' + ndir;
      var favdir = await favorites.getFavDirFile();
      var fdirs = await favorites.fs.readFile(favdir);
      fdirs = fdirs.split('\n');
      fdirs.push(line);
      fdirs = favorites.clearEmpties(fdirs);
      await favorites.fs.writeFile(favdir, fdirs.join('\n'));
    });
  },
  createAlias: async function() {
    //
    // Get the cursor
    //
    var cursor = favorites.extMan.getExtCommand('getCursor').command();
    favorites.extMan.getExtCommand('askQuestion').command('Favorite Directory', 'What do you want to name this Alias?', async (result) => {
      var ndir = cursor.entry.dir.trim();
      if(typeof result.value !== "undefined") result = result.value;

      //
      // Find all alias paths with an alias.
      //
      var alfile = await favorites.getFavAliasFile();
      var sdirs = await favorites.fs.readFile(alfile);
      sdirs = sdirs.split('\n');

      //
      // Create and add the new alias.
      //
      var line = result.trim() + '|' + ndir;
      sdirs.push(line);
      sdirs = favorites.clearEmpties(sdirs);
      await favorites.fs.writeFile(alfile, sdirs.join('\n'));
    });
  },
  deleteFavorite: async function() {
    var favdir = await favorites.getFavDirFile();
    favorites.getFavDir("Which Favorite to Delete?", favdir, async (result) => {
      if(typeof result.value !== "undefined") result = result.value;
      result = result.trim();
      var sdirs = await favorites.fs.readFile(favdir)
      sdirs = sdirs.split('\n');
      sdirs = sdirs.filter(item => !item.includes(result));
      await favorites.fs.writeFile(favdir, sdirs.join('\n'));
    });
  },
  deleteAlias: async function() {
    var alfile = await favorites.getFavDirFile();
    favorites.getFavDir("Which Alias to Delete?", alfile, async (result) => {
      if(typeof result.value !== "undefined") result = result.value;
      result = result.trim();
      var sdirs = await favorites.fs.readFile(alfile)
      sdirs = sdirs.split('\n');
      sdirs = sdirs.filter(item => !item.includes(result));
      await favorites.fs.writeFile(alfile, sdirs.join('\n'));
    });
  }
};
return (favorites);
