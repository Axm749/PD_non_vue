let inp = document.querySelector("#inp");
let start2 = document.getElementById("start2");

start2.onclick = function(){
    let voultage = document.getElementById("voultage").value;
    let capacity2 = document.getElementById("capacity").value;
    let battaries = document.getElementById("batteries").value;
    let kpd = document.getElementById("kpd").value;
    let powerval = 0;

    options(powerval, voultage, capacity2, battaries, kpd);
    console.log("i'm here")
}
//Старт

let options = (powerval, voultage, capacity2, battaries, kpd)=>{
    let cont2=document.getElementById("cont2")
            cont2.innerHTML=`
            <p> <strong> Вывод для раздела электропитания </strong></p>
            `
    
    if(inp.checked){
        powerval = document.getElementById("power").value;
    let result = voultage*capacity2*battaries*kpd*0.85/powerval;
    console.log("Время работы устройства:   ", result, " ч");
    output2(result);
    }else if(konverg.checked){
    powerval = start1()
    let result = voultage*capacity2*battaries*kpd*0.85/powerval;
    console.log("Время работы устройства:   ", result, " ч");
    output2(result);
    }else {
    powerval = start1()
    let result = voultage*capacity2*battaries*kpd*0.85/powerval;
    console.log("Время работы устройства:   ", result, " ч");
    output2(result);     
    }
}
// расчёт по формуле

let output2 = (result)=>{
    cont2=document.getElementById("cont2")
    cont2.innerHTML+=`
    <p>Время работы устройства от батарей: ${result} часов</p>
    `
}
// Вывод результата

inp.addEventListener("change", function(){
    if(inp.checked){
        power2.disabled = false;
        }else {
        power2.disabled = true;
        }    
})
// отключение ввода мощности
    
