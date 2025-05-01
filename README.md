# Resume Builder

Un día me levanté y dije *«que flojera cambiar mi currículum»*, así que pensé
*«soy desarrollador, puedo hacer un programa que genere currículums por mí»*,
y eso hice.

Este programa fue creado para generar mis currículums vitae sin tener que estar
moviendo mucho para que mi currículum se vea bien, o tener que generar varias
versiones diferentes del mismo currículum para trabajos específicos.


## Comandos

Este programa usa **npm** por defecto. Si quieres usar otro administrador de
paquetes, adelante, pero no aceptaré pull requests que tengan que ver con ello.

- `npm run dev`: inicia el programa en modo de desarrollo.
- `npm run dev:watch`: lo mismo que el comando anterior, pero también ejecuta
**nodemon** para ver cualquier cambio.
    - Requiere tener **nodemon** instalado globalmente, si no lo tienes
    instalado, ejecuta `npm i -g nodemon`.
    - Para que **nodemon** haga efecto, ejecuta `npm run tscw` en una consola
    aparte.
- `npm run tscw`: compila el backend en modo de vigilancia.
- `npm run make`: compila el proyecto para ser usado en modo de producción.


## Contribuciones

La verdad, el proyecto lo hice por puro gusto y flojera de usar Word o Inkscape
para hacer mi currículum, y me sorprendería que alguien se interesara en
contribuír en esto.

Si quieres contribuír al proyecto, antes de hacer un pull request, primero abre
una nueva issue y explícame qué cambios propones para el proyecto.

### Instalación

Después de clonar el repositorio, ejecuta los siguientes comandos.
```bash
npm i
npm run electron:rebuild
```

### Reglas básicas

Todo código que escribas debe estar en inglés para tener coherencia con el resto
del código. Sí, es contradictorio, pero todo sea por tener las cosas limpias.

Los comentarios deben ser escritos en español para tener coherencia, la única
excepción son los encabezados de los archivos para cumplir con la licencia.

### Código generado por IA

Por favor, no abras ningún PR con código que haya sido generado por inteligencia
artificial. Los motivos por los que rechazo la IA son:

- Hay una gran chance de que el código generado sea de mala calidad o no
funcione.
- La IA generativa es básicamente un algoritmo de copia y pega, por lo que puede
generar código que rompa derechos de autor.
- Generalmente, quienes usan IA para programar realmente no saben qué es lo que
están haciendo, y mucho menos saben explicar qué hace su código.

Entiendo que hay desarrolladores profesionales que usan la IA para trabajar
más rápido y hacen código de buena calidad, sin embargo, mi experiencia
trabajando con gente que genera su código con IA ha sido un completo desastre.

Ojo, no estoy en contra de usar la IA como referencia para cuando uno se
encuentra atascado, eso no lo estoy rechazando, específicamente rechazo todo PR
que haya sido generado por una IA.


## Licencia
Este código está protegido bajo la licencia GPL-3.0, puedes leerla en
[LICENSE](./LICENSE).
