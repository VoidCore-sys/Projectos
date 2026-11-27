/* Sección 1 · El Bosque de los Cuentos (1.º a 3.º grado) — libros nuevos */
const PD = (obra) => `Adaptación libre de ${obra}, obra de dominio público`;

module.exports = [
  {
    slug: 'fabulas-de-esopo',
    title: 'La liebre, la tortuga y otras fábulas',
    author: 'Esopo (adaptación de la Biblioteca)',
    license: PD('las Fábulas de Esopo (Grecia, siglo VI a. C.)'),
    synopsis: 'Una liebre muy confiada, un ratón pequeño que salva a un león, una cigarra que sólo quería cantar y un pastorcito que mentía para divertirse. Cuatro fábulas de hace más de dos mil quinientos años, contadas para leer hoy, cada una con su enseñanza.',
    genres: ['Cuento', 'Valores'],
    gradeMin: 1, gradeMax: 3,
    cover: { scene: 'bosque', c1: '#c3e88d', c2: '#3a8f5c' },
    chapters: [
      {
        title: 'La liebre y la tortuga',
        illustration: 'bosque',
        content: `En un prado vivía una liebre que corría más rápido que el viento. Y como corría tan rápido, se burlaba de todos.

—¡Tortuga, sos tan lenta que las flores crecen antes de que llegues a olerlas! —decía, y se reía.

La tortuga la miró con calma.

—¿Querés correr una carrera conmigo?

La liebre se rió tanto que se cayó de espaldas. Pero aceptó. El búho marcó la salida y la llegada: desde el árbol grande hasta el río.

—¡En sus marcas, listos, ya!

La liebre salió disparada y en un momento dejó a la tortuga muy atrás. Cuando miró hacia atrás y no la vio, pensó: "Tengo tiempo de sobra. Voy a dormir una siesta".

Se acostó bajo un árbol y se quedó dormida.

Mientras tanto, la tortuga caminaba. Paso a paso. Sin detenerse. Pasó al lado de la liebre dormida y siguió caminando.

Cuando la liebre se despertó, el sol ya estaba bajando. Corrió con todas sus fuerzas hacia el río… pero la tortuga ya estaba cruzando la llegada, y todos los animales la aplaudían.

Moraleja: el que es constante llega más lejos que el que es veloz pero confiado.`
      },
      {
        title: 'El león y el ratón',
        illustration: 'montanas',
        content: `Un león dormía la siesta al sol cuando un ratoncito, sin darse cuenta, le pasó por encima de la nariz. El león se despertó de un salto y lo atrapó con su enorme pata.

—¡Por favor, no me comas! —chilló el ratón—. Soy tan pequeño que ni siquiera te vas a llenar. Si me dejás ir, algún día te voy a ayudar.

El león se rió con un rugido.

—¿Vos, ayudarme a mí? ¡Esa sí que es buena! —Pero como el ratón lo había hecho reír, lo dejó ir.

Pocos días después, unos cazadores pusieron una red en el camino del león. El león quedó atrapado. Rugía y rugía, pero cuanto más se movía, más se enredaba.

El ratoncito escuchó los rugidos y corrió a ver qué pasaba. Sin perder tiempo, empezó a roer las cuerdas con sus dientes filosos. Una, dos, tres, diez cuerdas. Hasta que la red se abrió y el león quedó libre.

—Te reíste cuando te dije que te iba a ayudar —le dijo el ratón—. Ahora ya sabés que hasta un ratón puede ser útil a un león.

Moraleja: nadie es tan pequeño que no pueda ayudar, ni tan grande que no necesite ayuda.`
      },
      {
        title: 'La cigarra y la hormiga',
        illustration: 'huerta',
        content: `Durante todo el verano, la cigarra se la pasó cantando bajo el sol. Cantaba a la mañana, a la tarde y a la noche.

Cerca de ella, una hormiga trabajaba sin parar. Iba y venía cargando semillas y migas, y las guardaba en su hormiguero.

—Hormiga, ¿por qué trabajás tanto? —le preguntó la cigarra—. ¡Vení a cantar conmigo!

—Estoy guardando comida para el invierno —contestó la hormiga—. Deberías hacer lo mismo.

La cigarra se encogió de hombros y siguió cantando.

Llegó el invierno. El frío cubrió el campo y ya no había ni una semilla. La cigarra, con hambre y con frío, golpeó la puerta del hormiguero.

—Hormiga, ¿me darías un poco de comida?

La hormiga la miró un momento. Después abrió la puerta.

—Pasá. Hay para las dos. Pero este verano, vamos a trabajar juntas. Y a la tarde, si querés, me enseñás a cantar.

Moraleja: hay que pensar en el futuro… y también saber compartir.

(En la fábula antigua, la hormiga no ayudaba a la cigarra. ¿Qué final te gusta más? ¿Por qué?)`
      },
      {
        title: 'El pastorcito mentiroso',
        illustration: 'montanas',
        content: `En un pueblo de montaña vivía un pastorcito que cuidaba las ovejas. Pasaba los días solo en el cerro y se aburría mucho.

Un día se le ocurrió una broma. Corrió hacia el pueblo gritando:

—¡El lobo! ¡Viene el lobo! ¡Ayuda!

Los vecinos dejaron lo que estaban haciendo y subieron corriendo con palos y escobas. Pero cuando llegaron, no había ningún lobo. El pastorcito se reía a carcajadas.

A la semana siguiente hizo lo mismo. Y otra vez los vecinos subieron corriendo, y otra vez no encontraron nada.

Un atardecer, un lobo de verdad salió del bosque y se acercó a las ovejas. El pastorcito, asustado, corrió al pueblo:

—¡El lobo! ¡Esta vez es verdad! ¡Por favor!

Pero los vecinos lo miraron y siguieron con sus cosas. "Otra vez sus bromas", pensaron.

Esa noche, el pastorcito perdió varias ovejas. Y entendió algo que nunca olvidó: cuando alguien miente muchas veces, después nadie le cree, aunque diga la verdad.

Moraleja: la confianza tarda mucho en ganarse y muy poco en perderse.`
      }
    ],
    quiz: [
      { question: '¿Por qué perdió la carrera la liebre?', options: ['Porque se lastimó', 'Porque se quedó dormida confiada', 'Porque la tortuga hizo trampa', 'Porque llovió'], correct: 1, explanation: 'La liebre confió demasiado en su velocidad y se durmió.' },
      { question: '¿Cómo ayudó el ratón al león?', options: ['Le trajo comida', 'Royó las cuerdas de la red', 'Llamó a otros leones', 'Asustó a los cazadores'], correct: 1, explanation: 'Con sus dientes cortó la red y lo liberó.' },
      { question: '¿Qué hacía la hormiga durante el verano?', options: ['Dormía', 'Cantaba', 'Guardaba comida para el invierno', 'Viajaba'], correct: 2, explanation: 'La hormiga pensaba en el invierno que iba a llegar.' },
      { question: '¿Por qué nadie ayudó al pastorcito cuando vino el lobo de verdad?', options: ['Porque estaban dormidos', 'Porque había mentido muchas veces', 'Porque no lo escucharon', 'Porque tenían miedo'], correct: 1, explanation: 'Después de tantas bromas, los vecinos ya no le creían.' }
    ]
  },
  {
    slug: 'el-patito-feo',
    title: 'El patito feo',
    author: 'Hans Christian Andersen (adaptación de la Biblioteca)',
    license: PD('«El patito feo» de Hans Christian Andersen (1843)'),
    synopsis: 'De un huevo grande y gris nace un patito distinto a sus hermanos. Todos se burlan de él y tiene que irse lejos. Durante un largo invierno, aprenderá a resistir… hasta descubrir quién es en realidad.',
    genres: ['Cuento', 'Valores'],
    gradeMin: 1, gradeMax: 3,
    cover: { scene: 'oceano', c1: '#bde4f4', c2: '#5d9cc9' },
    chapters: [
      {
        title: 'Un huevo distinto',
        illustration: 'bosque',
        content: `Era verano en el campo. Los trigales brillaban dorados y, junto al lago, una pata empollaba sus huevos.

Un día, los huevos empezaron a romperse: ¡crac, crac, crac! Salieron unos patitos amarillos y suaves que piaban sin parar. Pero quedaba un huevo, el más grande de todos, que no se rompía.

—Ese huevo es raro —dijo una pata vieja que pasaba por ahí—. No le hagas caso.

Pero la mamá pata esperó, paciente. Hasta que el huevo grande se rompió y salió un patito gris, grandote y torpe, que no se parecía en nada a sus hermanos.

—¡Qué feo es! —dijeron los otros patos del corral.

Los patos lo picoteaban, las gallinas lo empujaban y hasta la chica que les daba de comer lo apartaba con el pie. Sus propios hermanos le decían:

—¡Ojalá te lleve el gato, patito feo!

El patito estaba tan triste que, una mañana, pasó por debajo del cerco y se fue lejos, muy lejos, hasta un pantano donde vivían patos salvajes.`
      },
      {
        title: 'El largo invierno',
        illustration: 'montanas',
        content: `En el pantano tampoco lo quisieron mucho. Los patos salvajes le decían que era feísimo, aunque lo dejaron quedarse. Un día se escucharon disparos de cazadores y el patito tuvo que esconderse entre los juncos, temblando de miedo.

Siguió caminando hasta que llegó a una cabaña. Allí vivían una anciana, un gato y una gallina. El gato y la gallina se creían muy importantes.

—¿Sabés poner huevos? —le preguntó la gallina.

—No.

—¿Sabés ronronear? —le preguntó el gato.

—No. Pero sé nadar, y me encanta meter la cabeza debajo del agua.

—¡Qué tontería! —dijeron los dos.

El patito se fue otra vez. Llegó el otoño, las hojas se pusieron rojas y una tarde vio pasar en el cielo unas aves hermosas, blancas, de cuello largo, que volaban hacia tierras cálidas. El patito sintió algo muy fuerte en el pecho, como si las conociera.

Después llegó el invierno. Hacía tanto frío que el agua del estanque se congeló, y el patito quedó atrapado en el hielo. Un campesino lo encontró, rompió el hielo con su zueco y se lo llevó a su casa. Pero los niños quisieron jugar con él, el patito se asustó, volcó la leche y la harina, y tuvo que escapar otra vez.

Pasó el resto del invierno solo, escondido entre los juncos. Fue el invierno más largo de su vida.`
      },
      {
        title: 'La primavera',
        illustration: 'oceano',
        content: `Un día el sol empezó a calentar. Las alondras cantaron y los árboles se llenaron de flores. El patito estiró las alas y notó algo: eran fuertes. Las movió, y sin darse cuenta, ¡voló!

Bajó en un jardín enorme, junto a un lago. Allí nadaban tres de aquellas aves blancas y hermosas que había visto en otoño. Eran cisnes.

"Seguro que me van a echar porque soy feo", pensó. "Pero prefiero que me echen ellos y no seguir solo".

Nadó hacia ellos con la cabeza baja, mirando el agua. Y entonces vio su reflejo.

No era un pato gris y torpe. Era un cisne blanco, de cuello largo y plumas brillantes.

Los otros cisnes nadaron a su alrededor y le acariciaron las plumas con el pico. Unos niños que jugaban en la orilla gritaron:

—¡Hay un cisne nuevo! ¡Es el más lindo de todos!

El cisne joven escondió la cabeza bajo el ala, porque no sabía qué hacer con tanta felicidad. No se puso orgulloso: un corazón bueno no se vuelve orgulloso. Recordó todo lo que había sufrido y pensó que, gracias a eso, ahora sabía valorar a quienes lo trataban bien.

Y nunca se olvidó de algo: no importa en qué corral hayas nacido si saliste de un huevo de cisne.`
      }
    ],
    quiz: [
      { question: '¿Por qué los demás molestaban al patito?', options: ['Porque era malo', 'Porque era distinto a ellos', 'Porque comía mucho', 'Porque no sabía nadar'], correct: 1, explanation: 'Lo rechazaban sólo por ser diferente.' },
      { question: '¿Qué aves vio el patito en el cielo durante el otoño?', options: ['Gaviotas', 'Cisnes', 'Palomas', 'Patos'], correct: 1, explanation: 'Eran cisnes, y sintió que los conocía.' },
      { question: '¿Qué descubrió el patito al mirar su reflejo?', options: ['Que se había mojado', 'Que era un cisne', 'Que estaba más gordo', 'Que tenía otro color de ojos'], correct: 1, explanation: 'Había crecido y era un hermoso cisne.' },
      { question: '¿Qué nos enseña el cuento?', options: ['Que hay que burlarse de los distintos', 'Que cada uno tiene su tiempo para crecer y que no hay que juzgar por la apariencia', 'Que los patos son malos', 'Que el invierno es largo'], correct: 1, explanation: 'Lo que parecía "feo" era sólo alguien diferente que todavía estaba creciendo.' }
    ]
  },
  {
    slug: 'ramona-la-nube',
    title: 'Ramona, la nube que no quería llover',
    author: 'Inés Larralde',
    synopsis: 'Ramona es una nube esponjosa a la que le encanta pasear por el cielo. Pero tiene un problema: no quiere llover, porque piensa que si llueve va a desaparecer. Un viaje por el campo le mostrará el secreto del ciclo del agua.',
    genres: ['Ciencia', 'Cuento', 'Naturaleza'],
    gradeMin: 1, gradeMax: 3,
    cover: { scene: 'montanas', c1: '#a1c4fd', c2: '#c2e9fb' },
    chapters: [
      {
        title: 'Una nube muy esponjosa',
        illustration: 'montanas',
        content: `Ramona era la nube más esponjosa del cielo. Era blanca como el algodón y le gustaba cambiar de forma: a veces parecía un conejo, a veces un barco y a veces una torta de cumpleaños.

Ramona se paseaba sobre los campos y las ciudades, y los chicos la señalaban desde abajo:

—¡Mirá, una nube con forma de dragón!

Pero un día, Ramona empezó a sentirse pesada. Muy pesada. Se había llenado de gotitas de agua, y se estaba poniendo gris.

—Ramona, ya es hora de llover —le dijo su amiga, la nube Petra.

—¡No quiero! —contestó Ramona—. Si llueve, me voy a vaciar, me voy a achicar y voy a desaparecer para siempre.

Y se escondió detrás de una montaña, apretando todas sus gotitas para que no se cayera ninguna.

Mientras tanto, abajo, en el campo, la tierra estaba seca y agrietada. Las plantas de maíz tenían las hojas caídas. El arroyo era apenas un hilo de agua. Y un granjero, Don Anselmo, miraba el cielo y suspiraba:

—Si no llueve pronto, se pierde toda la cosecha.`
      },
      {
        title: 'El viaje de una gota',
        illustration: 'huerta',
        content: `Esa noche, Ramona no podía dormir. Estaba tan pesada que una gotita se le escapó. Plic. La gotita cayó, cayó y cayó, y aterrizó en una hoja de maíz.

—¡Gracias! —dijo la planta, que tenía mucha sed.

Ramona se asomó y vio que la gotita no había desaparecido. Seguía ahí, brillando en la hoja.

Entonces el sol de la mañana le habló:

—Ramona, te voy a contar un secreto. El agua no desaparece nunca: viaja. Cuando llueve, el agua cae a la tierra. Una parte la toman las plantas y los animales. Otra parte corre por los arroyos y los ríos hasta el mar. Y cuando yo caliento el agua del mar, de los ríos y de las hojas, el agua se convierte en vapor, sube invisible al cielo y forma nubes nuevas. Eso se llama evaporación.

—¿Y después?

—Después, cuando el vapor sube alto, donde hace frío, se vuelve a juntar en gotitas. Eso se llama condensación. Así nacen las nubes, como vos. Y cuando las gotitas son muchas y pesadas, cae la lluvia, que se llama precipitación. Y todo empieza otra vez. Es un viaje que no termina nunca: el ciclo del agua.

Ramona se quedó pensando.

—Entonces… si llueve, ¿después vuelvo?

—Siempre volvés —dijo el sol—. Tal vez con otra forma. Tal vez en otro cielo. Pero el agua que sos hoy va a seguir viajando por el mundo.`
      },
      {
        title: 'La lluvia más feliz',
        illustration: 'bosque',
        content: `Ramona tomó aire, si es que las nubes toman aire, y dejó de apretar sus gotitas.

Plic, plic, plic. Primero cayeron unas pocas. Después muchas más. ¡Y finalmente, una lluvia alegre y fresca cayó sobre todo el campo!

Las plantas de maíz levantaron sus hojas. El arroyo empezó a correr cantando. Las ranas croaron de felicidad. Y Don Anselmo salió al patio, levantó la cara hacia el cielo y se rió, empapado.

Ramona se fue haciendo cada vez más chiquita, más chiquita, hasta que se deshizo en el aire. Pero no tuvo miedo, porque ahora conocía el secreto.

Sus gotitas corrieron por el arroyo, llegaron al río y del río al mar. Algunas las tomó una vaca. Otras se quedaron en las raíces de un árbol.

Unos días después, el sol calentó el mar. Una nube nueva empezó a formarse sobre las olas, blanca, esponjosa, con forma de conejo.

Si alguna vez ves una nube con forma de conejo, saludala. Quizás sea Ramona, que volvió a pasear por el cielo.`
      }
    ],
    quiz: [
      { question: '¿Por qué Ramona no quería llover?', options: ['Porque le daba frío', 'Porque pensaba que iba a desaparecer para siempre', 'Porque no sabía cómo', 'Porque estaba enojada'], correct: 1, explanation: 'Creía que al llover se iba a terminar.' },
      { question: '¿Cómo se llama cuando el sol calienta el agua y la convierte en vapor?', options: ['Precipitación', 'Evaporación', 'Congelación', 'Condensación'], correct: 1, explanation: 'El agua se evapora y sube al cielo.' },
      { question: '¿Qué es la precipitación?', options: ['Cuando cae la lluvia', 'Cuando sale el sol', 'Cuando sopla el viento', 'Cuando se forma un río'], correct: 0, explanation: 'La lluvia, la nieve y el granizo son precipitaciones.' },
      { question: '¿Qué aprendió Ramona?', options: ['Que el agua desaparece', 'Que el agua viaja en un ciclo que no termina', 'Que las nubes son de algodón', 'Que el sol es malo'], correct: 1, explanation: 'El agua se evapora, se condensa y vuelve a caer: es el ciclo del agua.' }
    ]
  },
  {
    slug: 'tuerquita-el-robot-que-aprendio-a-reir',
    title: 'Tuerquita, el robot que aprendió a reír',
    author: 'Diego Saravia',
    synopsis: 'La escuela recibe un robot ayudante que sabe todas las respuestas, ordena los lápices en un segundo y nunca se equivoca. Pero Tuerquita no entiende los chistes, no sabe jugar a la mancha y nunca se ríe. Los chicos de segundo grado se proponen enseñarle lo más difícil de todo.',
    genres: ['Humor', 'Ciencia ficción', 'Valores'],
    gradeMin: 1, gradeMax: 3,
    cover: { scene: 'robot', c1: '#ffd6a5', c2: '#ff8fab' },
    chapters: [
      {
        title: 'Un compañero nuevo',
        illustration: 'escuela',
        content: `Un lunes, la seño Paula entró al aula de segundo grado con una caja enorme.

—Chicos, les presento a un compañero muy especial.

De la caja salió un robot redondo, del tamaño de un perro, con dos ruedas, dos brazos finitos y una pantalla en la cara donde se veían dos ojitos celestes.

—Hola. Soy el Robot Ayudante Modelo T-200. Puedo ordenar, calcular, deletrear y medir. Encantado de conocerlos.

—¡Se va a llamar Tuerquita! —gritó Benjamín. Y así se quedó.

Tuerquita era increíble. Sabía cuánto era 348 más 159 antes de que terminaras de preguntar. Ordenaba todos los lápices por color en un segundo. Sabía cómo se escribía "zanahoria" y "hipopótamo".

Pero había cosas que no entendía.

En el recreo, Lola le contó un chiste:

—Tuerquita, ¿qué le dijo un semáforo a otro? ¡No me mires, que me estoy cambiando!

Todos se rieron. Tuerquita se quedó quieto.

—Error. Los semáforos no hablan. Tampoco se cambian de ropa. La información es incorrecta.

Los chicos se miraron. Tuerquita sabía muchísimo, pero no sabía reírse.`
      },
      {
        title: 'Lecciones de risa',
        illustration: 'robot',
        content: `Los chicos de segundo grado decidieron que iban a enseñarle a Tuerquita a reír. Hicieron un plan, como hacen los científicos.

El martes le enseñaron a jugar a la mancha. Tuerquita corría muy rápido, pero cuando lo tocaban, decía: "Error. Fui alcanzado. Fin del juego". Y se iba a un rincón.

—¡No, Tuerquita! —le explicó Martina—. Si te tocan, ahora la mancha sos vos. ¡El juego sigue! Lo divertido no es ganar, es correr juntos.

Tuerquita se quedó pensando. Sus ojitos parpadearon. Después salió corriendo detrás de Benjamín, y por primera vez dijo algo raro:

—¡Mancha! ¡Te toqué! ¡Mancha vos!

El miércoles le hicieron cosquillas. No funcionó, porque Tuerquita no tenía cosquillas. Pero cuando Lola se tropezó con una pelota y cayó sentada sobre un almohadón con cara de sorpresa, todos se rieron, Lola también, y en la pantalla de Tuerquita apareció una línea curvada, como una sonrisita.

El jueves, Benjamín le contó a Tuerquita el chiste más malo del mundo:

—¿Qué le dijo el número uno al número diez? ¡Para ser como yo, tenés que ser sincero!

Tuerquita calculó. Uno. Diez. Sin cero. Sin-cero. Sincero. Su pantalla se iluminó.

—Comprendo. Es un juego de palabras. Es… ¡ji! ¡Ji, ji!

Era la risa más rara que habían escuchado: sonaba como una tetera con hipo. Pero era una risa.`
      },
      {
        title: 'El mejor regalo',
        illustration: 'escuela',
        content: `El viernes era el cumpleaños de la seño Paula. Los chicos querían hacerle una sorpresa, pero no se ponían de acuerdo. Unos querían cantar, otros querían hacer una torta de plastilina y otros querían hacer un dibujo gigante.

Empezaron a discutir. Todos hablaban al mismo tiempo. Martina se puso a llorar.

Entonces Tuerquita rodó hasta el medio del aula.

—Propuesta: si cantamos MIENTRAS mostramos el dibujo gigante QUE TIENE una torta dibujada, hacemos las tres cosas al mismo tiempo.

Todos se quedaron callados. Era una idea perfecta. Era la idea de un robot que sabía calcular… pero también de un amigo que quería que nadie estuviera triste.

Cuando la seño Paula entró, todos cantaron el feliz cumpleaños mientras levantaban un dibujo enorme con una torta de veinte velas. Tuerquita cantaba también, con voz de robot, desafinando muchísimo. La seño se rió tanto que le cayeron lágrimas.

—¿Por qué te reís, seño? —preguntó Tuerquita.

—Porque estoy feliz, Tuerquita.

El robot procesó la información.

—Entonces yo también me estoy riendo por eso. ¡Ji, ji, ji!

Ese día, en la libreta de Tuerquita, la seño escribió: "Aprendió a sumar, a restar y a deletrear. Pero lo más importante: aprendió a ser compañero".`
      }
    ],
    quiz: [
      { question: '¿Qué cosas sabía hacer muy bien Tuerquita?', options: ['Contar chistes', 'Calcular, ordenar y deletrear', 'Cocinar', 'Bailar'], correct: 1, explanation: 'Era un robot ayudante muy rápido para calcular y ordenar.' },
      { question: '¿Qué le explicó Martina sobre la mancha?', options: ['Que lo importante es ganar', 'Que lo divertido es jugar juntos', 'Que los robots no pueden jugar', 'Que hay que correr despacio'], correct: 1, explanation: 'Si te tocan, el juego sigue: lo divertido es compartirlo.' },
      { question: '¿Por qué es gracioso el chiste del número uno?', options: ['Porque "sin cero" suena como "sincero"', 'Porque los números hablan', 'Porque el diez es grande', 'No es gracioso'], correct: 0, explanation: 'Es un juego de palabras: sin-cero / sincero.' },
      { question: '¿Cómo ayudó Tuerquita a resolver la discusión?', options: ['Gritando', 'Proponiendo juntar todas las ideas', 'Eligiendo la suya', 'Llamando a la directora'], correct: 1, explanation: 'Propuso hacer las tres cosas a la vez para que todos estuvieran contentos.' }
    ]
  },
  {
    slug: 'la-bruja-bruna-y-su-escoba-resfriada',
    title: 'La bruja Bruna y su escoba resfriada',
    author: 'Clara Montiel',
    synopsis: 'Bruna es una bruja joven que vive en lo alto de un castillo torcido. Esta noche se celebra la gran Carrera de Escobas, pero su escoba, Ventarrón, amaneció con un resfrío terrible: cada vez que estornuda, sale volando para cualquier lado.',
    genres: ['Fantasía', 'Humor', 'Aventura'],
    gradeMin: 1, gradeMax: 3,
    cover: { scene: 'castillo', c1: '#cdb4ff', c2: '#6a4c93' },
    chapters: [
      {
        title: '¡Achís!',
        illustration: 'castillo',
        content: `En lo alto de una colina había un castillo torcido, con torres que se inclinaban como si estuvieran cansadas. Allí vivía la bruja Bruna, que tenía nueve años de bruja, un sombrero violeta lleno de remiendos y un gato naranja llamado Mermelada.

Bruna estaba feliz: esa noche, con luna llena, se iba a hacer la gran Carrera de Escobas, y ella iba a participar por primera vez.

—Ventarrón, ¡arriba! —le dijo a su escoba—. Hoy es nuestro gran día.

La escoba se levantó del rincón… y estornudó.

—¡ACHÍS!

Con el estornudo, Ventarrón salió disparada, dio tres vueltas por la cocina, tiró la olla de sopa de calabaza y se quedó pegada al techo, temblando.

—¡Ay, no! —dijo Bruna—. ¡Ventarrón, estás resfriada!

La escoba tenía las ramitas todas paradas y le goteaba la punta. Cada vez que intentaba volar derecho: ¡ACHÍS!, y salía para cualquier lado.

Mermelada se lamió una pata con cara de "te lo dije".

—Te dije que no volaras bajo la lluvia anoche —maulló.`
      },
      {
        title: 'Remedios de bruja',
        illustration: 'luna',
        content: `Bruna abrió su gran libro de hechizos y buscó en la letra R: "Remedios para escobas resfriadas".

—Acá está. Primer remedio: un caldo de hojas de eucalipto con una pizca de polvo de estrellas.

Preparó el caldo, sopló para enfriarlo y se lo dio a Ventarrón. La escoba lo tomó por la punta, como si fuera un sorbete. Se quedó quieta un momento… y estornudó tan fuerte que el caldo salió volando y le cayó a Mermelada en la cabeza.

—Segundo remedio —leyó Bruna, mientras el gato se sacudía furioso—: una bufanda tejida con lana de oveja de las nubes.

Bruna no tenía lana de oveja de las nubes, así que le puso a Ventarrón la bufanda de su abuela, que era roja con rayas verdes. La escoba se veía muy elegante. Pero en cuanto intentó volar: ¡ACHÍS! Y se fue de cabeza contra la biblioteca. Cayeron veinte libros, y uno de ellos se abrió en una página que decía: "Para curar un resfrío no hay hechizo mejor que descansar y que te cuiden".

Bruna miró el reloj. Faltaba una hora para la carrera.

Miró a Ventarrón, que estaba tirada en el piso, con la bufanda torcida y los ojos llorosos (porque las escobas mágicas también tienen ojos, aunque no se vean).

—No podemos correr así —dijo Bruna, despacio—. Vos estás enferma.`
      },
      {
        title: 'La carrera más rara',
        illustration: 'castillo',
        content: `Esa noche, mientras las otras brujas se juntaban para la carrera, Bruna se quedó en el castillo. Hizo una cama de almohadones para Ventarrón, la tapó con una manta y le leyó un cuento. Mermelada, aunque seguía ofendido por el caldo, se acostó al lado de la escoba para darle calor.

De pronto, golpearon la ventana. Era la bruja más anciana del bosque, Doña Escarcha, con su escoba de plata.

—Bruna, ¿no venís a la carrera?

—No puedo, Doña Escarcha. Ventarrón está resfriada y prefiero cuidarla.

La anciana sonrió y bajó de su escoba.

—¿Sabés una cosa? Hace cien años, en mi primera carrera, mi escoba también se enfermó. Yo la obligué a volar igual. Nos caímos en un pantano y ella estuvo un mes sin poder levantarse. Vos elegiste mejor.

Doña Escarcha sacó de su bolsillo un frasquito con miel de flores de luna.

—Una cucharadita antes de dormir. Mañana va a estar como nueva.

Al día siguiente, Ventarrón se despertó con las ramitas brillantes y sin un solo estornudo. Bruna se subió de un salto y volaron sobre el bosque, rápido y derecho, haciendo piruetas entre las nubes.

No habían ganado ninguna carrera. Pero Bruna sentía que había ganado algo mejor: una escoba sana y feliz, que la quería muchísimo.

Y el año siguiente, en la Carrera de Escobas, Bruna y Ventarrón llegaron… terceras. ¡Pero con la bufanda roja con rayas verdes flameando al viento!`
      }
    ],
    quiz: [
      { question: '¿Qué le pasaba a Ventarrón?', options: ['Estaba rota', 'Estaba resfriada y estornudaba', 'Tenía miedo de volar', 'Se había perdido'], correct: 1, explanation: 'Cada estornudo la hacía salir volando para cualquier lado.' },
      { question: '¿Qué decía la página del libro que se abrió sola?', options: ['Que hay que volar igual', 'Que lo mejor es descansar y que te cuiden', 'Que hay que comprar otra escoba', 'Que el gato tenía la culpa'], correct: 1, explanation: 'El mejor remedio era descansar y recibir cuidados.' },
      { question: '¿Qué decidió Bruna?', options: ['Correr igual', 'Quedarse a cuidar a su escoba', 'Pedir prestada otra escoba', 'Hacer trampa'], correct: 1, explanation: 'Eligió cuidar a Ventarrón antes que competir.' },
      { question: '¿Qué le contó Doña Escarcha?', options: ['Que ella había obligado a su escoba enferma a volar y le fue mal', 'Que la carrera se había suspendido', 'Que Bruna había ganado', 'Que las escobas no se enferman'], correct: 0, explanation: 'Por eso le dijo a Bruna que había elegido mejor.' }
    ]
  },
  {
    slug: 'mateo-y-los-gigantes-de-la-patagonia',
    title: 'Mateo y los gigantes de la Patagonia',
    author: 'Martín Aldaz',
    synopsis: 'Mateo visita con su clase un museo de paleontología. Cuando se separa del grupo, un esqueleto gigante le guiña un ojo y lo invita a un viaje de millones de años, a la Patagonia de los dinosaurios más grandes que existieron.',
    genres: ['Ciencia', 'Aventura', 'Fantasía'],
    gradeMin: 2, gradeMax: 3,
    cover: { scene: 'montanas', c1: '#f9c784', c2: '#a0522d' },
    chapters: [
      {
        title: 'El esqueleto que guiñó un ojo',
        illustration: 'castillo',
        content: `La excursión de tercer grado era al museo de ciencias naturales. Mateo estaba tan emocionado que no había dormido en toda la noche: le encantaban los dinosaurios y sabía los nombres de un montón.

En la sala principal había un esqueleto enorme, tan largo que la cola llegaba hasta la otra punta del salón y la cabeza casi tocaba el techo.

—Este es un Argentinosaurus —explicó la guía—. Vivió en lo que hoy es la provincia de Neuquén, hace unos noventa millones de años. Es uno de los animales más grandes que caminaron sobre la Tierra. Podía medir más de treinta metros: ¡como tres colectivos uno detrás del otro!

Mateo se quedó mirándolo con la boca abierta. Tanto, que no se dio cuenta de que el grupo se iba a la sala siguiente. Se quedó solo.

Entonces escuchó un crujido. Levantó la vista. La enorme cabeza del esqueleto estaba girando, muy despacio, hacia él. Y uno de los huecos de los ojos… le guiñó.

—Hola, Mateo —dijo una voz grave, como un trueno lejano—. Me llamo Tita. ¿Querés ver cómo era mi casa?

Antes de que pudiera contestar, el piso del museo se volvió de arena, las paredes se volvieron cielo, y Mateo sintió un viento caliente en la cara.`
      },
      {
        title: 'La Patagonia de hace millones de años',
        illustration: 'montanas',
        content: `Mateo estaba en una llanura enorme, con ríos anchos, helechos gigantes y árboles altísimos. Hacía calor. A su lado, Tita ya no era un esqueleto: era una Argentinosaurus de verdad, con piel gris verdosa y un cuello tan largo que su cabeza se perdía entre las copas de los árboles.

—Bienvenido a la Patagonia del período Cretácico —dijo Tita—. En esta época, todo esto era muy distinto. No había personas, ni ciudades, ni rutas.

Tita arrancó un montón de hojas de lo alto de un árbol y se las tragó sin masticar.

—¿Sólo comés plantas? —preguntó Mateo.

—Sí. Soy herbívora. Como muchísimas plantas por día. Para ser tan grande, hay que comer mucho.

De pronto, la tierra tembló. Entre los árboles apareció otro dinosaurio, de dientes filosos como cuchillos y patas poderosas. Caminaba en dos patas y rugía.

—Es un Giganotosaurus —susurró Tita—. Uno de los carnívoros más grandes que existieron. También vivió acá, en la Patagonia. Pero no te preocupes: a mí no se anima a atacarme. Soy demasiado grande para él.

El Giganotosaurus las miró, olfateó el aire y se fue por donde había venido. Mateo soltó el aire que estaba aguantando.

—¿Y cómo saben los científicos todo esto, si nadie estuvo acá?

—Por los fósiles —dijo Tita—. Cuando un animal muere, a veces queda cubierto de barro y arena. Con millones de años, sus huesos se convierten en piedra. Los paleontólogos los encuentran, los estudian como detectives y descubren cómo éramos.`
      },
      {
        title: 'El cuaderno de un paleontólogo',
        illustration: 'escuela',
        content: `—Es hora de volver —dijo Tita—. Tus compañeros te están buscando.

—¿Te voy a volver a ver?

—Cada vez que vayas a un museo, Mateo. Y quizás algún día seas vos el que encuentre un hueso nuevo en el desierto.

El viento caliente sopló otra vez, la arena se volvió baldosas y el cielo se volvió techo. Mateo estaba en la sala del museo, frente al esqueleto quieto, y la seño lo llamaba desde la puerta.

—¡Mateo! ¡Te estábamos buscando!

Mateo corrió hacia el grupo. Antes de salir, miró hacia atrás. El esqueleto estaba igual que siempre. ¿O le pareció que la cola se había movido un poquito?

En la sala siguiente había una mesa donde una paleontóloga limpiaba un hueso con un pincel finito.

—Esto se hace con mucha paciencia —les explicó—. Un hueso fósil puede tardar semanas en limpiarse. Y en la Patagonia todavía hay muchísimos dinosaurios por descubrir.

Mateo levantó la mano.

—¿Qué hay que estudiar para ser paleontólogo?

—Mucha ciencia, mucha paciencia y muchas ganas de preguntarse cosas —sonrió ella.

Esa noche, Mateo abrió un cuaderno nuevo y escribió en la tapa: "Cuaderno de un paleontólogo". En la primera página dibujó a Tita, con su cuello larguísimo. Y abajo, con su mejor letra, escribió: "Argentinosaurus. Herbívora. Neuquén. Mi amiga".`
      }
    ],
    quiz: [
      { question: '¿Dónde vivió el Argentinosaurus?', options: ['En Europa', 'En lo que hoy es Neuquén, en la Patagonia', 'En el mar', 'En la Antártida'], correct: 1, explanation: 'Sus restos se encontraron en la provincia de Neuquén.' },
      { question: '¿Qué comía Tita?', options: ['Carne', 'Peces', 'Plantas', 'Insectos'], correct: 2, explanation: 'Era herbívora: comía hojas y plantas.' },
      { question: '¿Qué es un fósil?', options: ['Un hueso de plástico', 'Restos de un ser vivo que con millones de años se convirtieron en piedra', 'Un dinosaurio vivo', 'Una piedra preciosa'], correct: 1, explanation: 'Los fósiles permiten saber cómo eran los seres que vivieron hace mucho.' },
      { question: '¿Qué hace falta para ser paleontólogo, según la científica?', options: ['Ser muy fuerte', 'Ciencia, paciencia y ganas de preguntarse cosas', 'Tener un dinosaurio', 'Vivir en un museo'], correct: 1, explanation: 'La paleontología requiere estudio y mucha paciencia.' }
    ]
  },
  {
    slug: 'la-lechuza-que-tenia-miedo-de-la-oscuridad',
    title: 'La lechuza que tenía miedo de la oscuridad',
    author: 'Rocío Benavídez',
    synopsis: 'Todas las lechuzas salen de noche. Todas, menos Lunita, que tiene miedo de la oscuridad. Con la ayuda de una luciérnaga, un murciélago y un zorrito, descubrirá que la noche está llena de cosas maravillosas.',
    genres: ['Cuento', 'Valores', 'Naturaleza'],
    gradeMin: 1, gradeMax: 2,
    cover: { scene: 'luna', c1: '#3d348b', c2: '#7678ed' },
    chapters: [
      {
        title: 'Lunita no quiere salir',
        illustration: 'luna',
        content: `En el hueco de un árbol viejo vivía una familia de lechuzas. Durante el día dormían, y cuando el sol se escondía, salían a volar por el bosque.

Pero Lunita, la lechuza más chiquita, no quería salir.

—Tengo miedo de la oscuridad —decía, escondida bajo el ala de su mamá.

—Pero Lunita, somos lechuzas —le explicaba su mamá—. Nuestros ojos son grandes para ver de noche. Y nuestras orejas escuchan hasta el ruido más chiquito.

—Igual tengo miedo. En la oscuridad hay ruidos raros y sombras que se mueven.

Esa noche, sus hermanos salieron a volar y Lunita se quedó sola en la puerta del árbol, mirando la noche. Estaba todo negro. Se escuchaba un "cri-cri-cri" y un "fru-fru-fru". Lunita cerró los ojos con fuerza.

Entonces sintió una lucecita cálida frente a la cara.

—Hola. ¿Por qué tenés los ojos cerrados? —preguntó una vocecita.

Lunita abrió un ojo. Frente a ella flotaba una luciérnaga, con la colita encendida como una linterna.`
      },
      {
        title: 'Amigos de la noche',
        illustration: 'bosque',
        content: `La luciérnaga se llamaba Chispa.

—Yo te acompaño —dijo—. Así ves que la noche no es tan oscura.

Lunita salió del árbol, despacito. Chispa iluminaba el camino.

—¿Ese "cri-cri-cri" qué es? —preguntó Lunita, temblando.

—Son los grillos. Cantan frotando las alas. Están dando un concierto.

—¿Y ese "fru-fru-fru"?

Desde una rama colgaba un animalito cabeza abajo, envuelto en sus alas como en una capa.

—Soy yo —dijo—. Me llamo Bati. Soy un murciélago. Ese ruido son mis alas cuando vuelo. ¿Sabías que yo veo con las orejas? Hago unos sonidos muy agudos y escucho el eco. Así sé dónde están las cosas, aunque esté todo oscuro.

Lunita estaba asombrada. Siguieron caminando y vieron dos ojitos brillando entre los arbustos. Lunita se escondió detrás de Chispa. Pero era un zorrito, que salía a buscar frutos.

—Buenas noches —dijo el zorro—. La noche es la mejor hora para pasear. Hay silencio, hay frescura, y mirá para arriba.

Lunita levantó la cabeza. El cielo estaba lleno de estrellas, miles y miles, y en el medio, redonda y brillante, estaba la luna.

—¡Qué lindo! —dijo Lunita—. Nunca la había visto.`
      },
      {
        title: 'El primer vuelo',
        illustration: 'luna',
        content: `—¿Te animás a volar? —le preguntó Chispa.

Lunita miró sus alas. Miró la luna. Respiró hondo, abrió las alas y saltó de la rama.

Al principio volaba torcida, pero enseguida se dio cuenta de algo: ¡veía todo! Sus ojos grandes se habían acostumbrado y podía ver los árboles, el río plateado por la luna, las flores que se abrían de noche. Y sus orejas escuchaban a los grillos, el agua, el viento entre las hojas.

Voló por encima del bosque, junto a Bati el murciélago, y Chispa iba detrás, dejando una estela de luz.

Cuando volvió al árbol, su mamá la estaba esperando con los ojos muy abiertos.

—¡Lunita! ¡Volaste de noche!

—Sí, mamá. Y ¿sabés qué? La oscuridad no estaba vacía. Estaba llena de amigos.

Desde esa noche, Lunita sale a volar cada vez que se esconde el sol. A veces todavía siente un poquito de miedo, porque el miedo no se va de golpe. Pero ahora sabe que el miedo se achica cuando uno conoce lo que lo asusta. Y que siempre es más fácil con amigos al lado.`
      }
    ],
    quiz: [
      { question: '¿De qué tenía miedo Lunita?', options: ['Del agua', 'De la oscuridad', 'De los gatos', 'De volar alto'], correct: 1, explanation: 'Le daban miedo la noche, sus ruidos y sus sombras.' },
      { question: '¿Cómo "ve" el murciélago en la oscuridad?', options: ['Con una linterna', 'Escuchando el eco de sus sonidos', 'Con anteojos', 'No ve nada'], correct: 1, explanation: 'Los murciélagos se orientan con el eco.' },
      { question: '¿Qué ruido hacían los grillos?', options: ['Fru-fru-fru', 'Cri-cri-cri', 'Uh-uh-uh', 'Plic-plic'], correct: 1, explanation: 'Los grillos cantan frotando sus alas.' },
      { question: '¿Qué descubrió Lunita sobre el miedo?', options: ['Que se va de golpe', 'Que se achica cuando conocemos lo que nos asusta', 'Que nunca se va', 'Que hay que esconderse'], correct: 1, explanation: 'Conocer la noche y tener amigos la ayudó a animarse.' }
    ]
  }
];
