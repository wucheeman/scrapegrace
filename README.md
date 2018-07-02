![Scrapegrace Banner](banner.png)

## What the project does
This is an implementation of the Mongo Scraper, done as homework for the February 2018 UNC Coding Boot Camp. Scrapegrace News scrapes the pages of the Durham Herald-Sun for news of Chapel Hill, North Carolina. On the backend, it uses Node.js, MongoDB and Mongoose, and Express. On the frontend, it uses Handlebars and a bit of JQuery.

## How to get started with the application
The app is available on Heroku at [https://multicultural-poutine-95784.herokuapp.com/] As long as you have the dependencies listed in package.json, you can also download the app and run it locally.

Let's assume that you are going to look at the application on Heroku. Once you click the link, your browser will open in the Heroku app. It may be slow at first, as Heroku has to start up a new virtual machine to host the application.

After the page opens, you'll see the app's banner, along with a green button that says 'Get News', just as it appears above. The banner's background color is the official 'Carolina Blue'. Most people reading this won't know or care, but around these parts, that color is a big deal.

Click the button, and Scrapegrace will scrape the current on-line version of the Herald-Sun for Chapel Hill news. It will not download duplicates of articles that are already in the database. Once it's done scraping, it will display all the articles in its database. If you'd like to see those that are already available and not bother looking for new, just append '/articles' to the URL. Please don't click the 'Get News' button more than once. The Herald-Sun doesn't update the Chapel Hill news that often, and it's unlikely that you'll get anything more than you did with the first click. There's no need to hit the Herald-Sun's server unnecessarily.

Displayed articles have a headline, a summary and, possibly, a comment. Sometimes the summary will cut off mid-word. If so, that's the Herald Sun's summary; Scrapegrace brings you all the summary that's available.

If you'd like to read a full article, click the green 'Read Article' button to its right. It will open a new tab and take you to the Herald-Sun's page. If there's an infuriating comment already present, you may delete it with the red 'Delete Note' button. If you'd like to leave your own infuriating comment, feel free to enter one. It will replace an existing comment, if there is one. Be aware that the next person to come along may delete or replace what you write, so try to be so memorable that he or she will want to leave it in place.

## Authors
This application was built and will be maintained by Mark Hainline. Help should not be needed, and will not be available.
