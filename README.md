# CSE 134B Website HW5

Akshat Jain's HTML portfolio website with CSS/JS, as a part of HW5 for CSE134B.

Intentionally chose a style where the text on the website is lowercase.

Big Changes:
- Added functionality to the contact form so that any form submitted gets added to a JSONBin bin that I have (ContactFormData). This includes a timestamp and any errors the user might have made before submitting the form.
  - See image in next page
- Any data loaded from remote also gets added to the local storage
  - Local storage acts as a cache now
  - For the future I can make it so that data is initially loaded from local
- Added functionality to the project-card to allow inputs for a small and big image
  - Added small and big versions of my project photos, allowing more functionality from the picture tag

Small Changes:
- Refactored project structure for readability
  - Moving JSONBin javascript files into services/
  - Deleted form-no-js.html
- Fixed the animation when hovering over a button in light theme
- Positioned the toggle theme button correctly (margin was initially incorrect since it was a button -> changed to span tags)
- Fixed the positioning of the cards on home page due to text wrapping (shortened caida text)
