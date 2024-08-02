var typed = new Typed(".text", {
    strings: ["CS Undergrad Student of RUET", "Competitive Programmer", "Cross Platform App Developer(Flutter)", "Frontend Web Developer"],
    typeSpeed: 100,
    backSpeed: 100,
    backDelay: 1000,
    loop: true,
});


let textEl = document.getElementById("jstext")

const text =`
I was born on 22 September 2002. 
Currently, I'm living in Rajshahi, Bangladesh.
My childhood was spent in a village.
I'm a foodie and my favorite food is "Kacci Biriyani", a beef item with rice.
My hobbies are cooking, listening to music, and reading adventurous stories.
I hope that's enough to know me.😊
`

function showText(){
    textEl.innerHTML = text
}

function hideText(){
    textEl.innerHTML = ""
}


const form = document.getElementById('myForm');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const data = new FormData(form);
    fetch('https://script.google.com/macros/s/AKfycbwc3niEvLO1Jua5jw7xdVGh1c_AgGk1lsQDU0NRw8NcW-WBny468T4JoHfgmKLa9NfC/exec', {
      method: 'POST',
      body: data
    })
    .then(response => response.text())
    .then(result => {
      alert('Form Submitted: ' + result);
      form.reset();
    })
    .catch(error => {
      console.error('Error:', error);
    });
  });