let konverg = document.querySelector("#konverg");
let nestandart = document.querySelector("#standart");
let start = document.getElementById("start");
let mBR = 0;
let wats =0;
let usli=0;
let power2 = document.getElementById("power");
let stan = document.getElementById("stan");
let mBR_ = document.getElementById("mBR_visible");

let param = document.getElementById("choose_param");

param.addEventListener("change", function(){
  // console.log(param.value);
  if (param.value =="Myself") {
    mBR_.style.display = "block";
    //показываем окно ввода битрейта для ручного ввода
  } else {
    mBR_.style.display = "none";
  }
})
// Отображаем битрейт при ручном вводе

// console.log(standart);
nestandart.addEventListener("change", ()=>{
  if (nestandart.checked){
    stan.style.display ="block";
    //Показываем ввод для параметров нестандартного узла
  }else{
    stan.style.display ="none";
  }
}
)

// console.log(typeof param.value);
document.addEventListener('DOMContentLoaded', function() {
  mBR_.style.display = "none";
  stan.style.display = "none";
  power2.disabled = true;
  //Предустановленные значения для окон
}, false);


start.onclick = function(){
  let param = document.getElementById("choose_param");
  console.log(document.querySelector("#choose_param").getElementsByTagName('option')[3].value, Cams_bitrate)


  start1()
  // обработчик нажатия с указанием на функцию Старт
}

let start1 =()=>{

  let users =+ document.getElementById("users").value;
  let days =+ document.getElementById("days").value;
  let capacity =+ document.getElementById("volume").value;
  let discs =+ document.getElementById("discs").value;
  //Объявление переменных, имеющих ручной ввод

  // console.log(capacity);
  // console.log(discs);
  if( param.value != ""){
    // console.log(param.value);
    mBR = MBR(param, mBR);
    //Вычисление битрейта
    // console.log(mBR);
    Volume = volume2(mBR,users,days);
    //Вычисление объёма
    let Volume1 = converg(Volume.Volume1,capacity,discs);
    //Вычисление остальных параметров

    usli = Standart(Volume1.Volume1,capacity,discs);
    output(Volume.Volume,Volume.Volume1,Volume1.Volume, Volume1.Volume1,usli);
    wats=power(usli);

  }  else {alert ("Please, select a mode.")};
    // Выдаёт сообщение об ошибке, если не выбран режим 
  return wats;
}

let MBR = (param, mBR) => {
    // console.log(param.value)
    if(param.value == "Myself")
    {mBR = +document.getElementById("mBR").value};
    if(param.value =="Users")
    {mBR = 5};
    if(param.value =="Phones")
    {mBR = 0.1};
    if(param.value =="Cams")
    { 
      if (Cams_bitrate){
        mBR = Number(
        Cams_bitrate
        ) }
      else {
        mBR = 8
      }
      
     }
    console.log("mBR:   ", mBR);
    return mBR;
}
// Выбор режима вычисления для определения битрейта

let volume2=(mBR,users,days) =>{
// console.log(mBR);
// console.log(users);
// console.log(days);
let Volume = mBR*users*days*3600*24;
// console.log(Volume);
Volume = Math.ceil(Volume/8000000);
   console.log("Рассчитанный объём в TiB:   ", Volume);
   //Выводим объём в TiB
   Volume1 = Math.ceil(Volume/0.85/0.9095);
   console.log("Рассчитанный объём, переведённый в Tбайт:   ",Volume1);
   //Выводим объём в Тбайтах
   return {Volume:Volume,Volume1:Volume1};
}
// Вычисление необходимого объёма

let converg = (Volume)=>{
if (konverg.checked){
  //Вычисление дополнительного объёма при гиперконвергентной системе
  Volume = Math.ceil(Volume*2);
  console.log("Объём с резервным копированием:   ", Volume, " Тбайт");
  Volume1 = Math.ceil(Volume/0.7);
  console.log("С учетом резерва требуемая от СХД полезная", Volume1," Тбайт");
}
return {Volume:Volume, Volume1:Volume1};

}
// Определение конвергентной системы

let Standart = (Volume,capacity,discs)=>{
 if(!nestandart.checked && !konverg.checked){
// alert(`i'm here1!`)
// console.log("1",Volume);
usli = Math.ceil(Volume/15/8);
console.log("Количество узлов :   ",usli," шт");
console.log("Количество узлов с резервированием:   ", usli+2," шт");

 }else if(konverg.checked && !nestandart.checked){
  // alert(`i'm here2!`)
// console.log("2",Volume)
usli = Math.ceil(Volume/7/4);
console.log("Количество узлов :   ",usli," шт");
console.log("Количество узлов с резервированием:   ", usli+2," шт");
 }else{
  // alert(`i'm here3!`)
  // console.log("3",Volume)
  usli = Math.ceil(Volume/discs/capacity);
  console.log("Количество узлов :   ",usli," шт");
  console.log("Количество узлов с резервированием:   ", usli+2," шт");
 }
 return usli;
}
// Расчёт количества узлов для каждой из систем

let power = (usli)=>{
  if(konverg.checked){
    wats = (usli+2)*1000;
    console.log(wats);
  } else {
    wats = (usli+2)*700;
    console.log(wats);
  }
  document.getElementById("power").value = wats
  return wats;
}

let output =(Volume,Volume1,Volume_rez,Volume_rez2,usli)=>{
  let result1=document.getElementById("result1")
  result1.innerHTML=`
  <p> <strong> Вывод для раздела СХД</strong></p>
  `

  result1 = document.getElementById("result1")
    result1.innerHTML+=`
    <p>Требуемый объём для хранения видеоданных ${Volume}  TiB</p>
    <p>Требуемый объём СХД с учетом перевода TiB в Тбайт ${Volume1}  Тбайт</p>`
    if(konverg.checked){    result1.innerHTML+=`
    <p>Объём с резервным копированием ${Volume_rez}  Тбайт</p>
    <p>С учетом резерва требуемая от СХД полезная ёмкость составит ${Volume_rez2}  Тбайт</p>`
}
    result1.innerHTML+=`
    <p>Количество узлов ${usli}  шт</p>
    <p>Количество узлов с резервированием ${usli+2}  шт</p>
    `
}
