export default {
  name: 'Home',
  data() {
    return {
      msg: 'Agile Shift',
    };
  },
  mounted() {
    const menu = document.getElementById('menu');
    console.log(menu);
    menu.style.height = '100%';
    function openNav() {
      menu.style.height = '100%';
    }
    function closeNav() {
      menu.style.height = '0%';
    }
    let count = 0;
    const imgButton = document.getElementById('logo');
    const menuBackground = document.getElementById('menu-background');
    $('#menu-button').on('click', () => {
      if (count === 0) {
        openNav();
        imgButton.src = 'src/assets/agile-logo.png';
        menuBackground.classList.remove('show');
        count += 1;
      } else {
        closeNav();
        imgButton.src = 'src/assets/agile-logo-black.png';
        menuBackground.classList.add('show');
        count = 0;
      }
    });
    $('.history-link').on('click', () => {
      closeNav();
      imgButton.src = 'src/assets/agile-logo-black.png';
      menuBackground.classList.add('show');
    });
  },
};
