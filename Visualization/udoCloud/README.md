## Setup

Inside this udoCloud project, first run `npm install` and then copy 
the `db.json` file from the drive into the `static` folder

## Run

Once you've installed all dependencies and provided the server with the 
database secrets, you can start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev --open
```

## Use case
it makes sense to visit the wordCloud first. After selecting the wanted range 
the cloud should be visible.

Hovering over the bubbles should lend more information about the word. If the
word is particularly interesting you can click on it. This will automatically
open the timeline for this word. There should be drawn a line chart. 

At the input area you are able to select multiple words or topics for comparison.
Clicking on a datapoint inside the line chart will print all the related article's
hrefs below the chart.