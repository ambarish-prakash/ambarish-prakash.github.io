document.addEventListener("DOMContentLoaded", function() {
    const toggleButtons = document.querySelectorAll('.toggle_button');
    toggleButtons.forEach(button => {
      button.addEventListener('click', function() {
        const parentDiv = button.parentElement;
        const expItemsDiv = parentDiv.nextElementSibling;
        
        if (expItemsDiv.classList.contains('resume_hidden')) {
          // Show items
          expItemsDiv.classList.remove('resume_hidden');
          let content = button.textContent;
          button.textContent = content.replace('+', '-');
        } else {
          // Hide items
          expItemsDiv.classList.add('resume_hidden');
          let content = button.textContent;
          button.textContent = content.replace('-', '+');
        }
      });
    });
  });