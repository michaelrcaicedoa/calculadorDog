let isStarted = false;
const Telegraf = require('telegraf');
const bot = new Telegraf('5023328540:AAFJN10ERBmd20mKJGajxGRRLEVvB1Xgn7k')
let questions = [

  //GRUPO A
  {part: "Brazo", value: -1, valueOptions: 0, minValue: 1, maxValue: 6, img:"./img/brazos.jpeg"},
  {part: "Ante brazo", value: -1, minValue: 1, maxValue: 3, img:"./img/antebrazo.jpeg"},
  {part: "Muñeca", value: -1, minValue: 1, maxValue: 4, img:"./img/muñeca.jpeg"},
  {part: "Giro de muñeca", value: -1, minValue: 1, maxValue: 2, img:"./img/giromuñeca.jpeg"},
  {part: "Actividad muscular grupo A", value: -1, minValue: 0, maxValue: 1, img:"./img/actividadmuscular.jpeg"},
  {part: "Fuerza ejercida grupo A", value: -1, minValue: 0, maxValue: 3, img:"./img/fuerzaejercida.jpeg"},
  {part: "Grupo B", value: -1, message: "Así que manos a la obra con el siguiente grupo, Ahora empezaremos por el grupo B. "},

  //GRUPO B
  {part: "Cuello", value: -1, minValue: 1, maxValue: 6, img:"./img/cuello.jpeg"},
  {part: "Tronco", value: -1, minValue: 1, maxValue: 6, img:"./img/tronco.jpeg"},
  {part: "Piernas", value: -1, minValue: 1, maxValue: 2, img:"./img/piernas.jpeg"},
  {part: "Actividad muscular grupo B", value: -1, minValue: 0, maxValue: 1, img:"./img/actividadmuscular.jpeg"},
  {part: "Fuerza ejercida grupo B", value: -1, minValue: 0, maxValue: 3, img:"./img/fuerzaejercida.jpeg"}
];

bot.use((ctx, next) => {
  if (ctx.message.text  != "/start") {
    
    if (isStarted) {
      startQuestion(ctx);
      isStarted = false;
    }else{       

    let isCorrect=validAnswer(ctx.message.text);
    
    if (!isCorrect) {

      let question = questions.find(f => f.value == -1);

      if (question != undefined) {        
        ctx.reply(AnswerIncorrect(question.part));
      }

      }else{

        if (questions.find(f => f.value == -1) != undefined) {

          questions.find(f => f.value == -1).value = parseInt(ctx.message.text);

          if (questions.find(f => f.value == -1) != undefined) {

            let question = questions.find(f => f.value == -1);           

            if (question != undefined) {

              if (question.part == "Grupo B") {
                ctx.reply(question.message);
                questions.find(f => f.value == -1).value = 1;
                question = questions.find(f => f.value == -1);
              }

                ctx.replyWithPhoto({ source:question.img }, { caption: "Visualice la imagen" });

                let options = [];
    
                for (let index = 0; index < question.maxValue; index++) {
                  options.push((question.minValue + index).toString());              
                }
    
                if (question.minValue == 0) {
                  options.push(question.maxValue.toString());
                }
    
                bot.telegram.sendMessage(ctx.chat.id, getParameter(question.part), {
                  'reply_markup': {
                    'keyboard': [options],
                    resize_keyboard: true,
                    one_time_keyboard: true,
                    force_reply: true
                    }
                  });

            }else{
              ctx.reply(`Muchas gracias por usar`);
            }
          }else{
            ctx.reply(calculateTotal(), {parse_mode : "HTML"});
            setTimeout(function(){ctx.reply(`Para volver a consultar presione una tecla`)}, 1000);
            questions.forEach(d => {d.value = -1});
            isStarted = true;
          }
        }
        }
      }
    } 
  ctx.state.users = 75;
  next(ctx);

})

bot.start((ctx) => {

  ctx.reply(`¡Hola! Bienvenid@, Soy calculadorDog y seré tu bot de ayuda, pulsa el botón de inicio y empezamos con tus análisis ergonómicos. 

  Recordemos que el método Rula se divide en dos Grupos: 
  GRUPO A) Brazo, antebrazo y muñeca.
  GRUPO B) Cuello, tronco y piernas.
  
  Antes de empezar, ¿hablaremos de cómo funciona?  yo CalculadorDog te ayudare hacer el análisis mucho más rápido, solo tienes que elegir y seleccionar según tus datos Y yo me encargare de hacer la suma de tus datos recolectados para el método RULA.
  
  Ansioso, para que estés más seguro lo que analizare, serán los dos grupos que están compuesto por:
  
  Grupo A) Dentro de este grupo se analizará también el grupo C que es resultado del grupo A + la actividad muscular + fuerzas ejercidas.
  Grupo B) Dentro de este grupo se analizará también el grupo D que es resultado del grupo B + la actividad muscular + fuerzas ejercidas.
  Y por último te daremos la puntuación final de método RULA y el nivel de riesgo. Mucho más fácil. \n\n

  <b>Recuerda que debes visualizar atentamente la imagen , en algunas ilustraciones visualizaras un número que indicara la posición en la que te encuentras y agregar bonificaciones a la posición que estas haciendo, por lo que deberás sumarla y seleccionar tu respuesta. </b>
  `, {parse_mode : "HTML"});

  ctx.reply(`Así que manos a la obra, Empezaremos por el grupo A.`);

  startQuestion(ctx);

})

