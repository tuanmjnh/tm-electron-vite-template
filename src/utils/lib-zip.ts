const AdmZip = require("adm-zip")

export const zipExtracts = (filePath, password?) => {
  // reading archives
  const zip = new AdmZip(filePath)
  const zipEntries = password ? zip.getEntries(password) : zip.getEntries()// an array of ZipEntry records - add password parameter if entries are password protected

  zipEntries.forEach(function (zipEntry) {
    console.log(zipEntry.toString()) // outputs zip entries information
    if (zipEntry.entryName == "my_file.txt") {
      console.log(zipEntry.getData().toString("utf8"))
    }
  })
  // outputs the content of some_folder/my_file.txt
  console.log(zip.readAsText("some_folder/my_file.txt"))
  // extracts the specified file to the specified location
  zip.extractEntryTo(/*entry name*/ "some_folder/my_file.txt", /*target path*/ "/home/me/tempfolder", /*maintainEntryPath*/ false, /*overwrite*/ true)
  // extracts everything
  zip.extractAllTo(/*target path*/ "/home/me/zipcontent/", /*overwrite*/ true)
}
export const zipArchives = () => {
  // creating archives
  const zip = new AdmZip()

  // add file directly
  const content = "inner content of the file"
  zip.addFile("test.txt", Buffer.from(content, "utf8"), "entry comment goes here")
  // add local file
  zip.addLocalFile("/home/me/some_picture.png")
  // get everything as a buffer
  const willSendthis = zip.toBuffer()
  // or write everything to disk
  zip.writeZip(/*target file name*/ "/home/me/files.zip")
}
