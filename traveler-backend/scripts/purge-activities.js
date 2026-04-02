const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Activity = require('../models/Activity');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const cascade = args.has('--cascade');

const ACTIVITY_FIELDS = ['activityId', 'activityIds', 'activities'];

const getFieldType = async (db, collectionName, field) => {
  const doc = await db.collection(collectionName).findOne(
    { [field]: { $exists: true } },
    { projection: { [field]: 1 } }
  );

  if (!doc || typeof doc[field] === 'undefined') {
    return null;
  }

  return Array.isArray(doc[field]) ? 'array' : 'scalar';
};

const cleanupField = async (db, collectionName, field, idCandidates, isDryRun) => {
  const fieldType = await getFieldType(db, collectionName, field);
  if (!fieldType) {
    return { field, fieldType: null, matched: 0, modified: 0 };
  }

  const filter = { [field]: { $in: idCandidates } };

  if (isDryRun) {
    const matched = await db.collection(collectionName).countDocuments(filter);
    return { field, fieldType, matched, modified: 0 };
  }

  if (fieldType === 'array') {
    const result = await db.collection(collectionName).updateMany(filter, {
      $pull: { [field]: { $in: idCandidates } }
    });
    return { field, fieldType, matched: result.matchedCount, modified: result.modifiedCount };
  }

  const result = await db.collection(collectionName).updateMany(filter, {
    $unset: { [field]: '' }
  });
  return { field, fieldType, matched: result.matchedCount, modified: result.modifiedCount };
};

const purgeActivities = async () => {
  await connectDB();

  const db = mongoose.connection.db;

  const activityDocs = await Activity.find({}, { _id: 1 }).lean();
  const activityIds = activityDocs.map((doc) => doc._id);

  if (activityIds.length === 0) {
    console.log('No activities found. Nothing to delete.');
    return;
  }

  const idCandidates = [...activityIds, ...activityIds.map((id) => id.toString())];

  console.log(`Activities found: ${activityIds.length}`);
  console.log(`Mode: ${dryRun ? 'dry-run' : 'delete'}`);
  console.log(`Cascade cleanup: ${cascade ? 'enabled' : 'disabled'}`);

  if (!dryRun) {
    const deleteResult = await Activity.deleteMany({});
    console.log(`Activities deleted: ${deleteResult.deletedCount}`);
  }

  if (cascade) {
    const collections = await db.listCollections({}, { nameOnly: true }).toArray();
    const userCollections = collections
      .map((col) => col.name)
      .filter((name) => !name.startsWith('system.'))
      .filter((name) => name !== 'activities');

    for (const collectionName of userCollections) {
      for (const field of ACTIVITY_FIELDS) {
        const result = await cleanupField(db, collectionName, field, idCandidates, dryRun);
        if (result.fieldType) {
          const action = dryRun ? 'matches' : 'updated';
          console.log(
            `${collectionName}.${field} (${result.fieldType}) ${action}: ${dryRun ? result.matched : result.modified}`
          );
        }
      }
    }
  }
};

purgeActivities()
  .catch((error) => {
    console.error('Purge failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
