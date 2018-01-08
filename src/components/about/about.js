
export default {
  name: 'about',
  mounted() {
    $('#navMenu').hover(() => {
      if ($('.nav').hasClass('small')) {
        $('.nav').removeClass('small');
      }
    });
    $('#nav1').on('click', () => {
      if ($('#nav1').hasClass('active')) {
        $('#nav1').removeClass('active');
        $('#empathize').fadeOut();
      } else {
        $('#nav2').removeClass('active');
        $('#nav3').removeClass('active');
        $('#nav4').removeClass('active');
        $('#nav5').removeClass('active');
        $('#nav1').addClass('active');
        $('#ideate').fadeOut(0);
        $('#prototype').fadeOut(0);
        $('#tests').fadeOut(0);
        $('#implement').fadeOut(0);
        $('#empathize').fadeIn();
      }
    });
    $('#nav2').on('click', () => {
      if ($('#nav2').hasClass('active')) {
        $('#nav2').removeClass('active');
        $('#ideate').fadeOut();
      } else {
        $('#nav1').removeClass('active');
        $('#nav3').removeClass('active');
        $('#nav4').removeClass('active');
        $('#nav5').removeClass('active');
        $('#nav2').addClass('active');
        $('#empathize').fadeOut();
        $('#prototype').fadeOut();
        $('#tests').fadeOut();
        $('#implement').fadeOut();
        $('#ideate').fadeIn();
      }
    });
    $('#nav3').on('click', () => {
      if ($('#nav3').hasClass('active')) {
        $('#nav3').removeClass('active');
        $('#prototype').fadeOut();
      } else {
        $('#nav1').removeClass('active');
        $('#nav2').removeClass('active');
        $('#nav4').removeClass('active');
        $('#nav5').removeClass('active');
        $('#nav3').addClass('active');
        $('#empathize').fadeOut();
        $('#ideate').fadeOut();
        $('#tests').fadeOut();
        $('#implement').fadeOut();
        $('#prototype').fadeIn();
      }
    });
    $('#nav4').on('click', () => {
      if ($('#nav4').hasClass('active')) {
        $('#nav4').removeClass('active');
        $('#tests').fadeOut();
      } else {
        $('#nav1').removeClass('active');
        $('#nav2').removeClass('active');
        $('#nav3').removeClass('active');
        $('#nav5').removeClass('active');
        $('#nav4').addClass('active');
        $('#empathize').fadeOut();
        $('#ideate').fadeOut();
        $('#prototype').fadeOut();
        $('#implement').fadeOut();
        $('#tests').fadeIn();
      }
    });
    $('#nav5').on('click', () => {
      if ($('#nav5').hasClass('active')) {
        $('#nav5').removeClass('active');
        $('#implement').fadeOut();
      } else {
        $('#nav1').removeClass('active');
        $('#nav2').removeClass('active');
        $('#nav3').removeClass('active');
        $('#nav4').removeClass('active');
        $('#nav5').addClass('active');
        $('#empathize').fadeOut();
        $('#ideate').fadeOut();
        $('#prototype').fadeOut();
        $('#tests').fadeOut();
        $('#implement').fadeIn();
      }
    });
  },
};
