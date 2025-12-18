document.addEventListener('DOMContentLoaded', () => {
    const burgerMenu = document.querySelector('.burger-menu');
    const navList = document.querySelector('.nav-list');
    const navOverlay = document.querySelector('.nav-overlay');

    if (burgerMenu && navList) {
        burgerMenu.addEventListener('click', () => {
            burgerMenu.classList.toggle('active');
            navList.classList.toggle('active');
            if (navOverlay) {
                navOverlay.classList.toggle('active');
            }
        });

        if (navOverlay) {
            navOverlay.addEventListener('click', () => {
                burgerMenu.classList.remove('active');
                navList.classList.remove('active');
                navOverlay.classList.remove('active');
            });
        }

        navList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                burgerMenu.classList.remove('active');
                navList.classList.remove('active');
                if (navOverlay) {
                    navOverlay.classList.remove('active');
                }
            });
        });
    }
});
