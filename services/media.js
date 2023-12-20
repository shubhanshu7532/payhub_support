// // const path = require("path")
// // const fs = require("fs")



// async function saveMediaFile(file, type = "file", save_dir = "media") {
//     try {

//         /**
//          * check if type is file or url
//          * @todo: check if url is valid using regex
//          */
//         if (type !== "file" && type !== "url") throw new Error("Invalid file type")

//         /**
//          * check if file exists and is of type file
//          */
//         if (type === "file" && file?.type !== 'file') throw new Error("File not found")

//         /**
//          * initiate variables
//          */
//         let mime, file_size, name_wo_ext, file_ext, name_with_ext

//         /**
//          * Handle file buffer check, file extension check, file magic number check, file size check based on file type
//          */
//         if (type === "file") {
//             // extension check
//             if (!file.mimetype.startsWith("image") && !file.mimetype.startsWith("video")) throw new Error("Only images and videos are allowed")
//             // file magic number check
//             const bufferCheck = await fileTypeFromFile(file.filepath)
//             mime = bufferCheck?.mime // get mime type from buffer
//             if (!mime.startsWith("image") && !mime.startsWith("video")) throw new Error("You tried uploading a file that looks malicious. But good try.")

//             // check if file size is less than 128MB (file.bytesRead is the actual file size)
//             if (file.bytesRead > 128 * 1024 * 1024) throw new Error("File size should be less than 128MB")

//             // set file_size in MB from file.bytesRead, round off to 2 decimal places. if file size is 0, set it to 0.01
//             file_size = Math.round((file.bytesRead / 1024 / 1024) * 100) / 100 || 0.01

//             // get file extension
//             // file_ext = file.filename.split(".").pop()
//             file_ext = mime.split("/")[1]
//         }

//         /**
//          * Using nanoid to generate unique file name
//          */
//         name_wo_ext = nanoid()
//         // file.filename.split(".")[file.filename.split(".").length - 1] // last . is the file extension as some files may have multiple . in their name
//         name_with_ext = name_wo_ext + "." + file_ext // use nanoid to generate unique file name

//         /**
//          * Step 1. check if any folder exists in public/${save_dir}, if yes, get highest count folder else create folder 0001
//          */
//         const save_folder = path.join(__dirname, `../public/${save_dir}`)

//         // if save folder does not exist, create it
//         if (!await fs.exists(save_folder)) {
//             await fs.mkdir(save_folder, { mode: 0o744, recursive: true }) // make media folder and set folder permissions to 744
//         }
//         const folders_inside_save_folder = (await fs.readdir(save_folder)).filter((folder) => !isNaN(parseInt(folder))) // get all folders inside save_folder that are numbers
//         let highest_folder = 1
//         if (folders_inside_save_folder.length > 0) {
//             highest_folder = Math.max(...folders_inside_save_folder.map((folder) => parseInt(folder)))
//         } else {
//             await fs.mkdir(path.join(save_folder, "0001"), { mode: 0o744, recursive: true }) // make 0001 folder and set folder permissions to 744
//         }

//         let folder_name = (highest_folder).toString().padStart(4, "0")
//         let folder_path = path.join(save_folder, folder_name)

//         /**
//          * Step 2. check if folder has less than 1000 files, if yes, save file there else create new folder and save file there
//          */
//         const folder_files = await fs.readdir(folder_path)
//         if (folder_files.length >= 1000) {
//             folder_name = (highest_folder + 1).toString().padStart(4, "0")
//             folder_path = path.join(save_folder, folder_name);
//             await fs.mkdir(folder_path, { mode: 0o744, recursive: true }) // make new folder and set folder permissions to 744
//         }

//         /**
//          * Step 3. save file to disk. check if file name already exists, if yes, append nanoid to file name
//          */
//         let file_path = path.join(folder_path, name_with_ext).replace(/\\/g, "/") // replace backslash with forward slash for windows
//         if (await fs.exists(file_path)) {
//             name_with_ext = name_wo_ext + nanoid() + file_ext // if file exists, append nanoid to file name again
//             const new_file_path = path.join(folder_path, name_with_ext).replace(/\\/g, "/")
//             if (type === "file") await fs.copyFile(file.filepath, new_file_path) // if file, copy temp file to new file path
//             if (type === "url") await fs.writeFile(new_file_path, file.buffer) // if url, save buffer to new file path
//         } else {
//             if (type === "file") await fs.copyFile(file.filepath, file_path) // if file, copy temp file to file path
//             if (type === "url") await fs.writeFile(file_path, file.buffer) // if url, save buffer to file path
//         }
//         await fs.chmod(file_path, 0o744); // set file permissions to 744

//         /**
//          * Step 4. save file details to database
//          */
//         let data = {}
//         data.name = name_with_ext // nanoid() + "." + file_ext,
//         data.type = mime.split("/")[0] // image or video
//         data.ext = file_ext
//         data.url = `/public/${save_dir}/` + folder_name + "/" + name_with_ext
//         data.size = file_size
//         data.path = file_path
//         data.mime = mime
//         return data

//         const media = await Media.create(data)

//         /**
//          * Step 5. delete file from temp folder (automatically deleted by fastify-multipart)
//          */
//         // fs.unlink(file.filepath);

//         return media
//     } catch (error) {
//         logger.error(`media.service.saveMediaFile: ${error}`)
//         throw error
//     }
// }
// module.exports = saveMediaFile