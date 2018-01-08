import 'vue-form-wizard/dist/vue-form-wizard.min.css';
import { FormWizard, TabContent } from 'vue-form-wizard';

export default {
  name: 'contact',
  mounted() {
    [].slice.call(document.querySelectorAll('input.input__field')).forEach((inputEl) => {
      function onInputFocus(ev) {
        // classie.add(ev.target.parentNode, 'input--filled');
        ev.target.parentNode.classList.add('input--filled');
      }

      function onInputBlur(ev) {
        if (ev.target.value.trim() === '') {
          // classie.remove(ev.target.parentNode, 'input--filled');
          ev.target.parentNode.classList.remove('input--filled');
        }
      }

      // in case the input is already filled..
      if (inputEl.value.trim() !== '') {
        // classie.add(inputEl.parentNode, 'input--filled');
        inputEl.parentNode.classList.add('input--filled');
      }

      // events:
      inputEl.addEventListener('focus', onInputFocus);
      inputEl.addEventListener('blur', onInputBlur);
    });
  },
  components: {
    FormWizard,
    TabContent,
  },
};
