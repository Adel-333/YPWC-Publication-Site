function getDriveFolder(folderId) {
  if (folderId) {
    try {
      return DriveApp.getFolderById(folderId);
    } catch (e) {}
  }

  var cached = PropertiesService.getScriptProperties().getProperty("YPWC_FOLDER_ID");
  if (cached) {
    try {
      return DriveApp.getFolderById(cached);
    } catch (e) {}
  }

  var folder = DriveApp.createFolder("YPWC Submissions");
  PropertiesService.getScriptProperties().setProperty("YPWC_FOLDER_ID", folder.getId());
  return folder;
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getSubmissionsSheet();

    const headers = [
      "Timestamp",
      "Full Name",
      "School",
      "Email",
      "Grade",
      "Chosen Topic",
      "Article Title",
      "Article Pitch",
      "Source File Link",
      "Publication Rights",
      "Article File",
      "Article Image",
    ];

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
    }

    const folder = getDriveFolder(data.driveFolderId);

    let fileLink = "";
    if (data.file) {
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
      data.sourceLink || "",
      data.publicationRights ? "Yes" : "No",
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

const EXPECTED_HEADERS = [
  "Timestamp",
  "Full Name",
  "School",
  "Email",
  "Grade",
  "Chosen Topic",
  "Article Title",
  "Article Pitch",
  "Source File Link",
  "Publication Rights",
  "Article File",
  "Article Image",
];

const ADMIN_KEY = "ypwc-admin-2026-X7k2";

function ok(obj) {
  return ContentService.createTextOutput(
    JSON.stringify(Object.assign({ success: true }, obj))
  ).setMimeType(ContentService.MimeType.JSON);
}

function bad(obj) {
  return ContentService.createTextOutput(
    JSON.stringify(Object.assign({ success: false }, obj))
  ).setMimeType(ContentService.MimeType.JSON);
}

function getIdx(headers, name) {
  for (var i = 0; i < headers.length; i++) {
    if (String(headers[i]).trim() === name) return i;
  }
  return -1;
}

function getVal(src, headers, name) {
  var i = getIdx(headers, name);
  return i !== -1 && src[i] !== undefined ? src[i] : "";
}

const SUBMISSIONS_SHEET = "Registrations 2026";

function getSubmissionsSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SUBMISSIONS_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(SUBMISSIONS_SHEET);
    sheet.appendRow(EXPECTED_HEADERS.slice());
  }
  return sheet;
}

function migrateSheet() {
  var sheet = getSubmissionsSheet();
  var data = sheet.getDataRange().getValues();

  if (data.length && data[0][0] === EXPECTED_HEADERS[0] && data[0].length === EXPECTED_HEADERS.length) {
    return ok({ alreadyMigrated: true, keptRows: data.length - 1 });
  }

  var oldHeaders = data.length ? data[0] : [];
  var idx = {};
  for (var i = 0; i < EXPECTED_HEADERS.length; i++) idx[EXPECTED_HEADERS[i]] = i;

  var out = [EXPECTED_HEADERS.slice()];
  var deletedTests = 0;
  for (var r = 1; r < data.length; r++) {
    var src = data[r];
    if (src.length === 0) continue;
    var email = String(getVal(src, oldHeaders, "Email") || "");
    if (/^test/i.test(email.trim())) { deletedTests++; continue; }

    var row = [];
    for (var c = 0; c < EXPECTED_HEADERS.length; c++) row[c] = "";
    row[idx["Timestamp"]] = getVal(src, oldHeaders, "Timestamp");
    row[idx["Full Name"]] = getVal(src, oldHeaders, "Full Name");
    row[idx["School"]] = getVal(src, oldHeaders, "School");
    row[idx["Email"]] = getVal(src, oldHeaders, "Email");
    row[idx["Grade"]] = getVal(src, oldHeaders, "Grade");
    row[idx["Chosen Topic"]] = getVal(src, oldHeaders, "Chosen Topic");
    row[idx["Article Title"]] = getVal(src, oldHeaders, "Article Title");
    row[idx["Article Pitch"]] = getVal(src, oldHeaders, "Article Pitch");
    row[idx["Article File"]] = getVal(src, oldHeaders, "Article File");
    out.push(row);
  }

  sheet.clear({ contentsOnly: true });
  if (out.length) {
    sheet.getRange(1, 1, out.length, EXPECTED_HEADERS.length).setValues(out);
  }
  return ok({ migrated: true, keptRows: out.length - 1, deletedTests: deletedTests });
}

function sheetStatus() {
  var sheet = getSubmissionsSheet();
  var data = sheet.getDataRange().getValues();
  if (!data.length) return ok({ rows: 0, headers: [] });
  return ok({ rows: data.length - 1, headers: data[0], sampleEmails: data.slice(1, 6).map(function (r) { return r[3]; }) });
}

const SCRIPT_VERSION = "v3.1";

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || "";
  var key = (e && e.parameter && e.parameter.key) || "";

  if (key !== ADMIN_KEY) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "ok", version: SCRIPT_VERSION, message: "YPWC Registration endpoint is active." })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  if (action === "migrate_sheet") {
    return migrateSheet();
  }
  if (action === "sheet_status") {
    return sheetStatus();
  }
  return ok({ message: "Unknown action", version: SCRIPT_VERSION });
}
