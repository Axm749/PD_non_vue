let inp2 = document.querySelector("#inp2");
let Cams_bitrate = 0;
let Button = document.getElementById("start3");
let Result = document.getElementById("result3");
let FPS = 30;
Button.onclick = function(){
    // Очищаем старые результаты
    Result.innerHTML = `
    <p> <strong> Вывод для раздела Видео </strong></p>
    `;

    let Kodak = document.querySelector("#kodak");
    // alert(Kodak.value)
    // Вводим наши данные
    let Zones = Number(document.getElementById("PPM_zones").value);
    let Height = Number(document.getElementById("Cam_height").value);
    let Angle = Number(document.getElementById("Cam_angle").value);
    let Vertical = Number(document.getElementById("Vertical_Cam_Angle").value);
    let Horizontal = Number(document.getElementById("Horizontal_Cam_Angle").value);
    let L_max = Number(document.getElementById("Camera_Reach").value);
    let X = Number(document.getElementById("Resolution_X").value);
    let Y = Number(document.getElementById("Resolution_Y").value);
    let Total_Resolution = X * Y;

    console.log(`Зон PPM: ${Zones}`);
    console.log(`Высота камеры: ${Height}`);
    console.log(`Угол наклона камеры: ${Angle}`);
    console.log(`Вертикальный обзор камеры: ${Vertical}`);
    console.log(`Горизонтальный обзор камеры: ${Horizontal}`);
    console.log(`Дальность камеры: ${L_max}`);
    console.log(`Разрешение X: ${X}`);
    console.log(`Разрешение Y: ${Y}`);
    // Проверяем реальную длину
    check_len(Vertical,Angle,Height,L_max);

    let Angle_Height_LowFieldOfView = Angle - (Vertical/2)
    console.log(Angle_Height_LowFieldOfView);

    let L_blind = Number((Height * Math.tan(degtoRad(Angle_Height_LowFieldOfView))).toFixed(5))
    console.log(`Blind zone: ${L_blind}`);
    if ((L_max - L_blind) <= 0){
        console.log(`рассчет не имеет смысла, так как мы не видим земли вовсе
              Либо камеру ниже опустите, либо наклоните вниз побольше, либо вертикальный угол обзора расширить`)
        alert(`Ну типо ошибка, да?`)
    } if (L_blind < 0){
        console.log('рассчет не имеет смысла, так как мы смотрим назад, а ТЗ такое не предусмотрено')
        alert(`Ну типо ошибка, да?`)
    }

    dx = get_dx(L_max, L_blind, Zones);
    let Total = 0;

    for (let i = 1; i < Zones+1; i++){
        console.log(`____________________current cycle №${i}____________________`);
        console.log(`____________________f_param____________________`);
        let f = get_f(L_blind, dx, Height, i, L_max);
        console.log(`____________________d_param____________________`);
        let d = get_d(f, Vertical);
        console.log(`____________________Bottom____________________`);
        let bottom = get_Wigth(Height, L_blind + (i * dx), Horizontal);
        console.log(`____________________Top____________________`);
        let top = get_Wigth(Height, L_blind + ((i - 1) * dx), Horizontal);
        console.log(`____________________S_param____________________`);
        S = trap(dx, bottom, top);
        console.log(`____________________Total_PPM____________________`);
        let PPM = PPM_from_S(Total_Resolution, d, S, i)

        

        Total += (Total_Resolution * d)
        console.log(Total)
        Result.innerHTML +=`
        <p>PPM в зоне номер ${i} равняется: ${PPM} пикселей/м^2, а пикселей в этой зоне: ${(Total_Resolution * d).toFixed(0)}; покрываемая площадь: ${(S).toFixed(0)} м^2</p>
        `
    }

    
    let Codec = Number(Kodak.value);

    Bit_Rate = Number((Total * FPS * Codec).toFixed(5))
    console.log(`Our bit rate: ${(Bit_Rate/(1024*1024)).toFixed(5)}`);
    Cams_bitrate = (Bit_Rate/(1024*1024)).toFixed(5)
    document.querySelector("#choose_param").getElementsByTagName('option')[3].selected = 'selected'
    document.querySelector("#choose_param").getElementsByTagName('option')[0].selected = ''

    Result.innerHTML +=`
    <p>Полученный битрейт для камеры: ${(Bit_Rate/(1024*1024)).toFixed(5)} Mb/s</p>
    `

}
function degtoRad(degrees) {
    console.log(`We got: ${degrees} deegrees.`)
    return degrees * (Math.PI/180);
};

function radtoDeg(radians) {
    console.log(`We got: ${radians} radians.`)
    return radians * (180/Math.PI);
};

