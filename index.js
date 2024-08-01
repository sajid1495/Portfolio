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
