document.addEventListener('DOMContentLoaded', function () {
    const nameElement = document.getElementById('name') as HTMLInputElement;
    const emailElement = document.getElementById('email') as HTMLInputElement;
    const phoneElement = document.getElementById('phone') as HTMLInputElement;
    const educationElement = document.getElementById('education') as HTMLTextAreaElement;
    const experienceElement = document.getElementById('experience') as HTMLTextAreaElement;
    const skillsElement = document.getElementById('skills') as HTMLTextAreaElement;
    const profileImageElement = document.getElementById('profile_image') as HTMLInputElement;

    nameElement.addEventListener('input', validateName);
    emailElement.addEventListener('input', validateEmail);
    phoneElement.addEventListener('input', validatePhone);
    educationElement.addEventListener('input', validateEducation);
    experienceElement.addEventListener('input', validateExperience);
    skillsElement.addEventListener('input', validateSkills);
    profileImageElement.addEventListener('change', handleImageUpload);
});

let uploadedImageSrc: string = '';

function handleImageUpload(): void {
    const file = (document.getElementById('profile_image') as HTMLInputElement).files?.[0];
    const imageError = document.getElementById('image_error')!;

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e: ProgressEvent<FileReader>) {
            if (e.target?.result) {
                uploadedImageSrc = e.target.result as string;
                validateImage();  // Validate the image and update error message
                displayUploadedImage(); // Update the image preview
            }
        };
        reader.readAsDataURL(file);
    } else {
        uploadedImageSrc = '';
        validateImage();  // Validate the image and update error message
        displayUploadedImage(); // Update the image preview
    }
}

function displayUploadedImage(): void {
    const imagePreview = document.getElementById('image_preview') as HTMLImageElement;
    if (imagePreview) {
        imagePreview.src = uploadedImageSrc;
        imagePreview.style.display = uploadedImageSrc ? 'block' : 'none';
    }
}

document.getElementById('resume_form')?.addEventListener('submit', function (event) {
    event.preventDefault();

    if (validateAll()) {
        const name = (document.getElementById('name') as HTMLInputElement).value;
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const phone = (document.getElementById('phone') as HTMLInputElement).value;
        const education = (document.getElementById('education') as HTMLTextAreaElement).value;
        const experience = (document.getElementById('experience') as HTMLTextAreaElement).value;
        const skills = (document.getElementById('skills') as HTMLTextAreaElement).value;

        const downloadButton = document.createElement('button');
        downloadButton.textContent = 'Download Your Resume';
        downloadButton.style.display = 'block';
        downloadButton.style.marginTop = '20px';
        downloadButton.addEventListener('click', function () {
            const downloadLink = document.createElement('a');
            downloadLink.href = `data:text/html;charset=utf-8,` + encodeURIComponent(resumeData);
            downloadLink.download = uniquePath;
            downloadLink.click();  // Programmatically trigger the download
        });
        const usernameElement = (document.getElementById('username') as HTMLInputElement).value;

        const uniquePath = `resume/${usernameElement.replace(/\s+/g, '')}_cv.html`;


        const resumeData =
        `
        <h2>RESUME</h2>
        <h2>Personal Information</h2>
        <h1 style="display:none;"><p><strong>URL :</strong> ${usernameElement}</p> </h1>
        ${uploadedImageSrc ? `<p><img src="${uploadedImageSrc}" alt="Profile Image" style="width: 100px; height: 100px;" id="resume_image"></p>` : ''}
        <p><strong>Name :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Phone Number :</strong> ${phone}</p>
        <h2>Education</h2>
        <p>${education}</p>
        <h2>Experience</h2>
        <p>${experience}</p>
        <h2>Skills</h2>
        <p>${skills}</p>
        `;
    



        const resumeDataElement = document.getElementById('resume_data') as HTMLElement;
        if (resumeDataElement) {
            resumeDataElement.innerHTML = resumeData;
            resumeDataElement.style.display = 'block';
            addEditButton();

            resumeDataElement.appendChild(downloadButton);
        }

        const formElement = document.getElementById('resume_form') as HTMLFormElement;
        formElement.reset();
        uploadedImageSrc = '';
    }
});

function addEditButton(): void {
    let editButton = document.getElementById('edit_button') as HTMLButtonElement | null;

    if (!editButton) {
        editButton = document.createElement('button');
        editButton.id = 'edit_button';
        editButton.textContent = 'Edit Resume';
        editButton.style.display = 'block';
        editButton.style.marginTop = '20px';

        const resumeContainer = document.getElementById('resume_data');
        if (resumeContainer) {
            resumeContainer.appendChild(editButton);
        }

        editButton.addEventListener('click', enableResumeEditing);
    }
}

