document.addEventListener('DOMContentLoaded', init);

function init() {
  checkIfSerialFillerInstalled();
};

function checkIfSerialFillerInstalled() {
  setTimeout(() => {
    if (!document.getElementById('__SERIAL__FILLER__INSTALLED')) {
      document.getElementById('no-serial-filler').classList.remove('hidden');
    }
  }, 500);
};
