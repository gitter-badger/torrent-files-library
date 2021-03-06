import test from 'ava';
import TorrentLibrary from '../../src/TorrentLibrary';
import { files, folders } from '../_constants';


// TESTS
test('result after scan()', async (t) => {
  let libInstance = new TorrentLibrary();
  await t.notThrows(libInstance.addNewPath(...folders));
  await t.notThrows(libInstance.scan());
  t.deepEqual(
    new Map([
      [files[2], TorrentLibrary.MOVIES_TYPE],
      [files[0], TorrentLibrary.TV_SERIES_TYPE],
      [files[1], TorrentLibrary.TV_SERIES_TYPE],
    ]),
    libInstance.allFilesWithCategory,
    'Not the same',
  );
});
