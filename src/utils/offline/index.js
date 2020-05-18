import Realm from 'realm';
import UUIDGenerator from 'react-native-uuid-generator';
import { schema } from './schema';

export const saveToDB = async (searchTerm, result) => {
  let realm = await Realm.open({ schema: [schema] });
  let data = realm
    .objects(schema.name)
    .filtered(`searchTerm = "${searchTerm}"`);

  if (data && data.length > 0) {
    realm.write(async () => {
      realm.create(
        schema.name,
        {
          uuid: data[0].uuid,
          searchTerm: searchTerm,
          result: JSON.stringify(result),
        },
        true,
      );
    });
  } else {
    let uuid = await UUIDGenerator.getRandomUUID();
    realm.write(async () => {
      realm.create(schema.name, {
        uuid: uuid,
        searchTerm: searchTerm,
        result: JSON.stringify(result),
      });
    });
  }
};

export const readFromDB = async searchTerm => {
  let realm = await Realm.open({ schema: [schema] });
  let result = realm
    .objects(schema.name)
    .filtered(`searchTerm = "${searchTerm}"`);
  return result;
};
