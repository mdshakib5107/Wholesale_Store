import { db } from './index';
export type DBTransaction = Parameters<Parameters<typeof db.transaction>[ 0 ]>[ 0 ]