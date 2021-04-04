const Firestore = require('@google-cloud/firestore');
const PROJECTID = 'shan-scholarship-cfunc-poc';
const COLLECTION_NAME = 'applications';
const firestore = new Firestore({
  projectId: PROJECTID,
  timestampsInSnapshots: true,
});

exports.processApplicaiton = (req, res) => {
  if (req.method === 'DELETE') throw 'Delete is not available in current version!';
  if (req.method === 'POST') {
    // store/insert a new document
    const data = (req.body) || {};
    const studentId = Number.parseInt(data.studentId);
    const scholarship = (data.scholarship || '');
    const created = new Date().getTime();
    return firestore.collection(COLLECTION_NAME)
      .add({ created, studentId, scholarship })
      .then(doc => {
        return res.status(200).send(doc);
      }).catch(err => {
        console.error(err);
        return res.status(404).send({ error: 'unable to store', err });
      });
  }
  // read/retrieve an existing document by id
  if (!(req.query && req.query.id)) {
    return res.status(404).send({ error: 'No Id' });
  }
  const id = req.query.id.replace(/[^a-zA-Z0-9]/g, '').trim();
  if (!(id && id.length)) {
    return res.status(404).send({ error: 'Empty Id' });
  }
  return firestore.collection(COLLECTION_NAME)
    .doc(id)
    .get()
    .then(doc => {
      if (!(doc && doc.exists)) {
        return res.status(404).send({ error: 'Unable to find the document' });
      }
      const data = doc.data();
      return res.status(200).send(data);
    }).catch(err => {
      console.error(err);
      return res.status(404).send({ error: 'Unable to retrieve the document' });
    });
};