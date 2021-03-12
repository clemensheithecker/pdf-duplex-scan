// Get HTML elements
const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("fileInput");
const fileName = document.getElementById("fileName");

// Declare local variables for source PDF file
let sourcePdfBinary;
let sourcePdfName;

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

  // Get source PDF file name
  sourcePdfName = dataTransfer.files[0].name;

  // Set file name input to source PDF file name
  fileName.value = sourcePdfName;
});

// Open file selection dialog on dropzone click
dropzone.addEventListener("click", () => {
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

  // Get source PDF file name
  sourcePdfName = fileInput.files[0].name;

  // Set file name input to source PDF file name
  fileName.value = sourcePdfName;
});
