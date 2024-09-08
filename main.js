var _a;
document.addEventListener('DOMContentLoaded', function () {
    var nameElement = document.getElementById('name');
    var emailElement = document.getElementById('email');
    var phoneElement = document.getElementById('phone');
    var educationElement = document.getElementById('education');
    var experienceElement = document.getElementById('experience');
    var skillsElement = document.getElementById('skills');
    var profileImageElement = document.getElementById('profile_image');
    nameElement.addEventListener('input', validateName);
    emailElement.addEventListener('input', validateEmail);
    phoneElement.addEventListener('input', validatePhone);
    educationElement.addEventListener('input', validateEducation);
    experienceElement.addEventListener('input', validateExperience);
    skillsElement.addEventListener('input', validateSkills);
    profileImageElement.addEventListener('change', handleImageUpload);
});
var uploadedImageSrc = '';
function handleImageUpload() {
    var _a;
    var file = (_a = document.getElementById('profile_image').files) === null || _a === void 0 ? void 0 : _a[0];
    var imageError = document.getElementById('image_error');
    if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var _a;
            if ((_a = e.target) === null || _a === void 0 ? void 0 : _a.result) {
                uploadedImageSrc = e.target.result;
                validateImage(); // Validate the image and update error message
                displayUploadedImage(); // Update the image preview
            }
        };
        reader.readAsDataURL(file);
    }
    else {
        uploadedImageSrc = '';
        validateImage(); // Validate the image and update error message
        displayUploadedImage(); // Update the image preview
    }
}
function displayUploadedImage() {
    var imagePreview = document.getElementById('image_preview');
    if (imagePreview) {
        imagePreview.src = uploadedImageSrc;
        imagePreview.style.display = uploadedImageSrc ? 'block' : 'none';
    }
}
(_a = document.getElementById('resume_form')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', function (event) {
    event.preventDefault();
    if (validateAll()) {
        var name_1 = document.getElementById('name').value;
        var email = document.getElementById('email').value;
        var phone = document.getElementById('phone').value;
        var education = document.getElementById('education').value;
        var experience = document.getElementById('experience').value;
        var skills = document.getElementById('skills').value;
        var downloadButton = document.createElement('button');
        downloadButton.textContent = 'Download Your Resume';
        downloadButton.style.display = 'block';
        downloadButton.style.marginTop = '20px';
        downloadButton.addEventListener('click', function () {
            var downloadLink = document.createElement('a');
            downloadLink.href = "data:text/html;charset=utf-8," + encodeURIComponent(resumeData_1);
            downloadLink.download = uniquePath_1;
            downloadLink.click(); // Programmatically trigger the download
        });
        var usernameElement = document.getElementById('username').value;
        var uniquePath_1 = "resume/".concat(usernameElement.replace(/\s+/g, ''), "_cv.html");
        var resumeData_1 = "\n        <h2>RESUME</h2>\n        <h2>Personal Information</h2>\n        ".concat(uploadedImageSrc ? "<p><img src=\"".concat(uploadedImageSrc, "\" alt=\"Profile Image\" style=\"width: 100px; height: 100px;\" id=\"resume_image\"></p>") : '', "\n        <p><strong>Name :</strong> ").concat(name_1, "</p>\n        <p><strong>Email :</strong> ").concat(email, "</p>\n        <p><strong>Phone Number :</strong> ").concat(phone, "</p>\n        <h2>Education</h2>\n        <p>").concat(education, "</p>\n        <h2>Experience</h2>\n        <p>").concat(experience, "</p>\n        <h2>Skills</h2>\n        <p>").concat(skills, "</p>\n        ");
        var resumeDataElement = document.getElementById('resume_data');
        if (resumeDataElement) {
            resumeDataElement.innerHTML = resumeData_1;
            resumeDataElement.style.display = 'block';
            addEditButton();
            resumeDataElement.appendChild(downloadButton);
        }
        var formElement = document.getElementById('resume_form');
        formElement.reset();
        uploadedImageSrc = '';
    }
});
function addEditButton() {
    var editButton = document.getElementById('edit_button');
    if (!editButton) {
        editButton = document.createElement('button');
        editButton.id = 'edit_button';
        editButton.textContent = 'Edit Resume';
        editButton.style.display = 'block';
        editButton.style.marginTop = '20px';
        var resumeContainer = document.getElementById('resume_data');
        if (resumeContainer) {
            resumeContainer.appendChild(editButton);
        }
        editButton.addEventListener('click', enableResumeEditing);
    }
}
function enableResumeEditing() {
    var _a;
    var resumeDataElement = document.getElementById('resume_data');
    if (resumeDataElement) {
        var resumeHtml = resumeDataElement.innerHTML;
        resumeDataElement.style.display = 'none';
        var nameElement = document.getElementById('name');
        var emailElement = document.getElementById('email');
        var phoneElement = document.getElementById('phone');
        var educationElement = document.getElementById('education');
        var experienceElement = document.getElementById('experience');
        var skillsElement = document.getElementById('skills');
        var urlElement = document.getElementById('username');
        nameElement.value = extractResumeData('Name', resumeHtml);
        emailElement.value = extractResumeData('Email', resumeHtml);
        phoneElement.value = extractResumeData('Phone Number', resumeHtml);
        educationElement.value = extractResumeData('Education', resumeHtml);
        experienceElement.value = extractResumeData('Experience', resumeHtml);
        skillsElement.value = extractResumeData('Skills', resumeHtml);
        var previousURL = extractResumeData('URL', resumeHtml); // Assuming 'URL' was saved as part of resume
        urlElement.value = previousURL;
        // Set the previous image if available
        var previousImageSrc = extractResumeImageSrc(resumeHtml);
        uploadedImageSrc = previousImageSrc;
        displayUploadedImage();
        (_a = document.getElementById('resume_form')) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: 'smooth' });
    }
}
function extractResumeData(label, html) {
    var regex;
    if (label === 'Education' || label === 'Experience' || label === 'Skills') {
        regex = new RegExp("<h2>".concat(label, "</h2>\\s*<p>([^<]+)</p>"));
    }
    else {
        regex = new RegExp("<p><strong>".concat(label, "\\s*:\\s*</strong>\\s*([^<]+)</p>"));
    }
    var match = html.match(regex);
    return match ? match[1].trim() : '';
}
function extractResumeImageSrc(html) {
    var regex = /<p><img src="([^"]+)" alt="Profile Image"/;
    var match = html.match(regex);
    return match ? match[1].trim() : '';
}
function validateAll() {
    var isNameValid = validateName();
    var isEmailValid = validateEmail();
    var isPhoneValid = validatePhone();
    var isEducationValid = validateEducation();
    var isExperienceValid = validateExperience();
    var isSkillsValid = validateSkills();
    var isImageValid = validateImage();
    var isUserURLValid = validateUserURL();
    return isNameValid && isEmailValid && isPhoneValid && isEducationValid && isExperienceValid && isSkillsValid && isImageValid && isUserURLValid;
}
// Validation functions
function validateName() {
    var nameElement = document.getElementById('name');
    var nameError = document.getElementById('name_error');
    var nameRegex = /^[a-zA-Z\s]+$/;
    if (nameElement.value.length === 0) {
        nameError.textContent = 'Please fill out this field.';
        return false;
    }
    else if (nameElement.value.length < 3 || nameElement.value.length > 12) {
        nameError.textContent = 'Name must be between 3 and 12 characters long.';
        return false;
    }
    else if (!nameRegex.test(nameElement.value)) {
        nameError.textContent = 'Invalid name. Only letters and spaces allowed.';
        return false;
    }
    else {
        nameError.textContent = '';
        return true;
    }
}
function validateEmail() {
    var emailElement = document.getElementById('email');
    var emailError = document.getElementById('email_error');
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailElement.value.length === 0) {
        emailError.textContent = 'Please fill out this field.';
        return false;
    }
    else if (!emailRegex.test(emailElement.value)) {
        emailError.textContent = 'Invalid email address.';
        return false;
    }
    else {
        emailError.textContent = '';
        return true;
    }
}
function validatePhone() {
    var phoneElement = document.getElementById('phone');
    var phoneError = document.getElementById('phone_error');
    var phoneRegex = /^\d{11}$/;
    if (phoneElement.value.length === 0) {
        phoneError.textContent = 'Please fill out this field.';
        return false;
    }
    else if (!phoneRegex.test(phoneElement.value)) {
        phoneError.textContent = 'Phone number must be exactly 11 digits.';
        return false;
    }
    else {
        phoneError.textContent = '';
        return true;
    }
}
function validateEducation() {
    var educationElement = document.getElementById('education');
    var educationError = document.getElementById('education_error');
    var requiredFieldRegex = /.+/;
    if (!requiredFieldRegex.test(educationElement.value)) {
        educationError.textContent = 'Please fill out this field.';
        return false;
    }
    else {
        educationError.textContent = '';
        return true;
    }
}
function validateExperience() {
    var experienceElement = document.getElementById('experience');
    var experienceError = document.getElementById('experience_error');
    var requiredFieldRegex = /.+/;
    if (!requiredFieldRegex.test(experienceElement.value)) {
        experienceError.textContent = 'Please fill out this field.';
        return false;
    }
    else {
        experienceError.textContent = '';
        return true;
    }
}
function validateSkills() {
    var skillsElement = document.getElementById('skills');
    var skillsError = document.getElementById('skills_error');
    var requiredFieldRegex = /.+/;
    if (!requiredFieldRegex.test(skillsElement.value)) {
        skillsError.textContent = 'Please fill out this field.';
        return false;
    }
    else {
        skillsError.textContent = '';
        return true;
    }
}
function validateImage() {
    var imageError = document.getElementById('image_error');
    if (!uploadedImageSrc) {
        imageError.textContent = 'Please upload an image.';
        return false;
    }
    else {
        imageError.textContent = ''; // Clear the error if the image is valid
        return true;
    }
}
function validateUserURL() {
    var nameElement = document.getElementById('username');
    var nameError = document.getElementById('urlname_error');
    var nameRegex = /^[a-z]+$/; // only lowercase letters, no spaces, no numbers
    // Check if the field is empty
    if (nameElement.value.length === 0) {
        nameError.textContent = 'Please fill out this field.';
        return false;
    }
    // Check if name contains capital letters, numbers, or spaces
    else if (!nameRegex.test(nameElement.value)) {
        nameError.textContent = 'Invalid name. Only lowercase letters allowed, no spaces or numbers.';
        return false;
    }
    // Check if the length is less than 3 or greater than 12 characters
    else if (nameElement.value.length < 3 || nameElement.value.length > 12) {
        nameError.textContent = 'Name must be between 3 and 12 characters long.';
        return false;
    }
    // If all validations pass
    else {
        nameError.textContent = '';
        return true;
    }
}
