/* Sección 2 · La Isla de los Aventureros (4.º y 5.º grado) — libros nuevos (parte A) */
const PD = (obra) => `Adaptación libre de ${obra}, obra de dominio público`;

module.exports = [
  {
    slug: 'la-liga-de-los-pelirrojos',
    title: 'Sherlock Holmes: La liga de los pelirrojos',
    author: 'Arthur Conan Doyle (adaptación de la Biblioteca)',
    license: PD('«La liga de los pelirrojos» de Arthur Conan Doyle (1891)'),
    synopsis: 'Un comerciante de pelo rojo como el fuego recibe un trabajo extrañísimo: copiar la enciclopedia a cambio de mucho dinero, sólo por ser pelirrojo. Cuando el trabajo desaparece de un día para el otro, Sherlock Holmes y el doctor Watson descubren que detrás de la broma se esconde un plan audaz.',
    genres: ['Policial', 'Misterio'],
    gradeMin: 4, gradeMax: 5,
    featured: true,
    cover: { scene: 'ciudad', c1: '#5a3e36', c2: '#c0392b' },
    chapters: [
      {
        title: 'Un trabajo demasiado bueno',
        illustration: 'ciudad',
        content: `Londres, otoño de 1890. En el departamento de la calle Baker 221B, el detective Sherlock Holmes escuchaba con atención a un visitante robusto, de cara colorada y con un pelo tan rojo que parecía en llamas. Su amigo, el doctor Watson, tomaba notas.

—Me llamo Jabez Wilson —dijo el hombre—. Tengo una pequeña casa de empeños cerca de la plaza Saxe-Coburg. El negocio no anda muy bien, así que tengo un solo empleado, Vincent Spaulding. Trabaja por la mitad del sueldo para aprender el oficio. Es muy listo, aunque tiene una manía: se pasa horas en el sótano revelando fotografías.

—Siga, por favor —dijo Holmes.

—Hace dos meses, Spaulding me mostró un aviso en el diario. Decía que una tal "Liga de los Pelirrojos" ofrecía un puesto bien pagado a un hombre de pelo rojo. Spaulding insistió tanto que fui a la dirección. Había una fila enorme de pelirrojos, ¡de todos los tonos! Pero el señor que entrevistaba, un tal Duncan Ross, me eligió a mí. Hasta me tiró del pelo para comprobar que no fuera una peluca.

—¿Y en qué consistía el trabajo?

—En copiar la Enciclopedia Británica, a mano, de diez a dos de la tarde, todos los días. Por cuatro libras por semana. Con una sola condición: no podía salir de la oficina en esas horas, por ningún motivo. Si salía, perdía el puesto.

Watson levantó las cejas. Era un sueldo muy alto por un trabajo tan absurdo.

—Durante ocho semanas copié artículos —siguió Wilson—: abades, arquería, armaduras, arquitectura… Ya iba por la letra B. Pero esta mañana, cuando llegué, la puerta estaba cerrada. Tenía clavado un cartel: "La Liga de los Pelirrojos ha sido disuelta. 9 de octubre de 1890". Nadie sabe nada. La oficina está vacía. ¡Señor Holmes, quiero saber quién me hizo esta broma, y por qué!

Holmes cerró los ojos, juntó la punta de los dedos y se quedó en silencio.

—Señor Wilson —preguntó por fin—, ese empleado suyo, Spaulding, ¿cómo es?

—Bajo, ágil, sin barba. Tiene una mancha blanca en la frente, como de ácido. Y las orejas agujereadas, como para usar aros.

Holmes abrió los ojos. Le brillaban.

—Muy interesante. Muy, muy interesante.`
      },
      {
        title: 'Lo que vio Holmes en la plaza',
        illustration: 'escuela',
        content: `Esa misma tarde, Holmes y Watson fueron a la plaza Saxe-Coburg. Era un lugar gris y tranquilo, con casas viejas y un jardincito triste. Sobre una de las puertas, un cartel decía: "Jabez Wilson. Préstamos".

Holmes hizo algo raro: golpeó varias veces el empedrado de la vereda con su bastón, frente al negocio. Después tocó el timbre. Abrió un joven bien afeitado.

—Disculpe —dijo Holmes—, ¿cómo se llega a la calle Strand?

El joven le explicó el camino y cerró la puerta.

—Ese es Spaulding —dijo Holmes mientras se alejaban—. Lo conozco de nombre: es uno de los hombres más astutos de Londres. Y no le pregunté el camino para saberlo. Quería ver sus rodillas.

—¿Sus rodillas? —Watson no entendía nada.

—Los pantalones estaban gastados y sucios en las rodillas, Watson. ¿Qué hace un hombre arrodillado durante horas? Y además golpeé la vereda para saber si el sótano se extendía hacia adelante. No. Se extiende hacia atrás.

Dieron la vuelta a la manzana. Del otro lado, en la calle de atrás, había negocios elegantes: una tabaquería, un restaurante… y la sucursal del Banco de la City y de los Suburbios.

Holmes se detuvo frente al banco y sonrió.

—Ahora sí entiendo todo. ¿Por qué alguien pagaría para que un hombre se quede fuera de su casa cuatro horas por día? Para que no esté en su casa. ¿Y qué hace un empleado en el sótano durante horas, arrodillado? No revela fotografías, Watson. Cava. Cava un túnel. Y el túnel va justo hacia este banco.

—¿Y por qué la liga se disolvió hoy?

—Porque el túnel está terminado. No necesitan más que Wilson esté afuera. Van a entrar al banco muy pronto, probablemente esta misma noche, que es sábado. El banco cierra hasta el lunes y tendrían tiempo de escapar.

Holmes llamó a un coche.

—Watson, traiga su revólver. Esta noche vamos a esperar a los ladrones en la oscuridad.`
      },
      {
        title: 'Esperando en la bóveda',
        illustration: 'llave',
        content: `A las diez de la noche, cuatro hombres bajaron en silencio al sótano del banco: Holmes, Watson, el inspector Jones de Scotland Yard y el señor Merryweather, director del banco, que estaba muy nervioso.

—En esta bóveda tenemos treinta mil monedas de oro francesas —susurró Merryweather—. Si ese túnel llega hasta acá, estamos perdidos.

El sótano estaba lleno de cajas pesadas. Holmes se arrodilló, revisó las baldosas con una lupa y asintió.

—Apaguen las linternas. Quietos y en silencio.

Esperaron en la oscuridad total. Pasó una hora. Pasó otra. Watson sentía las piernas entumecidas y escuchaba su propio corazón.

De pronto vio un brillo en el piso. Una línea de luz entre dos baldosas. Después, una de las baldosas se levantó con un chirrido, y por el agujero asomó una mano blanca, con un farol. Después apareció una cara joven, sin barba, con una mancha blanca en la frente.

El hombre salió del agujero y ayudó a subir a su compañero, un pelirrojo grandote.

—Todo despejado, Archie —susurró—. Pasame las bolsas.

En ese momento, Holmes saltó y lo agarró del cuello.

—¡Es inútil, John Clay! No tiene escapatoria.

El pelirrojo grandote se tiró de cabeza por el agujero y el inspector Jones apenas alcanzó a agarrarle un pedazo de la ropa. Pero no llegó lejos: Holmes había hecho vigilar la casa de Wilson por la policía.

John Clay, que se hacía llamar Vincent Spaulding, miró a Holmes con una calma helada.

—Lo felicito, señor. Fue una idea muy ingeniosa la de la liga.

—La de ustedes también —contestó Holmes—. Nunca había visto algo tan original.`
      },
      {
        title: 'La explicación',
        illustration: 'ciudad',
        content: `A la madrugada, en la calle Baker, frente a la chimenea, Watson pidió las explicaciones que se moría por escuchar.

—Desde el principio fue evidente —dijo Holmes, encendiendo su pipa— que el único objetivo de ese aviso tan absurdo era sacar a Wilson de su casa algunas horas cada día. La pregunta era: ¿para qué?

—Y pensó en el empleado.

—Exacto. Un hombre muy inteligente que trabaja por la mitad del sueldo y se pasa horas en el sótano: eso es sospechoso. Seguramente fue él quien convenció a Wilson de presentarse. La liga la inventaron Clay y su cómplice, que es pelirrojo y se hizo pasar por Duncan Ross. El trabajo de copiar la enciclopedia era perfecto: aburrido, largo y obligaba a Wilson a quedarse lejos.

—¿Y cómo supo que el robo sería esta noche?

—Porque cerraron la oficina de la liga. Eso significaba que ya no les importaba si Wilson estaba en casa: el túnel estaba listo. Y tenían que usarlo pronto, antes de que alguien lo descubriera o el oro cambiara de lugar. El sábado era el mejor día: les daba dos días de ventaja.

Watson negó con la cabeza, admirado.

—Es usted asombroso, Holmes. Una cadena de razonamientos sin un solo eslabón suelto.

—Elemental —dijo Holmes, y bostezó—. Mi querido Watson, mi vida es un largo esfuerzo para escapar del aburrimiento. Estos pequeños problemas me ayudan.

Lo más curioso de todo es que el pobre Jabez Wilson nunca entendió del todo lo que había pasado. Sólo supo que había cobrado treinta y dos libras por copiar artículos de la letra A… y que el pelo rojo, a veces, trae aventuras inesperadas.`
      }
    ],
    quiz: [
      { question: '¿Qué trabajo extraño le dieron a Jabez Wilson?', options: ['Contar monedas', 'Copiar la enciclopedia a mano', 'Cuidar un banco', 'Teñir pelucas'], correct: 1, explanation: 'Debía copiar la Enciclopedia Británica de diez a dos sin salir.' },
      { question: '¿Por qué Holmes quería ver las rodillas de Spaulding?', options: ['Para saber si estaba lastimado', 'Porque los pantalones gastados mostraban que pasaba horas arrodillado cavando', 'Por curiosidad', 'Para medirlo'], correct: 1, explanation: 'Las rodillas sucias y gastadas confirmaban que cavaba un túnel.' },
      { question: '¿Cuál era el verdadero objetivo de la "Liga de los Pelirrojos"?', options: ['Ayudar a los pelirrojos', 'Sacar a Wilson de su casa para cavar un túnel hasta el banco', 'Vender enciclopedias', 'Hacerle una broma'], correct: 1, explanation: 'Así los ladrones podían trabajar en el sótano sin ser vistos.' },
      { question: '¿Por qué Holmes dedujo que el robo sería ese sábado?', options: ['Porque lo leyó en el diario', 'Porque la liga se disolvió y el banco cerraba hasta el lunes', 'Porque llovía', 'Porque Watson lo adivinó'], correct: 1, explanation: 'El túnel estaba listo y el fin de semana les daba ventaja.' }
    ]
  },
  {
    slug: 'viaje-al-centro-de-la-tierra',
    title: 'Viaje al centro de la Tierra',
    author: 'Julio Verne (adaptación de la Biblioteca)',
    license: PD('«Viaje al centro de la Tierra» de Julio Verne (1864)'),
    synopsis: 'Un mensaje secreto escondido en un libro antiguo dice que es posible llegar al centro de la Tierra entrando por un volcán de Islandia. El profesor Lidenbrock, su sobrino Axel y el guía Hans bajan a las profundidades, donde los esperan túneles infinitos, un mar subterráneo y criaturas de otra era.',
    genres: ['Aventura', 'Ciencia ficción', 'Exploración'],
    gradeMin: 4, gradeMax: 5,
    cover: { scene: 'montanas', c1: '#ff9a3c', c2: '#5c2a1d' },
    chapters: [
      {
        title: 'El mensaje secreto',
        illustration: 'llave',
        content: `Hamburgo, Alemania, mayo de 1863. El profesor Otto Lidenbrock entró a su casa como un huracán, con un libro viejísimo bajo el brazo. Era un sabio famoso, experto en minerales, impaciente y gruñón. Su sobrino Axel, que vivía con él y lo ayudaba en sus estudios, lo miró con miedo: cuando su tío estaba así de entusiasmado, nadie comía hasta que resolviera lo que tenía entre manos.

—¡Axel! Mirá este tesoro. Una crónica islandesa de hace setecientos años.

Al abrir el libro, cayó un pergamino amarillento. Estaba cubierto de signos extraños.

—Son runas —dijo el profesor—. Un alfabeto antiguo de los pueblos del norte. Y esta firma… ¡es de Arne Saknussemm, un sabio islandés del siglo XVI!

Pasaron horas tratando de descifrarlo. Convirtieron las runas en letras, pero el resultado no tenía sentido. El profesor se encerró furioso en su estudio y juró que nadie en la casa comería hasta descubrir el secreto.

Fue Axel quien lo descubrió, por casualidad, abanicándose con el papel: al mirar el texto al revés, desde la última letra hasta la primera, aparecieron palabras en latín. El mensaje decía, más o menos:

"Baja al cráter del Snæfellsjökull, que la sombra del Scartaris acaricia antes de las calendas de julio, viajero audaz, y llegarás al centro de la Tierra. Yo lo hice. Arne Saknussemm".

Axel se puso pálido. Su tío era capaz de intentarlo. Pensó en esconder el papel, pero el profesor lo vio, leyó y saltó de alegría.

—¡Nos vamos a Islandia!

—Pero, tío —protestó Axel—, los científicos dicen que el interior de la Tierra está caliente, que a cierta profundidad todo es roca fundida…

—Los científicos dicen muchas cosas —gruñó el profesor—. Nadie bajó a comprobarlo. Nosotros lo vamos a hacer.`
      },
      {
        title: 'Bajo el volcán',
        illustration: 'montanas',
        content: `Viajaron en barco hasta Islandia, una isla de volcanes, glaciares y géiseres. Allí contrataron a un guía: Hans, un cazador callado y tranquilo, de brazos fuertes, que hablaba muy poco y nunca se asustaba de nada.

Subieron al volcán Snæfellsjökull, cubierto de nieve. En el fondo del cráter había tres chimeneas. ¿Cuál era la correcta? El profesor esperó, impaciente, varios días nublados. Hasta que el último día de junio salió el sol, y la sombra de un pico vecino, el Scartaris, tocó justo el borde de una de las chimeneas.

—¡Es esa! —gritó el profesor.

Bajaron con sogas, faroles eléctricos y provisiones. Al principio los túneles eran de lava antigua, y las paredes brillaban como cristal. Después se volvieron estrechos, oscuros, interminables. Bajaron durante días y días. Axel se dio cuenta de algo curioso: la temperatura subía mucho menos de lo que los sabios decían.

Pero pronto apareció un problema más grave: se terminó el agua. Durante dos días caminaron con la garganta seca, y Axel se desmayó de sed.

Entonces Hans pegó la oreja a la roca. Escuchó un murmullo: había agua corriendo del otro lado. Con el pico, golpeó la pared con paciencia. De pronto, un chorro de agua caliente saltó de la grieta. Bebieron hasta llenarse.

—Lo vamos a llamar el Hansbach —dijo el profesor—, el arroyo de Hans.

Hans sólo sonrió y siguió caminando.

Días después, Axel se distrajo y se separó de los demás. Cuando se dio cuenta, estaba solo, perdido en la oscuridad de un túnel. Gritó hasta quedarse sin voz. Lloró. Pero de pronto escuchó, muy lejos, la voz de su tío: por un efecto del sonido en la roca, la voz viajaba por las paredes. Siguiendo esas indicaciones, caminó, resbaló, cayó por una pendiente… y se desmayó. Cuando despertó, estaba otra vez junto a su tío y a Hans.`
      },
      {
        title: 'El mar de las profundidades',
        illustration: 'oceano',
        content: `Al salir de una galería, los tres se quedaron mudos. Delante de ellos había un mar. Un mar enorme, bajo tierra, con olas que rompían en una playa de arena. Arriba, a gran altura, había una bóveda de roca iluminada por una luz eléctrica extraña, como una aurora permanente.

—El mar de Lidenbrock —anunció el profesor, orgulloso de ponerle su propio nombre.

Cerca de la costa había un bosque de hongos gigantes, altos como árboles. Y más allá encontraron huesos enormes de animales extinguidos hacía muchísimo tiempo.

Hans construyó una balsa y se lanzaron al mar. Navegaron durante días. Un mediodía, el agua empezó a agitarse. De las olas surgieron dos monstruos marinos colosales: uno con hocico de delfín y dientes de cocodrilo, un ictiosaurio; el otro, con cuello de serpiente y cuerpo de tortuga gigante, un plesiosaurio. Eran reptiles marinos que, en la superficie, sólo se conocían por sus fósiles. Lucharon con una furia espantosa, levantando olas que casi dan vuelta la balsa, hasta que desaparecieron en las profundidades.

Después llegó una tormenta subterránea, con rayos que bajaban de la bóveda de roca. Una bola de fuego recorrió la balsa. El viento los arrastró durante días hasta tirarlos en una costa desconocida.

Allí, Axel y su tío vieron algo que nunca pudieron explicar del todo: en un bosque de árboles antiguos, una manada de mastodontes, unos parientes enormes de los elefantes, comía tranquila. Y entre ellos, cuidándolos como un pastor, había un ser gigantesco con forma humana. Axel arrastró a su tío y huyeron sin hacer ruido.`
      },
      {
        title: 'Lanzados por un volcán',
        illustration: 'cohete',
        content: `En esa costa, el profesor encontró un cuchillo oxidado y, grabadas en la roca, las iniciales "A. S.": Arne Saknussemm había pasado por ahí. El camino seguía por un túnel. Pero el túnel estaba bloqueado por una roca enorme.

—La vamos a volar con pólvora —decidió el profesor.

Prepararon la carga, se alejaron en la balsa y encendieron la mecha. La explosión fue mucho más grande de lo que esperaban. La roca se abrió y detrás no había un túnel, sino un abismo. El mar entero empezó a caer por ahí, arrastrando la balsa con ellos.

Cayeron durante horas, a una velocidad terrible, en la oscuridad. Después, la corriente cambió. Ya no bajaban: subían. El agua se había metido en la chimenea de un volcán y la balsa era empujada hacia arriba por el agua hirviente, el vapor y la lava. Hacía un calor insoportable. Las paredes temblaban y se escuchaban explosiones.

—¡Estamos dentro de un volcán en erupción! —gritó el profesor, y por primera vez parecía encantado de verdad.

Con un estallido final, salieron disparados por el aire y cayeron en la ladera de una montaña. Estaban lastimados, chamuscados, con la ropa hecha jirones… pero vivos. Alrededor había olivos, viñas y un mar azul brillante. Un chico que pasaba les dijo el nombre del lugar: estaban en el volcán Stromboli, en una isla de Italia, a miles de kilómetros de Islandia.

Habían entrado por un volcán en el norte de Europa y salido por otro en el sur.

Al volver a Hamburgo, el profesor Lidenbrock fue recibido como un héroe. Hans volvió a Islandia, tranquilo como siempre. Y Axel, que al principio tenía tanto miedo, terminó contando la historia a todo el que quisiera escucharla, porque había aprendido que la curiosidad, cuando va acompañada de valor y de buenos compañeros, puede llevarte a los lugares más increíbles del mundo… y de debajo del mundo.`
      }
    ],
    quiz: [
      { question: '¿Cómo descifró Axel el mensaje de Saknussemm?', options: ['Con una computadora', 'Leyéndolo al revés', 'Traduciéndolo al islandés', 'Se lo explicó Hans'], correct: 1, explanation: 'Al leerlo desde la última letra aparecían palabras en latín.' },
      { question: '¿Cómo consiguieron agua cuando se quedaron sin provisiones?', options: ['Con la lluvia', 'Hans escuchó un arroyo detrás de la roca y abrió la pared', 'Derritieron nieve', 'Encontraron un lago'], correct: 1, explanation: 'El arroyo fue llamado Hansbach en su honor.' },
      { question: '¿Qué criaturas vieron pelear en el mar subterráneo?', options: ['Ballenas', 'Un ictiosaurio y un plesiosaurio', 'Tiburones', 'Pulpos gigantes'], correct: 1, explanation: 'Eran reptiles marinos de épocas muy antiguas.' },
      { question: '¿Por dónde salieron de las profundidades?', options: ['Por el mismo volcán', 'Por el volcán Stromboli, en Italia', 'Por una cueva en Islandia', 'Por el mar'], correct: 1, explanation: 'Una erupción los lanzó hacia afuera en Italia.' }
    ]
  },
  {
    slug: 'el-fantasma-de-canterville',
    title: 'El fantasma de Canterville',
    author: 'Oscar Wilde (adaptación de la Biblioteca)',
    license: PD('«El fantasma de Canterville» de Oscar Wilde (1887)'),
    synopsis: 'Una familia norteamericana compra un castillo inglés donde vive un fantasma que lleva trescientos años asustando a todo el mundo. El problema es que a esta familia nada le da miedo. Una historia de fantasmas muy divertida… y, al final, muy emotiva.',
    genres: ['Humor', 'Fantasía', 'Misterio'],
    gradeMin: 4, gradeMax: 5,
    cover: { scene: 'casona', c1: '#6d597a', c2: '#355070' },
    chapters: [
      {
        title: 'Una familia que no cree en fantasmas',
        illustration: 'casona',
        content: `Cuando el señor Hiram Otis, embajador de los Estados Unidos, compró el castillo de Canterville, en Inglaterra, todos le advirtieron:

—Señor Otis, ahí vive un fantasma. Lo vio la duquesa viuda, y del susto nunca se recuperó.

—Si existe un fantasma —contestó el señor Otis—, en mi país lo pondríamos en un museo y cobraríamos entrada.

Así que la familia Otis se mudó al castillo: el señor y la señora Otis; su hijo mayor, Washington; su hija Virginia, de quince años, una chica valiente que montaba a caballo mejor que nadie; y los mellizos, dos pequeños terremotos traviesos.

La primera tarde, en la biblioteca, la señora Otis vio una mancha roja en el piso.

—Es sangre —explicó la vieja ama de llaves, la señora Umney, con voz temblorosa—. Es la sangre de Lady Eleanore de Canterville, asesinada en este lugar en 1575 por su marido, Sir Simon. Él desapareció misteriosamente, y su espíritu culpable recorre el castillo desde entonces. La mancha no se puede borrar.

—Tonterías —dijo Washington, y sacó del bolsillo un frasco—. "Quitamanchas Campeón Pinkerton". Lo limpia todo.

Frotó, y la mancha desapareció. Justo en ese momento, un trueno sacudió el castillo y la señora Umney se desmayó.

A la mañana siguiente, la mancha había vuelto. Washington la limpió. Al otro día, estaba otra vez. Y otra vez la limpió. Era evidente que algo raro pasaba en Canterville. Pero a los Otis, más que miedo, les daba curiosidad.`
      },
      {
        title: 'Un fantasma muy ofendido',
        illustration: 'luna',
        content: `Esa noche, a la una de la madrugada, el señor Otis se despertó por un ruido de cadenas en el pasillo. Abrió la puerta y vio a un anciano espantoso, de ojos rojos como brasas, pelo gris enredado, ropa antigua hecha jirones y cadenas pesadas en las muñecas y en los tobillos.

—Estimado señor —le dijo el señor Otis con toda amabilidad—, le pido que aceite esas cadenas. Hacen un ruido terrible. Le dejo este frasco de "Lubricante Sol Naciente Tammany". Dicen que con una sola aplicación es suficiente.

Lo dejó sobre una mesa y volvió a la cama.

El fantasma se quedó paralizado de indignación. ¡Él, Sir Simon de Canterville, que había asustado a reyes y duquesas durante tres siglos! Furioso, tiró el frasco al piso y se fue gimiendo por el pasillo, con una luz verde espectral. En lo alto de la escalera, los mellizos lo esperaban: le tiraron dos almohadas a la cabeza. El fantasma tuvo que escapar atravesando la pared.

En su cuarto secreto, Sir Simon repasó su carrera con orgullo herido. Había hecho que una dama se desmayara viendo un esqueleto en su sillón. Había vuelto loco a un mayordomo con una mano verde golpeando la ventana. ¡Y ahora unos norteamericanos le ofrecían aceite!

Decidió vengarse. Durante semanas preparó sus mejores apariciones: "El Muerto Sin Ojos", "El Fantasma del Bosque", "El Monje Vampiro". Pero todo le salía mal. Los mellizos le ponían trampas: le tendían hilos para que tropezara, le llenaban el piso de mantequilla para que resbalara, y una noche armaron un fantasma falso, con una calabaza por cabeza y un cartel que decía "Yo soy el verdadero fantasma". Sir Simon se asustó tanto con el fantasma falso que corrió a esconderse.

Al final, el pobre fantasma se enfermó de tanto disgusto. Ya casi no salía de su escondite. Sólo seguía pintando la mancha de sangre por las noches, con las pinturas que les robaba a la acuarela de Virginia, y como se le terminó el rojo, a veces la mancha aparecía verde, o incluso azul.`
      },
      {
        title: 'Virginia y el jardín de la muerte',
        illustration: 'bosque',
        content: `Una tarde, Virginia entró a una salita y encontró al fantasma sentado junto a la ventana, con la cabeza apoyada en la mano, mirando las hojas secas del otoño. Parecía tan triste que a ella le dio pena.

—Lamento mucho lo que le hacen mis hermanos —le dijo—. Pero usted fue muy malo con su esposa.

—Lo sé —dijo el fantasma—. Fue hace mucho. Y desde entonces no he podido dormir. Hace trescientos años que no duermo. Estoy tan cansado…

—¿Y no hay forma de que descanse?

El fantasma señaló un viejo vitral de la ventana. Tenía escritos unos versos antiguos:

"Cuando una niña rubia logre que rece un pecador,
cuando el almendro seco vuelva a dar flor
y una criatura llore por él con amor,
la casa entera tendrá paz y quietud".

—Significa —explicó el fantasma— que alguien tiene que llorar por mis culpas, porque yo ya no tengo lágrimas, y rezar por mi alma, porque yo no tengo fe. Y que tiene que ser una persona buena y valiente. Si vos venís conmigo al Jardín de la Muerte y pedís por mí, el Ángel de la Muerte tendrá piedad. Pero vas a ver cosas terribles en la oscuridad.

Virginia lo pensó un momento. Después se levantó.

—No tengo miedo. Lo voy a acompañar.

El fantasma le besó la mano con sus labios fríos como el hielo. La pared se abrió, y los dos desaparecieron.`
      },
      {
        title: 'El almendro florecido',
        illustration: 'castillo',
        content: `Esa noche, toda la familia buscó a Virginia por el castillo, por el bosque y por el pueblo. El señor Otis recorrió los caminos a caballo. Washington buscó en el estanque. La señora Otis lloraba. Nadie la encontró.

A la medianoche, cuando sonaron las doce campanadas, se escuchó un trueno y un canto lejano. Un panel de la escalera se abrió y apareció Virginia, pálida, tranquila, con una cajita en las manos.

—¿Dónde estabas? —preguntó su madre, abrazándola.

—Estuve con el fantasma —dijo Virginia—. Ya murió de verdad. Ahora descansa. Vengan, les voy a mostrar.

Por un pasadizo secreto llegaron a un cuarto escondido. Allí, encadenado a la pared, había un esqueleto antiguo. Era Sir Simon. Virginia se arrodilló a su lado y rezó en voz baja. Los mellizos, que miraban por la ventana, gritaron de pronto:

—¡Miren! ¡El almendro del jardín! ¡Está florecido!

El viejo almendro, que llevaba años seco, estaba cubierto de flores blancas a la luz de la luna.

Unos días después, enterraron a Sir Simon en el jardín, bajo el almendro. Virginia puso sobre la tumba una corona de flores. La cajita que el fantasma le había dado estaba llena de joyas antiguas, un regalo de agradecimiento.

Desde entonces, nadie volvió a ver al fantasma de Canterville, y la mancha de la biblioteca desapareció para siempre.

Años más tarde, cuando alguien le preguntó a Virginia qué había pasado aquella noche, ella sólo sonrió y dijo:

—El fantasma me enseñó qué es la vida, qué significa la muerte y por qué el amor es más fuerte que las dos.`
      }
    ],
    quiz: [
      { question: '¿Cómo reaccionó la familia Otis ante el fantasma?', options: ['Se fueron del castillo', 'No le tuvieron miedo y lo trataron con humor', 'Llamaron a un cazafantasmas', 'Se desmayaron'], correct: 1, explanation: 'Le ofrecieron lubricante para las cadenas y quitamanchas para la sangre.' },
      { question: '¿Qué le hacían los mellizos al fantasma?', options: ['Le daban regalos', 'Le hacían bromas y trampas', 'Le tenían miedo', 'Lo ignoraban'], correct: 1, explanation: 'Hilos, mantequilla y hasta un fantasma falso.' },
      { question: '¿Qué necesitaba el fantasma para poder descansar?', options: ['Una cama nueva', 'Que una persona buena llorara y pidiera por él', 'Que lo encerraran', 'Asustar a alguien'], correct: 1, explanation: 'Así lo decían los versos del vitral.' },
      { question: '¿Qué señal mostró que el fantasma había encontrado la paz?', options: ['Llovió', 'El almendro seco floreció', 'Apareció la mancha', 'Sonó una campana'], correct: 1, explanation: 'Era una de las señales de la profecía.' }
    ]
  },
  {
    slug: 'los-guardianes-del-bosque-de-arrayanes',
    title: 'Los guardianes del bosque de arrayanes',
    author: 'Valeria Etchart',
    synopsis: 'Durante las vacaciones en Villa La Angostura, Juli y su primo Nico recorren el Bosque de Arrayanes, un lugar único en el mundo. Pero descubren huellas de algo que no debería estar ahí: alguien está poniendo en peligro el bosque. Con la ayuda de una guardaparques, tendrán que actuar rápido.',
    genres: ['Aventura', 'Naturaleza', 'Exploración'],
    gradeMin: 4, gradeMax: 5,
    cover: { scene: 'bosque', c1: '#d4a373', c2: '#2d6a4f' },
    chapters: [
      {
        title: 'Árboles color canela',
        illustration: 'bosque',
        content: `Juli había visto muchos bosques, pero nunca uno así. Los troncos de los árboles eran de color canela, lisos y fríos al tacto, con manchas blancas como si alguien los hubiera pintado con pinceladas. Se retorcían hacia el cielo, y la luz que pasaba entre las hojas tenía un tono dorado.

—Son arrayanes —explicó Rocío, la guardaparques que guiaba al grupo—. Este bosque está en la península de Quetrihué, en el Parque Nacional Nahuel Huapi, a orillas del lago. Es uno de los pocos lugares del mundo donde los arrayanes forman un bosque entero. Algunos tienen cientos de años.

—¿Por qué los troncos están fríos? —preguntó Nico, el primo de Juli, que tenía las manos apoyadas en uno.

—Porque la corteza es muy fina y el árbol tiene mucha agua adentro. Por eso también se llama "quetrihué": en la lengua mapuche significa algo así como "lugar de arrayanes".

Caminaban por una pasarela de madera que serpenteaba entre los árboles.

—¿Y por qué no se puede caminar por afuera de la pasarela? —preguntó Juli.

—Porque las raíces de los arrayanes son muy superficiales y delicadas —dijo Rocío—. Si miles de visitantes pisaran el suelo, el bosque se moriría. La pasarela protege a los árboles.

Juli se agachó para mirar el suelo entre las tablas. Y vio algo que le llamó la atención: un pedazo de papel plateado, como el envoltorio de una golosina, y más allá, la marca de una zapatilla en la tierra húmeda. Alguien había salido de la pasarela.`
      },
      {
        title: 'Huellas en el lugar equivocado',
        illustration: 'montanas',
        content: `Al día siguiente, Juli y Nico volvieron al bosque con sus papás. Juli no podía dejar de pensar en la huella. Esta vez, en el mismo lugar, encontraron más huellas, y un sendero de ramas rotas que se metía entre los arrayanes.

—Alguien camina por adentro del bosque —susurró Nico.

Siguieron el sendero con la vista, sin bajarse de la pasarela. A unos metros, entre las raíces, vieron un círculo de piedras ennegrecidas y restos de ceniza.

—¡Hicieron fuego! —dijo Juli—. ¡En medio del bosque!

Los dos sabían, porque se lo habían enseñado en la escuela, que en la Patagonia los incendios forestales son uno de los peores peligros. El viento sopla fuerte y, en verano, una sola chispa puede quemar miles de hectáreas en pocos días. Un bosque como ese, que tardó cientos de años en crecer, podría desaparecer en una tarde.

Nico sacó el celular de su mamá y sacó fotos: las huellas, el sendero, las cenizas.

—Hay que avisarle a Rocío.

Corrieron hasta la oficina de guardaparques, en la entrada del bosque. Rocío miró las fotos con el ceño fruncido.

—Esto es muy grave. Hace días que encontramos basura en lugares raros. Pensamos que eran visitantes descuidados. Pero un fogón… eso significa que alguien está pasando la noche dentro del bosque, y está prohibido.

—¿Quién haría algo así? —preguntó Juli.

—No sé. Pero lo vamos a averiguar. Y ustedes me ayudaron muchísimo: tienen buen ojo de guardaparques.`
      },
      {
        title: 'La noche del viento',
        illustration: 'luna',
        content: `Esa noche, el viento empezó a soplar con fuerza. Desde la cabaña, Juli escuchaba cómo sacudía los árboles. No podía dormir. Pensaba en el fogón.

Por la ventana se veía la costa del lago y, del otro lado, la oscura silueta de la península. De pronto, Juli vio un punto de luz anaranjada que titilaba entre los árboles.

—¡Nico! ¡Despertate! ¡Hay fuego en la península!

Despertaron a los adultos. El papá de Juli llamó enseguida al número de emergencias de los guardaparques. Rocío atendió en segundos.

—Ya salimos. Gracias por avisar tan rápido.

Los chicos, desde la ventana, vieron cómo una lancha de los guardaparques cruzaba el lago con sus luces encendidas. El punto de luz se movió, como si alguien corriera con una linterna. Después, la luz anaranjada se apagó.

A la mañana siguiente, Rocío vino a la cabaña. Tenía cara de cansada, pero sonreía.

—Llegamos a tiempo. Eran dos campamentistas que se habían metido en el bosque para pasar la noche "en un lugar mágico", según dijeron. Hicieron un fogón para calentarse. Con el viento, unas brasas habían prendido el pasto seco. Lo apagamos antes de que llegara a los árboles. Si nos avisaban media hora más tarde, hoy no tendríamos bosque.

Juli sintió un escalofrío.

—¿Y qué les va a pasar?

—Van a tener que pagar una multa importante y hacer trabajo comunitario en el parque. Pero sobre todo, espero que hayan entendido algo: un bosque no es un decorado. Es un ser vivo muy antiguo, y es de todos.`
      },
      {
        title: 'Guardianes',
        illustration: 'bosque',
        content: `El último día de vacaciones, Rocío los invitó a una actividad especial. En un vivero del parque, les mostró unas plantitas chiquitas, en macetas, con hojas brillantes.

—Son arrayanes bebés. Crecen muy, muy despacio. Este, que tiene apenas veinte centímetros, tiene tres años. Para que llegue a ser un árbol como los del bosque, van a pasar décadas.

Los ayudaron a plantar algunos en una zona que había sido dañada hacía años. Juli cavó con cuidado, puso la plantita, la tapó con tierra y la regó.

—Cuando seas grande —le dijo Rocío—, podés volver a visitarla. Para entonces, apenas va a llegarte a la cintura.

Antes de irse, Rocío les dio a los dos un pañuelo verde con el escudo de Parques Nacionales.

—Esto es para los guardianes honorarios del bosque. Ustedes vieron lo que otros no vieron, avisaron a tiempo y no se pusieron en peligro. Eso es lo que hace un buen guardián.

En el auto, volviendo a casa, Nico iba callado, mirando por la ventana las montañas y los lagos.

—Juli —dijo de pronto—, ¿sabés qué me di cuenta? Que proteger la naturaleza no es sólo cosa de los guardaparques. Es no tirar basura, quedarse en los senderos, no hacer fuego donde no se puede. Cosas chiquitas que hace todo el mundo.

Juli asintió y se ató el pañuelo verde en la muñeca. Pensó en su arrayán, tan chiquito, que iba a crecer despacio durante cientos de años. Y se prometió que, algún día, iba a volver a verlo.`
      }
    ],
    quiz: [
      { question: '¿Por qué los visitantes deben caminar por la pasarela?', options: ['Porque es más rápido', 'Porque las raíces de los arrayanes son delicadas y superficiales', 'Porque hay serpientes', 'Por la lluvia'], correct: 1, explanation: 'Pisar el suelo dañaría las raíces y el bosque podría morir.' },
      { question: '¿Qué pista encontraron los chicos que indicaba un peligro?', options: ['Un nido', 'Restos de un fogón dentro del bosque', 'Un árbol caído', 'Un mapa'], correct: 1, explanation: 'Hacer fuego en el bosque está prohibido y es muy peligroso.' },
      { question: '¿Por qué los incendios son tan peligrosos en la Patagonia?', options: ['Porque no hay agua', 'Porque el viento fuerte los extiende muy rápido', 'Porque hace frío', 'Porque no hay árboles'], correct: 1, explanation: 'Con el viento, una chispa puede quemar miles de hectáreas.' },
      { question: '¿Qué entendió Nico al final?', options: ['Que sólo los guardaparques cuidan la naturaleza', 'Que cuidar la naturaleza es tarea de todos con acciones cotidianas', 'Que los bosques crecen rápido', 'Que no hay que ir de vacaciones'], correct: 1, explanation: 'Pequeñas acciones de todos protegen los bosques.' }
    ]
  },
  {
    slug: 'codigo-colmena',
    title: 'Código Colmena',
    author: 'Ana Sol Quiroga',
    synopsis: 'En el año 2090, en la ciudad de Nueva Córdoba, ya casi no quedan abejas: las flores las polinizan miles de abejas robot. Pero un día los drones empiezan a fallar y las cosechas peligran. Lara, una chica fanática de la programación, descubrirá un secreto en una terraza abandonada.',
    genres: ['Ciencia ficción', 'Naturaleza', 'Aventura'],
    gradeMin: 4, gradeMax: 5,
    cover: { scene: 'robot', c1: '#ffd60a', c2: '#2a9d8f' },
    chapters: [
      {
        title: 'La ciudad de los zumbidos metálicos',
        illustration: 'ciudad',
        content: `En el año 2090, la ciudad de Nueva Córdoba zumbaba. Pero no era el zumbido de las abejas: era el de las Polinas, unas abejas robot del tamaño de una uña, con alas transparentes y un cuerpito dorado. Había millones. Volaban de flor en flor en los campos y en los invernaderos verticales, llevando polen de una planta a otra.

Lara, de once años, las miraba todos los días desde la ventana de su escuela. Sabía mucho de ellas, porque su mamá trabajaba en la Central Polina, el edificio desde donde se controlaba todo el enjambre.

—Hace cincuenta años casi no quedaban abejas de verdad —les había explicado la maestra—. Los pesticidas, la pérdida de flores silvestres y el cambio del clima las hicieron desaparecer en muchos lugares. Y las abejas son muy importantes: sin polinización, muchas plantas no dan frutos. Gran parte de lo que comemos, como manzanas, tomates, almendras o zapallos, depende de ellas.

—Por eso se inventaron las Polinas —dijo Lara.

—Exacto. Las Polinas salvaron las cosechas.

Esa tarde, Lara fue a buscar a su mamá a la Central. En la gran sala de control, las pantallas mostraban mapas del enjambre: millones de puntitos dorados moviéndose. Pero algo andaba mal. En un sector del mapa, los puntitos se habían vuelto rojos.

—Fallas —dijo su mamá, preocupada—. Desde hace tres días, cientos de Polinas se apagan en pleno vuelo. Y nadie sabe por qué.`
      },
      {
        title: 'Un error en el código',
        illustration: 'robot',
        content: `Las fallas siguieron. Cada día, más Polinas caían al suelo como granizo dorado. En los invernaderos, las plantas de tomate florecían pero no daban frutos. Las noticias empezaron a hablar de "la crisis de la polinización".

Lara no podía quedarse quieta. Le encantaba programar: en su habitación tenía una computadora vieja con la que armaba juegos y robots pequeños. Le pidió a su mamá que le mostrara el código de las Polinas.

—Es muy complicado, Lara. Hay equipos enteros de ingenieros revisándolo.

—Por favor. Sólo quiero mirar.

Su mamá le dio acceso a una copia de prueba. Lara se pasó dos noches leyendo líneas y líneas. Y encontró algo. En una actualización reciente, alguien había cambiado la forma en que las Polinas calculaban su batería: ahora volaban hasta las flores más lejanas para "aumentar la eficiencia", pero sin dejar suficiente carga para volver a las estaciones. Se quedaban sin energía en el aire y caían.

—¡Mamá! ¡Es un error de cálculo! ¡Les falta batería para volver!

Su mamá miró la pantalla, en silencio. Después llamó a su jefe. En una hora, los ingenieros confirmaron el error y prepararon una corrección.

—Lara, encontraste lo que cincuenta ingenieros no vieron —le dijo su mamá, con los ojos brillantes.

Pero cuando enviaron la corrección, descubrieron un problema más grande: miles de Polinas ya se habían perdido, y fabricar nuevas iba a llevar meses. La cosecha de este año estaba en peligro.`
      },
      {
        title: 'La terraza secreta',
        illustration: 'huerta',
        content: `Un sábado, Lara fue a visitar a su abuelo Ernesto, que vivía en un edificio muy viejo del centro. El abuelo había sido apicultor cuando era joven, antes de que las abejas desaparecieran.

—Abuelo, ¿vos extrañás a las abejas de verdad?

El abuelo sonrió de una manera rara.

—Vení. Te voy a mostrar algo, pero es un secreto.

Subieron por una escalera oxidada hasta la terraza del edificio. Lara se quedó con la boca abierta. La terraza estaba cubierta de flores: lavandas, girasoles, salvias, tréboles, plantas de tomate y zapallo, todo mezclado, desordenado y hermoso. Y entre las flores, zumbando, había abejas. Abejas de verdad, peludas, con rayas negras y amarillas.

—Hace veinte años encontré un enjambre perdido en un árbol de la plaza —le contó el abuelo—. Lo traje acá. Les planté flores de todo tipo y nunca usé un solo pesticida. Fueron creciendo. Ahora hay seis colmenas.

Lara se acercó despacito. Una abeja se posó en su mano, caminó un poquito y se fue volando hacia una flor de lavanda.

—Abuelo, ¿y si hay más terrazas así? ¿Y si la ciudad entera se llena de flores para que las abejas puedan volver?

El abuelo la miró con los ojos húmedos.

—Eso es lo que soñé toda mi vida.`
      },
      {
        title: 'Una ciudad que florece',
        illustration: 'huerta',
        content: `Lara preparó una presentación para la escuela. Mostró fotos de la terraza del abuelo, explicó el error de las Polinas y propuso un plan: crear "corredores de flores" en las terrazas, plazas y balcones de toda la ciudad, sin pesticidas, para que las abejas reales pudieran volver a multiplicarse.

—Las Polinas son una gran herramienta —dijo frente a todos—. Pero no pueden reemplazar a la naturaleza. Si dependemos sólo de una máquina, y la máquina falla, nos quedamos sin nada. Necesitamos las dos cosas: tecnología y abejas.

La presentación llegó a las noticias. Después, al gobierno de la ciudad. Y un mes más tarde, Nueva Córdoba lanzó el programa "Código Colmena": cada edificio que plantara flores para polinizadores recibiría semillas gratis y ayuda de expertos. El abuelo Ernesto fue nombrado asesor oficial, y les enseñaba a los vecinos a cuidar colmenas.

Esa primavera, las Polinas reparadas volvieron a volar. Pero, por primera vez en décadas, no estaban solas. En las terrazas, en los balcones y en las plazas, se escuchaba otro zumbido: más suave, más irregular, más vivo.

Lara, desde la terraza del abuelo, miraba la ciudad llenarse de manchas de colores.

—¿Sabés qué es lo mejor, abuelo? —dijo—. Que yo arreglé un código de computadora. Pero las abejas tienen el código más antiguo de todos, y ese nunca falla, si las dejamos vivir.

El abuelo se rió y le pasó un frasquito de miel dorada, la primera cosecha del programa Código Colmena.`
      }
    ],
    quiz: [
      { question: '¿Por qué las abejas son tan importantes?', options: ['Porque hacen ruido', 'Porque polinizan las plantas y muchas frutas dependen de ellas', 'Porque pican', 'Porque comen insectos'], correct: 1, explanation: 'Sin polinización, muchas plantas no dan frutos.' },
      { question: '¿Qué error descubrió Lara en el código?', options: ['Las Polinas no veían las flores', 'Volaban demasiado lejos sin batería para volver', 'Eran demasiado lentas', 'Picaban a la gente'], correct: 1, explanation: 'Se quedaban sin energía en pleno vuelo.' },
      { question: '¿Qué secreto tenía el abuelo Ernesto?', options: ['Una fábrica de robots', 'Una terraza con flores y colmenas de abejas reales', 'Un laboratorio', 'Un invernadero de Polinas'], correct: 1, explanation: 'Cuidaba abejas sin usar pesticidas.' },
      { question: '¿Qué propuso Lara?', options: ['Fabricar más robots', 'Llenar la ciudad de flores sin pesticidas para que vuelvan las abejas', 'Prohibir las flores', 'Mudarse al campo'], correct: 1, explanation: 'Propuso combinar tecnología y naturaleza.' }
    ]
  }
];
