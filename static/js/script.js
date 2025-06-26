// // Actions:

// const closeButton = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
// <title>remove</title>
// <path d="M27.314 6.019l-1.333-1.333-9.98 9.981-9.981-9.981-1.333 1.333 9.981 9.981-9.981 9.98 1.333 1.333 9.981-9.98 9.98 9.98 1.333-1.333-9.98-9.98 9.98-9.981z"></path>
// </svg>
// `;
// const menuButton = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
// <title>ellipsis-horizontal</title>
// <path d="M16 7.843c-2.156 0-3.908-1.753-3.908-3.908s1.753-3.908 3.908-3.908c2.156 0 3.908 1.753 3.908 3.908s-1.753 3.908-3.908 3.908zM16 1.98c-1.077 0-1.954 0.877-1.954 1.954s0.877 1.954 1.954 1.954c1.077 0 1.954-0.877 1.954-1.954s-0.877-1.954-1.954-1.954z"></path>
// <path d="M16 19.908c-2.156 0-3.908-1.753-3.908-3.908s1.753-3.908 3.908-3.908c2.156 0 3.908 1.753 3.908 3.908s-1.753 3.908-3.908 3.908zM16 14.046c-1.077 0-1.954 0.877-1.954 1.954s0.877 1.954 1.954 1.954c1.077 0 1.954-0.877 1.954-1.954s-0.877-1.954-1.954-1.954z"></path>
// <path d="M16 31.974c-2.156 0-3.908-1.753-3.908-3.908s1.753-3.908 3.908-3.908c2.156 0 3.908 1.753 3.908 3.908s-1.753 3.908-3.908 3.908zM16 26.111c-1.077 0-1.954 0.877-1.954 1.954s0.877 1.954 1.954 1.954c1.077 0 1.954-0.877 1.954-1.954s-0.877-1.954-1.954-1.954z"></path>
// </svg>
// `;

// const actionButtons = document.querySelectorAll('.action-button');

// if (actionButtons) {
//   actionButtons.forEach(button => {
//     button.addEventListener('click', () => {
//       const buttonId = button.dataset.id;
//       let popup = document.querySelector(`.popup-${buttonId}`);
//       console.log(popup);
//       if (popup) {
//         button.innerHTML = menuButton;
//         return popup.remove();
//       }

//       const deleteUrl = button.dataset.deleteUrl;
//       const editUrl = button.dataset.editUrl;
//       button.innerHTML = closeButton;

//       popup = document.createElement('div');
//       popup.classList.add('popup');
//       popup.classList.add(`popup-${buttonId}`);
//       popup.innerHTML = `<a href="${editUrl}">Edit</a>
//       <form action="${deleteUrl}" method="delete">
//         <button type="submit">Delete</button>
//       </form>`;
//       button.insertAdjacentElement('afterend', popup);
//     });
//   });
// }

// Menu

const dropdownMenu = document.querySelector(".dropdown-menu");
const dropdownButton = document.querySelector(".dropdown-button");
const input__box = document.querySelector(".input__box");
const clip_button = document.querySelector(".clip__button")
if (dropdownButton) {
  dropdownButton.addEventListener("click", () => {
    dropdownMenu.classList.toggle("show");
  });
}

if (clip_button) {
  clip_button.addEventListener("click", () =>{
  input__box.classList.toggle('show_box')
  })
}

// Upload Image
const photoInput = document.querySelector("#avatar");
const photoPreview = document.querySelector("#preview-avatar");
if (photoInput)
  photoInput.onchange = () => {
    const [file] = photoInput.files;
    if (file) {
      photoPreview.src = URL.createObjectURL(file);
    }
  };

// Scroll to Bottom
const conversationThread = document.querySelector(".room__box");
if (conversationThread) conversationThread.scrollTop = conversationThread.scrollHeight;


//Upload File
// function openFileInput(type, roomId) {
//     const room_id = roomId.includes('/') ? roomId.split('/').filter(Boolean).pop() : roomId;
//     console.log('Extracted room_id:', room_id);

//     const fileInput = document.getElementById('file-input');
//     if (!fileInput) {
//         console.error('file-input element not found.');
//         return;
//     }

//     fileInput.accept = type === 'image' ? 'image/*' : '.pdf,.doc,.docx,.txt';

//     fileInput.onchange = function () {
//         const formData = new FormData();
//         formData.append('file', fileInput.files[0]); // Append file
//         if (room_id) {
//             formData.append('room_id', room_id); // Append room ID
//         } else {
//             alert('Room ID is missing.');
//             return;
//         }

//         uploadFile(formData); // Call upload function
//     };

//     fileInput.click();
// }
// function uploadFile(formData) {
//     fetch('/upload-file/', {
//         method: 'POST',
//         body: formData,
//         headers: {
//             'X-CSRFToken': getCsrfToken(),
//         },
//     })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }
//             return response.json();
//         })
//         .then(data => {
//             console.log('Server response:', data);
//             if (data.success) {
//                 fetchMessages(data.room_id); // Refresh messages if upload is successful
//             }
//         })
//         .catch(error => {
//             console.error('Error uploading file:', error);
//         });
// }

// function getCsrfToken() {
//     return document.querySelector('[name=csrfmiddlewaretoken]').value;
// }

async function fetchRoomContent(room_id) {
    try {
        const response = await fetch(`/room/${room_id}/`);
        if (!response.ok) throw new Error(`Failed to fetch room content. Status: ${response.status}`);

        const html = await response.text();

        // Parse the HTML response
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Extract the threads section
        const newThreads = doc.querySelector('.threads');
        const newParticipants = doc.querySelector('.participants__list');

        // Update the DOM
        const threadsContainer = document.querySelector('.threads');
        if (threadsContainer && newThreads) {
            threadsContainer.innerHTML = newThreads.innerHTML;
        }

        const participantsContainer = document.querySelector('.participants__list');
        if (participantsContainer && newParticipants) {
            participantsContainer.innerHTML = newParticipants.innerHTML;
        }
    } catch (error) {
        console.error('Error fetching room content:', error);
    }
}


//Upload File
function openFileInput(type, roomId) {
    const room_id = roomId.includes('/') ? roomId.split('/').filter(Boolean).pop() : roomId;
    console.log('Extracted room_id:', room_id);

    const fileInput = document.getElementById('file-input');
    if (!fileInput) {
        console.error('file-input element not found.');
        return;
    }

    fileInput.accept = type === 'image' ? 'image/*' : '.pdf,.doc,.docx,.txt';

    fileInput.onchange = function () {
        const formData = new FormData();
        formData.append('file', fileInput.files[0]); // Append file
        if (room_id) {
            formData.append('room_id', room_id); // Append room ID
        } else {
            alert('Room ID is missing.');
            return;
        }

        uploadFile(formData,room_id); // Call upload function
    };

    fileInput.click();
}
function uploadFile(formData,room_id) {
    fetch('/upload-file/', {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': getCsrfToken(),
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            // Refresh the room content after successful upload
            return fetchRoomContent(room_id);
        }).catch(error => {
            console.error('Error uploading file:', error);
        });
}


function getCsrfToken() {
    return document.querySelector('[name=csrfmiddlewaretoken]').value;
}
