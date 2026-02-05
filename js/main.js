const burgerBtn = document.getElementById('burger-btn');
const burgerMenu = document.getElementById('burger-menu');

burgerBtn.addEventListener('click', () => {
  burgerMenu.hasAttribute('hidden') 
    ? burgerMenu.removeAttribute('hidden')
    : burgerMenu.setAttribute('hidden', '');
});




// Toggle voor contactmenu
document.addEventListener('DOMContentLoaded', function() {
	const openBtn = document.getElementById('open-contact');
	const contactMenu = document.getElementById('contact-menu');

	if (openBtn && contactMenu) {
		openBtn.addEventListener('click', () => {
			const isHidden = contactMenu.hasAttribute('hidden');
			if (isHidden) {
				contactMenu.removeAttribute('hidden');
				openBtn.textContent = 'Sluit contact';
			} else {
				contactMenu.setAttribute('hidden', '');
				openBtn.textContent = 'Contact';
			}
		});
	}

	// Toggle voor media menu
	const mediaBtn = document.getElementById('open-media');
	const mediaMenu = document.getElementById('media-menu');

	if (mediaBtn && mediaMenu) {
		mediaBtn.addEventListener('click', () => {
			const isHidden = mediaMenu.hasAttribute('hidden');
			if (isHidden) {
				mediaMenu.removeAttribute('hidden');
				mediaBtn.textContent = 'Sluit media';
			} else {
				mediaMenu.setAttribute('hidden', '');
				mediaBtn.textContent = 'Social Media';
			}
		});
	}

	// Toggle voor disclaimer menu
	const disclaimerBtn = document.getElementById('open-dissclaimer');
	const disclaimerMenu = document.getElementById('dissclaimer-menu');

	if (disclaimerBtn && disclaimerMenu) {
		disclaimerBtn.addEventListener('click', () => {
			const isHidden = disclaimerMenu.hasAttribute('hidden');
			if (isHidden) {
				disclaimerMenu.removeAttribute('hidden');
				disclaimerBtn.textContent = 'Sluit disclaimer';
			} else {
				disclaimerMenu.setAttribute('hidden', '');
				disclaimerBtn.textContent = 'Dissclaimer';
			}
		});
	}

	// Sluit menu's wanneer gebruiker buiten klikt
	document.addEventListener('click', (e) => {
		if (contactMenu && !contactMenu.contains(e.target) && e.target !== openBtn) {
			contactMenu.setAttribute('hidden', '');
			if (openBtn) openBtn.textContent = 'Contact';
		}
		if (mediaMenu && !mediaMenu.contains(e.target) && e.target !== mediaBtn) {
			mediaMenu.setAttribute('hidden', '');
			if (mediaBtn) mediaBtn.textContent = 'Social Media';
		}
		if (disclaimerMenu && !disclaimerMenu.contains(e.target) && e.target !== disclaimerBtn) {
			disclaimerMenu.setAttribute('hidden', '');
			if (disclaimerBtn) disclaimerBtn.textContent = 'Dissclaimer';
		}
	});
});


