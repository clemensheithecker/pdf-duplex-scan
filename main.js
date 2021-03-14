import download from "downloadjs";
import { PDFDocument } from "pdf-lib";

// Get HTML elements
const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("fileInput");
const fileName = document.getElementById("fileName");
const form = document.getElementById("form");
const submit = document.getElementById("submit");

// Declare local variables for source PDF file
let sourcePdfBinary;
let pdfName;

dropzone.addEventListener("dragenter", (e) => {
  e.stopPropagation();
  e.preventDefault();

  // Add focus style on drag enter
  dropzone.classList.add(
    "bg-indigo-100",
    "ring-2",
    "ring-offset-2",
    "ring-indigo-500"
  );
});

dropzone.addEventListener("dragover", (e) => {
  e.stopPropagation();
  e.preventDefault();
});

dropzone.addEventListener("dragleave", () => {
  // Remove focus style on drag leave
  dropzone.classList.remove(
    "bg-indigo-100",
    "ring-2",
    "ring-offset-2",
    "ring-indigo-500"
  );
});

dropzone.addEventListener("drop", (e) => {
  e.stopPropagation();
  e.preventDefault();

  // Remove focus style on drop
  dropzone.classList.remove(
    "bg-indigo-100",
    "ring-2",
    "ring-offset-2",
    "ring-indigo-500"
  );

  // Set focus to dropzone
  fileName.focus();

  // Hold data that is dropped on dropzone
  const dataTransfer = e.dataTransfer;

  // Initialize file reader
  const fileReader = new FileReader();

  fileReader.onload = () => {
    // Get source PDF as binary
    sourcePdfBinary = fileReader.result;
  };

  // Read as binary file
  fileReader.readAsDataURL(dataTransfer.files[0]);

  // Get source PDF file name, remove file extension (.pdf) and any everything
  // but a word character, underscore, space, or minus (-)
  pdfName = dataTransfer.files[0].name
    .replace(".pdf", "")
    .replace(/[^\w -]/g, "")
    .trim();

  // Set file name input to source PDF file name
  fileName.value = pdfName;
});

// Open file selection dialog on dropzone click
dropzone.addEventListener("click", (e) => {
  e.preventDefault();

  fileInput.click();
});

fileInput.addEventListener("change", () => {
  // Initialize file reader
  const fileReader = new FileReader();

  fileReader.onload = () => {
    // Get source PDF as binary
    sourcePdfBinary = fileReader.result;
  };

  // Read as binary file
  fileReader.readAsDataURL(fileInput.files[0]);

  // Get source PDF file name, remove file extension (.pdf) and any everything
  // but a word character, underscore, space, or minus (-)
  pdfName = fileInput.files[0].name
    .replace(".pdf", "")
    .replace(/[^\w -]/g, "")
    .trim();

  // Set file name input to source PDF file name
  fileName.value = pdfName;
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Update source PDF file name
  pdfName = fileName.value;

  if (checkInputs()) {
    // Show success message and style on submit button
    submit.value = "Success!";
    submit.classList.remove(
      "bg-indigo-600",
      "bg-indigo-700",
      "hover:bg-indigo-700"
    );
    submit.classList.add("bg-green-600");

    // Disable inputs
    submit.disabled = true;
    dropzone.disabled = true;
    fileName.disabled = true;

    dropzone.classList.remove("hover:bg-indigo-100");

    createPdf();
  }
});

// Validate form
function checkInputs() {
  // Declare local error state to indicate if an error exists
  let isError;

  if (pdfName === "") {
    // Show error message and styles
    setErrorFor(fileName, "Please name the PDF file");

    // Update error state
    isError = true;
  } else if (!isFileName(pdfName)) {
    // Show error message and styles
    setErrorFor(
      fileName,
      "Please rename the PDF file containing only a word character, underscore, space, or minus (-)"
    );

    // Update error state
    isError = true;
  } else {
    // Remove potential error styles
    setSuccessFor(fileName);

    // Update error state
    isError = false;
  }

  if (sourcePdfBinary == null) {
    // Show error message and styles
    setErrorFor(dropzone, "Please select a PDF file");

    // Update error state
    isError = true;
  } else {
    // Remove potential error styles
    setSuccessFor(dropzone);

    // Set error state to false if no error already exists
    isError = isError !== true ? false : true;
  }

  // Return true if no error exists and false if an error exists
  return !isError;
}

function setErrorFor(input, message) {
  const inputParentElement = input.parentElement;
  const smallElement = inputParentElement.querySelector("small");

  // Add error message inside small element
  smallElement.innerText = message;

  // Add error styling
  input.classList.add("border-2", "border-red-500", "focus:border-red-500");
  smallElement.classList.remove("invisible");
}

function setSuccessFor(input) {
  const inputParentElement = input.parentElement;
  const smallElement = inputParentElement.querySelector("small");

  // Remove error styling
  input.classList.remove("border-2", "border-red-500", "focus:border-red-500");
  smallElement.classList.add("invisible");
}

function isFileName(fileName) {
  // Returns true if fileName consists only of a word character, underscore,
  // space, or minus (-)
  return /^[ \w\s-]+$/.test(fileName);
}

async function createPdf() {
  // Load source PDF as PDFDocument
  const sourcePdfDocument = await PDFDocument.load(sourcePdfBinary);

  // Create result PDF
  const resultPdfDocument = await rearrangePdf(sourcePdfDocument);

  // Serialize PDFDocument to bytes
  const resultPdfBinary = await resultPdfDocument.save();

  // Trigger browser to download PDF document
  download(resultPdfBinary, pdfName, "application/pdf");
}

async function rearrangePdf(sourcePdfDocument) {
  // Create new PDFDocument
  const outputPdfDocument = await PDFDocument.create();

  // Get number of pages from source PDF
  const pageCount = sourcePdfDocument.getPageCount();

  // Declare and set indices for odd and even pages from source PDF
  let oddPageIndex = 0;
  let evenPageIndex = pageCount - 1;

  for (let pageIndex = 0; pageIndex < pageCount; pageIndex++) {
    // Inset odd pages (even pageIndex)
    if (pageIndex % 2 === 0) {
      // Copy page from source PDF
      const [copiedPage] = await outputPdfDocument.copyPages(
        sourcePdfDocument,
        [oddPageIndex]
      );

      // Insert copied page into output PDF
      outputPdfDocument.insertPage(pageIndex, copiedPage);

      // Update odd index of source PDF
      oddPageIndex++;
    }

    // Inset even pages (odd pageIndex)
    else {
      // Copy page from source PDF
      const [copiedPage] = await outputPdfDocument.copyPages(
        sourcePdfDocument,
        [evenPageIndex]
      );

      // Insert copied page into output PDF
      outputPdfDocument.insertPage(pageIndex, copiedPage);

      // Update even index of source PDF
      evenPageIndex--;
    }
  }

  return outputPdfDocument;
}