function startQuestion(ctx){
  let question = questions.find(f => f.value == -1);

  ctx.replyWithPhoto({ source:question.img }, { caption: "Visualice la imagen" });
  
  let options = [];

  for (let index = 0; index < question.maxValue; index++) {
    options.push((question.minValue + index).toString());              
  }

  bot.telegram.sendMessage(ctx.chat.id, getParameter(question.part), {
              'reply_markup': {
                'keyboard': [options],
                resize_keyboard: true,
                one_time_keyboard: true,
                force_reply: true
                }
              });
}

function getParameter(type) {
  return `Ingrese el ángulo de la posición del ${type}`;
}

function validAnswer(value){ ///Validar de que no coloque un valor difetente al del rango

  let question = questions.find(f => f.value == -1);

if (value >= 0) {
  
  if (value < 0  || value > 120) {
    return false;
  }

  if (value >= question.minValue && value <= question.maxValue ) {
    return true;
  }

  return false;
}
return false;
}

function AnswerIncorrect(parameter){
  return `El valor ingresado es incorrecto, por favor vuelva a diligenciar el dato de: ${parameter}`;
}

var cuadroA = [
[1,2,2,2,2,3,3,3],
[2,2,2,2,3,3,3,3],
[2,3,3,3,3,3,4,4],
[2,3,3,3,3,4,4,4],
[3,3,3,3,3,4,4,4],
[3,4,4,4,4,4,5,5],
[3,3,4,4,4,4,5,5],
[3,4,4,4,4,4,5,5],
[4,4,4,4,4,5,5,5],
[4,4,4,4,4,5,5,5],
[4,4,4,4,4,5,5,5],
[4,4,4,5,5,5,6,6],
[5,5,5,5,5,6,6,7],
[5,6,6,6,6,7,7,7],
[6,6,6,7,7,7,7,8],
[7,7,7,7,7,8,8,9],
[8,8,8,8,8,9,9,9],
[9,9,9,9,9,9,9,9]
];

var cuadroB = [
  [1,3,2,3,3,4,5,5,6,6,7,7],
  [2,3,2,3,4,5,5,5,6,7,7,7],
  [3,3,3,4,4,5,5,6,6,7,7,7],
  [5,5,5,6,6,7,7,7,7,7,8,8],
  [7,7,7,7,7,8,8,8,8,8,8,8],
  [8,8,8,8,8,8,8,9,9,9,9,9]
];

var tablaFinal = [
  [1,2,3,3,4,5,5],
  [2,2,3,4,4,5,5],
  [3,3,3,4,4,5,6],
  [3,3,3,4,5,6,6],
  [4,4,4,5,6,7,7],
  [4,4,5,6,6,7,7],
  [5,5,6,6,7,7,7],
  [5,5,6,7,7,7,7]
]

function calculateAC() {

  let valueBrazo = questions.find(g => g.part == "Brazo").value;
  let ante_Brazo = questions.find(g => g.part == "Ante brazo").value;
  let muneca = questions.find(g => g.part == "Muñeca").value;
  let girodemuneca = questions.find(g => g.part == "Giro de muñeca").value;

  let position = [cuadroA[(valueBrazo * 3) - 3],cuadroA[(valueBrazo * 3) - 2],cuadroA[(valueBrazo * 3) -1]]
  position = position[ante_Brazo - 1];
  let value  = position[(muneca * 2 - ( girodemuneca == 2 ? 0 : 1)) - 1];

  return [value, questions.find(g => g.part == "Actividad muscular grupo A").value + questions.find(g => g.part == "Fuerza ejercida grupo A").value];
}

function calculateBD() {

  let cuello = questions.find(g => g.part == "Cuello").value;
  let tronco = questions.find(g => g.part == "Tronco").value;
  let piernas = questions.find(g => g.part == "Piernas").value;

  let position = cuadroB[cuello -1]
  let value  = position[(tronco * 2 - ( piernas == 2 ? 0 : 1)) - 1];

  return [value, questions.find(g => g.part == "Actividad muscular grupo B").value + questions.find(g => g.part == "Fuerza ejercida grupo B").value];
}

function calculateTotal(){
  let valueAC = calculateAC();
  let valueBD = calculateBD();

  let total = 0;

  if ((valueAC[0] + valueAC[1])  > 8 || (valueBD[0] + valueBD[1]) > 7) {
    total = 7;
  }else{
    total = tablaFinal[(valueAC[0] + valueAC[1]) - 1][(valueBD[0] + valueBD[1]) - 1]; 
  }

  console.log("c: ", valueAC[1]);
  console.log("d: ", valueBD[1]);

  let message = `Totales Obtenidos: \n
  
  Total Grupo A : ${(valueAC[0])} \n
  Total Grupo B : ${(valueBD[0])} \n
  Total Grupo C : ${(valueAC[0] + valueAC[1])} \n
  Total Grupo D : ${(valueBD[0] + valueBD[1])} \n

  <b>Puntuación final RULA: ${total}\n\n</b>`;

  switch (total) {
    case 1:
    case 2:
      message+= ` Nivel de riesgo: 1\n Puntuaciones entre 1 y 2 indican que el riesgo de la tarea resulta aceptable y no son precisos cambios.`;
      break;

    case 3:
    case 4:
      message+= ` Nivel de riesgo: 2\n Puntuaciones entre 3 y 4 indican que es necesario un estudio a profundidad del puesto porque puede requerir cambios.`;
      break;

    case 5:
    case 6:
      message+= ` Nivel de riesgo: 3\n Puntuaciones entre 5 y 6 indican que los cambios son necesarios.`;
      break;

    case 7:
      message+= ` Nivel de riesgo: 4\n Puntuación de 7 indica que los cambios son urgentes.`
      break;

  }

  message += `\n\n Espero a verte sido de mucha ayuda en tus análisis, GUAUBYE.`
  
  return message;

}

bot.launch()