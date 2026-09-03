function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    const headers = [
      "Timestamp",
      "Full Name",
      "School",
      "Email",
      "Grade",
      "Chosen Topic",
      "Article Title",
      "Article Pitch",
      "Article File",
      "Article Image",
    ];

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
    }

    let fileLink = "";
    if (data.file) {
      const folder = DriveApp.getFolderById(data.driveFolderId);
      const blob = Utilities.newBlob(
        Utilities.base64Decode(data.file.content),
        data.file.type,
        data.file.name
      );
      const uploadedFile = folder.createFile(blob);
      fileLink = uploadedFile.getUrl();
    }

    let imageLink = "";
    if (data.image) {
      const folder = DriveApp.getFolderById(data.driveFolderId);
      const links = [];
      const images = Array.isArray(data.image) ? data.image : [data.image];
      for (var i = 0; i < images.length; i++) {
        var img = images[i];
        var blob = Utilities.newBlob(
          Utilities.base64Decode(img.content),
          img.type,
          img.name
        );
        var uploadedImage = folder.createFile(blob);
        links.push(uploadedImage.getUrl());
      }
      imageLink = links.join(", ");
    }

    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.fullName || "",
      data.school || "",
      data.email || "",
      data.grade || "",
      data.topic || "",
      data.title || "",
      data.pitch || "",
      fileLink,
      imageLink,
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ success: true, fileLink: fileLink, imageLink: imageLink })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({ status: "ok", message: "YPWC Registration endpoint is active." })
  ).setMimeType(ContentService.MimeType.JSON);
}
