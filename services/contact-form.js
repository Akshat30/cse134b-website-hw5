document.addEventListener('DOMContentLoaded', function () {
  let formErrors = [];
  // find all the inputs from the DOM
  const form = document.querySelector('form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const commentsInput = document.getElementById('comments');
  const nameError = document.getElementById('error');
  const submitButton = document.getElementById('submit-button');

  // find the maximum number of chars and current number of chars
  const infoNumOfChars = document.getElementById('info');
  const maxNumOfChars = commentsInput.getAttribute('maxlength');
  const formErrorsField = document.getElementById('form-errors');

  // this function adds the error to the list that gets submitted
  function addErrorToList(fieldName, message) {
    formErrors.push({
      fieldName,
      message,
    });
    formErrorsField.value = JSON.stringify(formErrors);
  }

  // gives an error message and logs it if the user puts in a character that does not match the pattern
  nameInput.addEventListener('input', function (event) {
    const validPattern = /^[A-Za-z ]*$/; // my pattern
    const inputValue = event.target.value;

    if (!validPattern.test(inputValue)) {
      event.target.value = inputValue.replace(/[^A-Za-z ]/g, ''); // disallow the weird char
      nameError.textContent = 'only letters/space allowed for name.';
      nameError.style.opacity = '1';
      nameInput.classList.add('error-flash');

      // add the error to the list that gets submitted
      addErrorToList('name', 'invalid char entered in the name field');

      // 3 second timer for the error message to fade away
      setTimeout(() => {
        nameError.style.opacity = '0';
        nameInput.classList.remove('error-flash');
      }, 3000);
    }
  });

  // this shows the current char count to the user
  commentsInput.addEventListener('input', function () {
    // calculate the remaining chars left
    let remainingChars = maxNumOfChars - commentsInput.value.length;
    infoNumOfChars.textContent = remainingChars + ' characters remaining';

    // i deemed that orange is good if they only have 25% (50 chars) char count lft
    if (remainingChars <= maxNumOfChars / 4) {
      infoNumOfChars.classList.add('warning');
    } else {
      infoNumOfChars.classList.remove('warning');
    }

    // i deemed that red is good if they only have 10% (20 chars) char count left, which is like 4 words
    if (remainingChars <= maxNumOfChars / 10) {
      infoNumOfChars.classList.add('critical');
      addErrorToList('comments', 'user got close to max character limit');
    } else {
      infoNumOfChars.classList.remove('critical');
    }
  });

  // adding other errors that might be caught when the user tries to submit
  submitButton.addEventListener('click', function () {
    // this is if user tries to submit an invalid email
    if (!emailInput.value.includes('@')) {
      addErrorToList('email', 'invalid email format');
    }
    // this is if user tries to submit a very short comment
    if (commentsInput.value.length < 5) {
      addErrorToList('comments', 'comment is too short');
    }

    // add to the field and submit if the user submits
    formErrorsField.value = JSON.stringify(formErrors);
  });

  // for my JSONBin that collects form responses
  CONTACT_FORM_API_URL = 'https://api.jsonbin.io/v3/b/67d774d18561e97a50ed5e92';
  MASTER_KEY = '$2a$10$Fal7pfgw.g7jQliyhlXkQO5nSq0bcTf7Z1sURFvsdtkuOIIo8Uxr.';

  // this function is to get the contents from JSONBin so that the new entry can be added
  async function fetchOldContactSubmissions() {
    try {
      // typical GET, with master key since JSONBin requires
      const response = await fetch(CONTACT_FORM_API_URL, {
        method: 'GET',
        headers: {
          'X-Master-Key': MASTER_KEY,
        },
      });

      const responseData = await response.json();
      return responseData.record;
    } catch (e) {
      console.error('error: ', e);
      return [];
    }
  }

  // this is there to send the data back to JSONBin if user submits
  form.addEventListener('submit', async function (event) {
    event.preventDefault(); // stop any other submit behavior

    // format the data and put into object
    const formDataSubmit = {
      timestamp: new Date().toISOString(), // adding a formatted timestap so i can see when this form was sent
      name: nameInput.value,
      email: emailInput.value,
      comments: commentsInput.value,
      errors: formErrors,
    };

    try {
      const updatedEntries = await fetchOldContactSubmissions(); // fetch the old submissions first
      updatedEntries.push(formDataSubmit); // add the new data to the old entries

      // send updated set of submissions back to JSONBinnnnnn using a PUT to overwrite
      const response = await fetch(CONTACT_FORM_API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': MASTER_KEY,
        },
        body: JSON.stringify(updatedEntries),
      });

      // let user know if submitted correctly
      if (response.ok) {
        alert('🎉 submitted successfully!');

        // reset the form and char count!
        form.reset();
        infoNumOfChars.textContent = maxNumOfChars + ' characters remaining';
      } else {
        // alert the user if it bad response
        alert('⚠️ form did not submit correctly, try again.');
      }
    } catch (error) {
      console.error('error:', error);
      alert('⚠️ form did not submit correctly, try again.'); // alert user if it failed
    }
  });
});
