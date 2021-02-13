


let btn1 = document.getElementById('btn1');
let btn2 = document.getElementById('btn2');
let btn3 = document.getElementById('btn3');
let instructor = document.getElementById('instructors');


    let Arr = ["The Game"];


btn1.addEventListener('click',()=>{
    
        localStorage.setItem("score",0);
        localStorage.setItem("life",3);
        localStorage.setItem("maxlevels",3);
        localStorage.setItem("level",1);
        localStorage.setItem("ballspeed",7);
        localStorage.setItem("blocks",JSON.stringify(Arr));



})

btn2.addEventListener("click",()=>{

    localStorage.setItem("score",localStorage.getItem("score"));
    localStorage.setItem("life",localStorage.getItem("life"));
    localStorage.setItem("maxlevels",localStorage.getItem("maxlevels"));
    localStorage.setItem("level",localStorage.getItem("level"));
    localStorage.setItem("ballspeed",localStorage.getItem("ballspeed"));
    localStorage.setItem("blocks",localStorage.getItem("blocks"));
    
})

btn3.addEventListener("click",()=>{

    instructor.style.display ="block"
})

instructor.addEventListener('click',()=>{
    instructor.style.display ="none"
})
instructor.addEventListener('mouseleave',()=>{
    instructor.style.display ="none"
})



