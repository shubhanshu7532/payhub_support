const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

const conn = mongoose.connection;
let gfs;

conn.once('open', () => {
    console.log('MongoDB connected');
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});

const uploadImageToGridFS = async (file, callback) => {
    const { originalname, mimetype, buffer } = file;

    const writestream = gfs.createWriteStream({
        filename: originalname,
        contentType: mimetype,
    });

    writestream.write(buffer);
    writestream.end();

    writestream.on('finish', () => {
        const imageUrl = `/files/${originalname}`;
        callback(null, imageUrl);
    });

    writestream.on('error', (err) => {
        console.error(err);
        callback(err, null);
    });
}

function getImageFromGridFS(filename, callback) {
    gfs.files.findOne({ filename }, (err, file) => {
        if (!file || file.length === 0) {
            callback({ error: 'File not found' }, null);
            return;
        }

        const readstream = gfs.createReadStream(file.filename);
        callback(null, readstream);
    });
}

module.exports = {
    uploadImageToGridFS,
    getImageFromGridFS,
};
