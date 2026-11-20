Basics components

### From

Create `components/timerForm.tsx`.

Requirements:

- centered at the page
- range section with two numeric inputs
- unit section with seconds or minutes to choose from (under numeric inputs)
- start button under inputs

### Timer
Create `components/timer.tsx`.


Simple timer that counts down. If unit is seconds it shows seconds, if minutes is shows minutes and seconds. 

Agruments to timer compoents are: min, max, unit. Based on that random timer is generated within these ranges. after timer stops there is and relaxing sound(3s) and another randomly generated timer starts counting down. 

- pause button under the timer, that stops present timer
- play button under the timer, that resumes a paused timer


Do not build actual dialogs yet.

### Check when done

- Form is present at main page
- when clicking start button timer is displayed and it starts counting down
-when timer stops there is an audio sound and after that another timer starts
-when pause button is clicked timer pause
-when play button is clicked a paused timer resumes

-no typescript and eslint errors