function enableResumeEditing(): void {
    const resumeDataElement = document.getElementById('resume_data') as HTMLElement;

    if (resumeDataElement) {
        const resumeHtml = resumeDataElement.innerHTML;

        resumeDataElement.style.display = 'none';

        const nameElement = document.getElementById('name') as HTMLInputElement;
        const emailElement = document.getElementById('email') as HTMLInputElement;
        const phoneElement = document.getElementById('phone') as HTMLInputElement;
        const educationElement = document.getElementById('education') as HTMLTextAreaElement;
        const experienceElement = document.getElementById('experience') as HTMLTextAreaElement;
        const skillsElement = document.getElementById('skills') as HTMLTextAreaElement;
        const usernameElement = document.getElementById('username') as HTMLInputElement;

        // Populate form fields with extracted data
        nameElement.value = extractResumeData('Name', resumeHtml);
        emailElement.value = extractResumeData('Email', resumeHtml);
        phoneElement.value = extractResumeData('Phone Number', resumeHtml);
        educationElement.value = extractResumeData('Education', resumeHtml);
        experienceElement.value = extractResumeData('Experience', resumeHtml);
        skillsElement.value = extractResumeData('Skills', resumeHtml);

        // Populate the usernameElement with the previously entered URL (username)
        const previousUsername = extractResumeData('URL', resumeHtml); 
        usernameElement.value = previousUsername;

        // Set the previous image if available
        const previousImageSrc = extractResumeImageSrc(resumeHtml);
        uploadedImageSrc = previousImageSrc;
        displayUploadedImage();

        // Scroll back to the form for editing
        document.getElementById('resume_form')?.scrollIntoView({ behavior: 'smooth' });
    }
}


function extractResumeData(label: string, html: string): string {
    let regex;

    if (label === 'Education' || label === 'Experience' || label === 'Skills') {
        regex = new RegExp(`<h2>${label}</h2>\\s*<p>([^<]+)</p>`);
    } else {
        regex = new RegExp(`<p><strong>${label}\\s*:\\s*</strong>\\s*([^<]+)</p>`);
    }

    const match = html.match(regex);
    return match ? match[1].trim() : '';
}

function extractResumeImageSrc(html: string): string {
    const regex = /<p><img src="([^"]+)" alt="Profile Image"/;
    const match = html.match(regex);
    return match ? match[1].trim() : '';
}

function validateAll() {
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isEducationValid = validateEducation();
    const isExperienceValid = validateExperience();
    const isSkillsValid = validateSkills();
    const isImageValid = validateImage();
    const isUserURLValid = validateUserURL();

    return isNameValid && isEmailValid && isPhoneValid && isEducationValid && isExperienceValid && isSkillsValid && isImageValid && isUserURLValid;
}

// Validation functions
function validateName() {
    const nameElement = document.getElementById('name') as HTMLInputElement;
    const nameError = document.getElementById('name_error')!;
    const nameRegex = /^[a-zA-Z\s]+$/;

    if (nameElement.value.length === 0) {
        nameError.textContent = 'Please fill out this field.';
        return false;
    } else if (nameElement.value.length < 3 || nameElement.value.length > 12) {
        nameError.textContent = 'Name must be between 3 and 12 characters long.';
        return false;
    } else if (!nameRegex.test(nameElement.value)) {
        nameError.textContent = 'Invalid name. Only letters and spaces allowed.';
        return false;
    } else {
        nameError.textContent = '';
        return true;
    }
}

function validateEmail() {
    const emailElement = document.getElementById('email') as HTMLInputElement;
    const emailError = document.getElementById('email_error')!;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailElement.value.length === 0) {
        emailError.textContent = 'Please fill out this field.';
        return false;
    } else if (!emailRegex.test(emailElement.value)) {
        emailError.textContent = 'Invalid email address.';
        return false;
    } else {
        emailError.textContent = '';
        return true;
    }
}

function validatePhone() {
    const phoneElement = document.getElementById('phone') as HTMLInputElement;
    const phoneError = document.getElementById('phone_error')!;
    const phoneRegex = /^\d{11}$/;

    if (phoneElement.value.length === 0) {
        phoneError.textContent = 'Please fill out this field.';
        return false;
    } else if (!phoneRegex.test(phoneElement.value)) {
        phoneError.textContent = 'Phone number must be exactly 11 digits.';
        return false;
    } else {
        phoneError.textContent = '';
        return true;
    }
}

function validateEducation() {
    const educationElement = document.getElementById('education') as HTMLTextAreaElement;
    const educationError = document.getElementById('education_error')!;
    const requiredFieldRegex = /.+/;

    if (!requiredFieldRegex.test(educationElement.value)) {
        educationError.textContent = 'Please fill out this field.';
        return false;
    } else {
        educationError.textContent = '';
        return true;
    }
}

function validateExperience() {
    const experienceElement = document.getElementById('experience') as HTMLTextAreaElement;
    const experienceError = document.getElementById('experience_error')!;
    const requiredFieldRegex = /.+/;

    if (!requiredFieldRegex.test(experienceElement.value)) {
        experienceError.textContent = 'Please fill out this field.';
        return false;
    } else {
        experienceError.textContent = '';
        return true;
    }
}

function validateSkills() {
    const skillsElement = document.getElementById('skills') as HTMLTextAreaElement;
    const skillsError = document.getElementById('skills_error')!;
    const requiredFieldRegex = /.+/;

    if (!requiredFieldRegex.test(skillsElement.value)) {
        skillsError.textContent = 'Please fill out this field.';
        return false;
    } else {
        skillsError.textContent = '';
        return true;
    }
}

function validateImage(): boolean {
    const imageError = document.getElementById('image_error')!;

    if (!uploadedImageSrc) {
        imageError.textContent = 'Please upload an image.';
        return false;
    } else {
        imageError.textContent = '';  // Clear the error if the image is valid
        return true;
    }
}

function validateUserURL() {
    const nameElement = document.getElementById('username') as HTMLInputElement;
    const nameError = document.getElementById('urlname_error')!;

    const nameRegex = /^[a-z]+$/; // only lowercase letters, no spaces, no numbers

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