function check_len(Vertical,Angle,Height,L_max){
    let Outer_angle = ( Angle + (Vertical/2))
    let Real_L_max = (Height * Math.tan(degtoRad(Outer_angle))).toFixed(5)
    console.log(`Результаты функции CHECK_LEN Outer: ${Outer_angle}, Real L_max: ${Real_L_max}`);
    if (Outer_angle >= 90){
        console.log(`All good.`)
        return 0
    } if ( L_max >= Real_L_max){
        accept = confirm(`при введенных параметрах, реальная максимальная дальность будет ${Real_L_max},
         значит какие-то параметры введены неверно. Вы хотите продолжить с реальной максимальной дальностью?`)
        if ( accept === true) {
            console.log(`Продолжаем с тем, что есть, хорошо.`);
            L_max = Real_L_max;
            console.log(L_max);
        } else {
            alert(`Ну типо ошибка, да?`)
        }
    };
};

function get_dx(L_max, L_blind, Zones){
    let dx = (L_max - L_blind) / Zones
    console.log(`dx we calculated: ${dx}`)
    return dx
};

function get_f(L_blind, dx, Height, i, L_max){
    let L_big = L_blind + (dx * i)
    console.log(`L_big calculated: ${L_big}`)
    let Temp_f_big = radtoDeg(Math.atan(L_big / Height))
    console.log(`Temp_f_big calculated: ${Temp_f_big}`)
    let L_small = (L_blind + (dx * (i - 1)))
    console.log(`L_small calculated: ${L_small}`)
    let Temp_f_small = radtoDeg(Math.atan(L_small / Height))
    console.log(`Temp_f_small calculated: ${Temp_f_small}`)

    if (L_max < ((L_blind + (dx * i))/Height)){
        console.log(` Something ain't right. ${((L_blind + (dx * i))/Height)} is bigger than ${L_max}`)
    }

    let f = Temp_f_big - Temp_f_small
    console.log(`f we got from calculations: ${f}`)
    return f
};

function get_d(f, Vertical){
    d = Number((f/Vertical).toFixed(5))
    console.log(`the calculation of d param: ${d}`);
    return d
}

function get_Wigth(Height, SOMETHING, Horizontal){
    let HIPOTENUSE = Math.sqrt((SOMETHING*SOMETHING)+(Height*Height));
    console.log(`HIPOTENUSE: ${HIPOTENUSE} !!!`);
    let width = Number((2 * HIPOTENUSE * Math.tan(degtoRad(Horizontal/2))).toFixed(5));
    console.log(`width we got: ${width}`);
    return width
}

function trap(dx, bottom, top){
    console.log(top)
    let S = Number((top * dx + ((bottom - top) / 2) * dx).toFixed(5))
    console.log(`S we got: ${S}`)
    return S
}

function PPM_from_S(Total_Resolution, d, S, i){
    let PPM = Number(((Total_Resolution * d) / S).toFixed(5));
    console.log(`PPM of zone ${i} is equal to: ${PPM}`);
    console.log(`Pixels in that zone: ${Total_Resolution * d}`);
    return PPM
}












let start4 = document.getElementById("start4");
let resetAnalog = document.getElementById("start5");
let result4 = document.getElementById("result4")
Cams_bitrate = 0;
let pixelsCount = 0
start4.onclick = function (){
    let camBit = 0
    result4.innerHTML =`
    <p> <strong> Вывод для аналогового расчёта видеонаблюдения </strong></p>
    `;

    
    let plot = Number(document.getElementById("plot").value);
    let square = Number(document.getElementById("square").value);
    pixelsCount +=  plot*square
    camBit = pixelsCount*FPS*document.querySelector("#kodak").value

    camBit/=1048576
    console.log('Аналог', camBit);
    localStorage.setItem('Cams_bitrate', camBit)
    result4.innerHTML +=`
    <p>Битрейт при аналоговом расчёте видеонаблюдения: ${Number(camBit).toFixed(5)} </p>
    `;

}
resetAnalog.onclick = function (){
    localStorage.setItem('Cams_bitrate', Number('0'))
    var camBit = localStorage.getItem('Cams_bitrate')
    pixelsCount = 0
    result4.innerHTML =`
    <p> <strong> Вывод для аналогового расчёта видеонаблюдения </strong></p>
    `;
    console.log('Аналог', camBit);
    result4.innerHTML +=`
    <p>Битрейт при аналоговом расчёте видеонаблюдения: ${Number(localStorage.getItem('Cams_bitrate')).toFixed(5)} </p>
    `;
}
inp2.addEventListener("change", function(){
    let Kodak = document.querySelector("#kodak");
    console.log("hi")
    if(inp2.checked){
        Kodak.disabled = false;
        }else {
        Kodak.disabled = true;
        }    
})