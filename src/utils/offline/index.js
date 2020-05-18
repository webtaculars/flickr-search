import Realm from 'realm';
import { schema } from './schema';

export const saveToDB = async (searchTerm, result) => {
  let realm = await Realm.open({ schema: [schema] });
  realm.write(() => {
    realm.create(schema.name, {
      searchTerm: searchTerm,
      result: JSON.stringify(result),
    });
  });
};

export const readFromDB = async searchTerm => {
  let realm = await Realm.open({ schema: [schema] });
  let result = realm
    .objects(schema.name)
    .filtered(`searchTerm = "${searchTerm}"`);
  return result;
};
