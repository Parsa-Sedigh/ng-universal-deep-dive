/* 1. Angular universal in depth - Helicopter view:
Angular rendering engine has 2 main cases: 
1) On the fly runtime server side rendering of app 
2) Build time only, in order to prerender the app a head of time.
The key feature of this new angular universal engine is that it's easier to use than before for server side rendering but especially for
pre rendering use case which is now better supported out of the box.

Also we can optimize the performance startup of angular app that uses angular universal by looking how to implement a dynamic application shell and
we will also look how to transfer the state from the server to the client using the state transfer API.
Also we'll look how convert an ng app to universal ng app by using angular CLI.

Advantages of using ng universal:
- improving the performance startup of our app
- compatibility with search engine crawlers and social media crawlers

Also we'll look all the changes that ng CLI did to our app whenever ng universal was added to it and we'll understand how the server side
version of our app works when compared to the client side version and how both versions are kept in sync by angular CLI build system.

We'll prerender our app at build time using ng universal. Also we'll look how to prerender both static and dynamic routes at build time using
Guess.js . After understanding how both prerender our app and server side rendered, we do a couple of optimizations. For that, first we're
going to talk about search engines. There, we understand how to optimize our app for search engine crawlers. Then make our app compatible with
social media crawlers that are trying to crawl our page and extract information from it, in order to display it better on social media.

After understanding how to optimize our app for search engine and social media crawlers, we implement a couple of commonly used performance
optimizations for ng universal apps like:
1) Allow our app to control on a page by page basis, exactly what content gets server side rendered or not.
That's because sometimes we might be doing too much server side rendering for certain pages that have a lot of content. So for those pages,
it would take a long time to server side render everything and it would produce too big of html payload to be send to the client and that might be
counterproductive to our overall goal of displaying some initial content to the user as soon as possible.
In order to solve this problem, we look how to control EXACTLY what content gets server side rendered or not on the page by page basis using
dynamic application shell which is based around angular custom structural directives.

2) Then we'll implement another common performance optimization which is usually needed in angular universal apps which is: When the app
starts up on the client, it might try to call the backend again and fetch again the data which that page needs. The problem with that is all the
data that we need, was already included on the server side rendered payload. So there's no need to fetch it again from the server.
In order to solve this problem, we use state transfer api.

At the end, we look how deploy an ng universal app to production using google cloud and the google cloud app engine for node platform.

Remember: We'll look how to do both server side rendering using a node server or build time pre rendering using the ng CLI and the
pros and cons of both modes of use for ng universal.

2. Nothing!
3. setting up your environment:
4. What is angular universal:
Angular universal is a server side rendering engine for angular. So what is exactly a rendering engine and what's the difference between
the client side rendering engine and a server side rendering engine? So what's a rendering engine in general?
Whenever we navigate THROUGH THE APPLICATION, the angular rendering engine is going to take the html template of the component that we navigate
to and also the data of that component that we navigate to and then, the angular rendering engine is gonna combine the template and data in order
to produce the actual html that we see.
So the rendering engine is the internal framework element that is responsible for transforming templates and data into actual html. So that was the
rendering process and the main responsibility of the rendering engine.
This rendering process can be either on the client side directly at the level of the user's browser, OR it can also be done on the server side.
In traditional server side apps such as a php app, the rendering happens always on the server side. So the server is going to receive the
incoming request via the browser url address bar and then the server is going to determine what templates should be rendered. Then the html is
gonna be produced on the server and it's going to be sent over the wire to browser. The browser is going to parse the html and then display the
page to user.
So that's what happens with most of the apps that we browser through on the web and with most of the websites in general. So most of the internet,
uses server side rendering.
This isn't like a typical angular app. In a typical angular app and also in other apps that use react, vue or ... the rendering process happens on
the client side, directly on the user's browser.

Let's look how client side rendering works. Now while app is running, if you look at developer tools elements tab, you see all the html and css that's
applied to that page.
Important: But if you now click on view page source by right clicking on window, you can see the html that we got from the server, when we refresh
 our browser. So when you reload the page, we're going to get some html from the server and that can be seen using the view source option.

If the angular app isn't universal, the html that we have received from server only contains an empty <app-root> and everything else is either
the title of the page, some metadata inside <header> and some <script> tags which contain angular framework and our app code.
This means what we typically receive from the server in a normal angular app is essentially an empty html page without any content.
So the question is, where is all the content that we see on the page, coming from?
Well, the html was not received directly from the server over the wire, after we hit the reload button of browser. Instead, our app is gonna
fetch from the server those empty tags which we saw in page source and also lots of js which are specified in <script> tags in that page source and
also some css and that's the page that we're gonna display initially to the user.
That would be essentially an empty html page, without any content. Then the angular app is going to start up and we're gonna do http request(s)
to backend to fetch some data. You can see the request(s) at network tab of devtools and in it's xhr tab.
The angular rendering engine is gonna take the data that we got from backend, also it's gonna take the multiple templates that we have defined
in our app and it's gonna transform the template and the data into actual html that we see on the page, just like it will happen in typical
php app but this time(in angular), the rendering process of producing the actual html happened on the client side using JS runtime engine of the
user's browser, instead of happening on the backend on our server.

So the rendering process in the web application can happen either on server or on client. By default in a normal ng app, the rendering process
will happen ONLY on the client. However sometimes we have some reasons to render our app on the server instead of the client.

Recap: Angular universal is an angular rendering engine that allows us to render an angular app on the server instead of the client and actually
angular universal is even more than that. We don't have to use angular universal necessarily on the server, instead we can use it at build time of
app to prerender the app multiple routes and serve those directly as plain html files.
So instead of saying angular universal is a server side rendering engine for the angular framework, it's more accurate to say that ng universal is
a node based rendering engine for angular that can be used either for server side rendering or for build time pre rendering of an angular app.

So we found out what ng universal is, but now let's look when we need ng universal and why and ... .*/
/* 5. Why angular universal - performance benefits:
We'll look at 3 main reasons for using angular universal.
1) First reason and the main one is you want to improve the preceived performance on mobile and low power devices of your app.
You want to be able to show some initial content to the user quickly.

2) search engine optimization
3) Facilitate web crawlers for example from social media apps.

About first reason: Remember in a typical ng app, whenever we reload the app(also in our initial request in when we want to see the website),
we get a response from server which that response is essentially an empty html page(so whenever we reload the app, in response to our initial
request to server, we get essentially an empty page) and we can view it by clicking on view page source.
There we only have an empty <app-root> and we don't see any html of the app. That means that this is a typical client side rendered app and it's
the default behavior of all angular apps that don't use ng universal. So in that case, we get an empty page on initial request.

The problem of this type of apps is because we only receive blank page from the server initially, we don't really have anything to show to the
user while the app is starting app. So while the js bundles and css bundles are getting loaded in the background, we don't have any content
to show to the user because the initial page is a blank page and this might cause a preceived performance problems on mobile devices or low powered
devices. Devices that work over a more constrained network than the typical desktop computer will struggle into providing a good UX to the user.
So we only have a blank page to show to the user, which means that from the point of user is going to look and responsive and
the website might look broken for 5s or ... , while the app loads only when the angular framework kicks in and takes over the page, after that,
angular performs it's initial backend request(s) in order to fetch data, only then, we will have sth to show to the user. This UX is not ideal
especially on mobile because the users might think that the app is broken and slow in general.

Let's simulate the loading of app in a mobile device with a limited network.
Now if you're currently running your app, it probably is in development mode and we started it using npm start or ..., but this command can
already allow us to understand how slow this type of app(without universal) might look to the user over a slow network.
For that, open network tab, click on online(which online means network is working as usual) and select fast 3G. With that, we simulate a typical
mobile connection. Also we're going to profile our app(not using universal currently) and see exactly at which moment, the user will see some
meaningful content on the screen. We do that by going to performance tab and click on screenshots and then click on refresh icon which is
start profiling and reload the page.
With those, we're going to get a performance profile of our app over a slow network.
Now we see the typical blank page that the user will see on a mobile, while spa app is getting loaded. So we already have the empty page that
we got from the backend and page contains no content that is visible to user. On the background, the js bundles containing angular framework are
getting loaded, our app is also getting loaded, css is also getting loaded. After sometime, the angular framework will kicked in and take control
of the page and it may perform some network requests to get data from backend and then we show content to user.

Also remember we're currently in dev mode and actual performance of app in a production server would be better, because we would using angular in
production mode and not development mode. But still it would take a lot of time between the initial network request and the moment when user
would see some content on the screen.
We saw these 2 key moments in performance tab and by hovering over the diagram(and we see the snapshots or screenshots of page because we turned on
the take screenshots option):

First contentful paint: The moment when the user sees at least something on the screen that is not a blank page. So when we see at least some content
on the screen.
First meaningful paint: The moment when user sees full content of the page(so when he sees full content above the fold).

On the diagram you can click on network dropdown and see the requests that the app did. We see the first requests were made when we got the
blank index.html page from backend.
Also there, you can see bundles of js are loaded from almost beginning of diagram. So fetching those bundles took time.

How ng universal helps us with this problem?
ng universal is a rendering engine that we can use on the server side at runtime to reply to those requests on the fly. Let's say server
supports ng universal. In that case, when server receives the request for let's say for root of website, it can render the angular app on the
server and immediately return all of the html. This means that from the first moment that we receive the response from server, we will already
have some html to display to the user at least. This means from point view of user, the amount of time that the user would see a blank page,
would be much smaller and app would seem much faster and responsive.

Another way that we could use ng universal in order to address this problem would be to do some pre rendering of our app.
So let's say our app has multiple routes such as for example / and serveral pages like /courses/01 , so we could also use ng universal to
pre render those multiple routes. c
That means we could use ng universal to generate the html for all those entry points in our app and in that example, for home page, some of the
courses and ... . Then we would store that rendered html in a file on the file system and we would deploy all of that to our web server.
Then our server would be able to server our SPA as a static file just like it's doing for our index.html . So we would not even need a server
to RENDER each request on the fly. We could do everything based on pre rendering only. In that alternative case, we would use ng universal at
build time whenever we deploy a new version of our app and not at runtime, which would be the case when we're using server side rendering.

So as we can see, ng universal is not synonymous with server side rendering, it's simply a rendering engine that can be used for both
server side rendering and pre rendering. So in latter case, we can pre render multiple routes and serve them as static files created at build time.

Currently we understand the main reason of why using ng universal is really to improve the UX and preceived performance of our app.*/
/* 6. Why angular universal - social media crawlers:
We looked at most crucial reason for using ng universal which is app performance startup. So whenever the app starts up from an empty index.html , we want
to avoid having to show to user for long periods of time, a blank page.
As we seen, ng universal allows us to avoid that problem by serving to the user IMMEDIATELY some html. That html can either be produced on the
server using the ng universal rendering engine AT RUNTIME, or it can also be produced at application BUILD TIME using pre rendering with ng universal.

The second reason is enabling social media crawlers. But what are social media crawlers?
They're server side processes that connect to a given website and extract some content out of it, typically to build a social media post.
If you go to see a post on medium, you see text of blog, it's image and ... and also series of social media buttons. They're integrated via some code that
we can obtain from social media site. For example if you click on tweet button, you go to twitter and then it creates a draft of the the text of blog and also
it's image and ... . Now the question is, how could twitter build that draft post?
That was done by twitter social media crawler. So whenever we click on the tweet button back on the original article, we have sent a request to twitter to crawl that
page. So twitter has retrieved a version of that page from it's server(in that case, the server of medium) and it has crawled it, in order to extract
a title, an image and ... .

Now how did twitter find out exactly what image, what url and what description to add to the social media post which was created and is ready to publish by us, when we clicked
on tweet button?
So let's understand how that was determined by twitter crawler(which was a process that connected to our website in order to inspect the page that
we want to tweet about.)
Let's go to that article which we wanted to tweet about and twitter shows an overview of it, when we clicked on tweet button and in elements tab,
search for keyword "twitter" and you'll see that page has series of <meta> tags which target the twitter platform. For example in one of them we have
<meta property="twitter:title" content="..."> which is the title of pre composed tweet(the tweet we can create and actually it would be automatically
created by twitter and set some content of it by twitter), also it has <meta property="twitter:description"> which is for the content of description box
which that box is below the image of article in the tweet. Also we have <meta name="twitter:img:src" content=""> which is the url of the image of article
and ... .
So on all of those twitter specific <meta> tags, we have all the necessary information in order to compose the tweet we want to make, about that
article. Also the user can still add it's own content in that tweet, but everything else has been fetched from medium website(also in future, from our
website) via the twitter social media crawler, by inspecting the content of those <meta> tags.
Now if a page doesn't contain a <meta> tag, then the twitter crawler is going to try to guess a good title for the page based on, for example on the
structure of the page. So if it has a <h1> tag the crawler would get that tag for title of pre composed tweet, it's also going to try to extract
an image and ... .
So the twitter crawler crawls our page in order to prepare a tweet that we want to send with a title a link and a picture and ... .

Therefore in order for twitter crawler to work well, the crawler needs to receive some html from the url tht it's trying to crawl.
Now if twitter crawler currently tries to crawl an app like a default ng app(without SSR or pre rendering), then that crawler would receive a blank page
FROM SERVER(because it's a server side action). So that blank page, has no special <meta> tag such as twitter meta tags(so if it had those special tags,
crawler would crawl easily) and it also doesn't contain any html(like an <h1> or ... in order to crawler guess the title and ... based on html).
Why it can't? Because it wants the content that it can see on page source(which that page source is empty for a normal SPA).

So twitter crawler won't be able to process that page and extract titles, images and ... . Because all of the html currently is going to
be calculated at runtime. Social media crawlers are currently not compatible with pages that rely heavily on JS. So if all the content of the page is
rendered via JS, then the crawler isn't going to be able to process that content properly.
Important: The crawler needs the content of the page to be served directly on the HTML retrieved from server.
All other social media crawlers, such as facebook crawler and ..., they all work in a similar way. So they need to receive some html in order to be
able to extract the content of post(or page) correctly.
So another reason for using ng universal is to make the app easily compatible with social media crawlers. We want to be able to serve specific <meta> tags
to different platforms and we need to do that on the SERVER instead of on the client. If we alter the content of <meta> tags on the client, then the
crawler isn't going to pick up that new value. Important: It only takes into account the values that are coming from the SERVER.
So as you saw, compatibility with social media crawlers is another reason for wanting to use ng universal, but of course it only makes sense if your app
is publicly reachable from the internet. That means certain pages of your app, at least are reachable without the need for the user to be
authenticated.
In blog post example, a blog post is available on public internet and the authentication at least on the blog post is optional and you can still see the
content without being authenticated. But on other hand, imagine an ng app that needs authentication for most of it's pages. Then in that case, that app
can't be integrated with social media crawler, because that crawler won't be able to see the content of those pages due to the fact that they're
protected from unauthenticated users.*/
/* 7. Why Angular Universal - SEO or Search Engine Optimization:
The third reason for using ng universal is SEO for search engines other than google search engine. Search engines work in a similar way with social
media crawlers. So a search engine also has crawler. The goal of the search engine crawler is to be able to extract enough information about the
page, in order to be able to add it to the search engine index and at list the page in related search results.

Let's see if google search engine can index SPAs that initially serve an empty page without any content. For that, let's find an SPA app without
using universal on google and search one of it's pages. The ng website is a SPA without any SSR rendering. If you search sth that is in angular.io ,
the first result might be that website. If you click on it, we're going to see that page is indeed an empty html page that we got from SERVER that THEN
bootstrap the angular framework onto the page and the framework pulled all the text that you see on the page, from backend in a separate AJAX request.
Let's confirm the things I said is true.
So click on view page source. Indeed! This page is an empty page (initially) and there's hardly any content in it. You just see a series of <script> tags
for example the runtime-.../js and polyfills-.../js , but other than that, all we have is an empty <aio-shell> tag(application shell tag) without any
html inside it. So all the html that we see on the page, came from the server in a SEPARATE AJAX request and that html was not served on the INITIAL RESPONSE
that we got from server, when we loaded that url to see the page, so the actual html of page came from another request(So first, we request for
page and when it comes with JS bundles and ... the ng framework took place and requested those html).

Now let's try to search for a string that's part of that page, to confirm that indeed this page is being correctly indexed. So let's try to
take a random sentence from that page and paste it in google search engine. So in google page, first type angular and then paste that random sentence
from the page of angular.io , after that, you see that the same exact page is getting indexed correctly. Because the first results angular.io and the
page that we were on it and we even see that sentence we paste in search engine as the description of that google result.

So that proves without any doubt, that the google search engine has absolutely no problem for indexing SPA apps that even don't have any content
served on the initial request(initial request is the request for the url that we're on it, but in a normal ng app, that request has no html and that
html comes from a separate request so those are SPA apps that only returns an empty page from SERVER- so their content is produce by JS).
So the google search engine crawler KNOWS how to WAIT FOR ALL THE JS ON THE PAGE TP BE LOADED and it KNOWS HOW TO WAIT FOR AJAX request to COMPLETE,
in order to check if the content of page has been modified, then the search engine crawler is going to index the FINAL content of the page which is
now loaded and processed by JS and not the empty page that was received from server.
So if you're looking to have your app indexed on google search engine, you DON'T need to use ng universal for that. But what about other search engines?
Other search engines that are popular in many countries don't have this capability yet. They work still a bit like social media crawlers which needs
html to be present on the response from SERVER. So let's prove those search engines don't work well with SPA apps that are rendered on the CLIENT.
So copy a random text from angular.io and prefix it with angular search it on baidu.com and you don't get any result from angular.io !
That proves that search engine can't index JS heavy pages currently. Bing and duckduckgo can index SPA apps even if they don't use universal.

So in future, the need for using ng universal for SEO won't matter anymore. That's why we presented this reason as the LAST reason in our list. Today
it's less and less crucial to SSR rendering for SEO reasons. Many of most popular search engines today are already capable of correctly indexing JS
heavy pages. Today the main reason for using ng universal is performance aspect(we want to show user, content as early as possible and best way to
do that is to serve user some html on the INITIAL REQUEST-UX of app) and also we want our app(if it's publicly accessible) to be crawled to be called by
social media crawlers. So those were 2 MAIN reasons.*/
/* 1. Setting Up Angular Universal with only one CLI command - Demo:
How take a normal app which is not being server side rendered and add universal to it and start rendering it ALSO on the server and we CAN also
pre render it at build time which this brings us the best of both worlds. It means:
With new ng universal we can create an ng app that returns A LOT OF HTML when it gets first loaded from server and therefore having great startup performance
and therefore being SEO compatible and also compatible with social media crawlers without for us to have to use a node server on backend to RENDER the
app in response to an http request. This means we can have an ng app up and running in production, without EVEN needing a node server at runtime.

Currently we want to add ng universal to an existing ng app. First let's confirm that the app we have running, doesn't have any SSR yet.
Important: For that, we need to click on view page source and then we can see the html that we have received from server. Currently as expected,
 we see a plain SPA app without any SSR. Because <app-root> which contain our ng app is empty.
Also angular is loaded via <script src="runtime.js"> , <script src="polyfills.js"> , <script src="styles.js"> , <script src="vendor.js"> and
<script src="main.js"> tags, then angular takes over the page, it makes some backend HTTP request which we can confirm they were done using
network tab and then refresh the page to again send those requests and see them in xhr tab and then angular render those data on the page by generating
DOM nodes that correspond to the data that we want to display using template files.
Important: So frontend angular rendering engine that is running on the browser, doesn't generate html DIRECTLY. Instead, the ng client side rendering engine
 is gonna produce the dom nodes directly, that those dom nodes then get applied to the existing DOM.

As I said, the blank page that we're receiving from server comes with some disadvantages. Namely, the app is going to be displaying a
blank page at startup time which might be confusing and make user thinks app is slow and unresponsive. Also the blank page isn't a SEO friendly or
social media crawler friendly.
Now let's turn this ng client app into a server side rendered app.

Now from where your package.json is, run: ng add @nguniversal/express-engine and after that you have a ready to use ng universal app.

Now let's confirm we can server side rendering. For that, go to package.json you can see we have series of ng universal specific npm scripts.

build:ssr builds our server side rendered app. It will first build the frontend and then it builds the server part of our app.
serve:ssr enables us to serve  the production version of our ng universal app.
prerender command, enables us to prerender the ng app at build time.
dev:ssr is development version of our ng universal app and we can run our ng app in hot reload mode. It means whenever we make a change to app, it applies
the same change both to the client part and to server side of app.

Now if you run dev:ssr and click on view page source which contains the html returned by development server, we see unlike before, we got a lot of html
from server. We see a lot of css and it's appended to ng app at build time and if you scroll down, you see the html of app.
You see <app-root>. Now if you search for <body>, you see we have a lot of html inside of it.

So the html that we're receiving from ng universal live dev server, is no longer an empty blank html page and now it's a full html payload that can
Important: be DIRECTLY passed to the browser and browser can display to user, the complete app, IMMEDIATELY at app startup.
So by running a single ng CLI command can transform our standard ng app to an ng universal app. Now we need to understand how ng universal work and
what changes were made to our project in order to enable SSR.

2. Understanding Angular Universal - What are the Client and Server Applications:
What did that ng add... command do exactly to our project?
One of those changes was a couple of ng universal specific npm scripts added to package.json .
Before executing that command, our app only had one angular root module which was app.module . That was the only APP module(of course we could have
feature modules and ..., but we only had 1 APP module) of our app before running that command. After that command we have 2 app.module that exist
in parallel in our project.
Important: The new app.server.module contains the EXACT components of the ng client side app which are also in angular client side application or
 app.module . So what's the difference between these two applications(app.server.module-the server side app and app.module-the client side app)?
 Well, the client side app(app.module.ts) is the ng app that is running on the browser AFTER the app has bootstrapped itself onto the page.
 So that's a SPA app containing all comps and ... . So the app.module corresponds to the ng app that we see running on the client side.
But what's the new server side app or app.server.module?
If you look at imports array of app.server.module , you see AppModule which means the server side application has ALL the same comps that our client side
angular application has.
Important: So app.server.module has exact same comps of client side app and also it bootstraps the exact same root comp(app.component) . BUT
 each of those two apps has two completely different builds. Those builds are configured in angular.json .
There's separate TS configuration for each build (tsconfig.server is TS configuration for server app).
So we have two different angular apps(one for client side and one for server side) on the same project with the exact same tree of comps and
those two apps have two separate builds which managed transparently by ng CLI.

What's difference between these two apps and in which context, each of those applications being used?
Angular client side application is the plain angular pp that's controlling the page, AFTER angular framework has bootstrapped itself onto the page and
took control of the whole DOM. So angular client side app works like any other SPA. But what's ng server side application that contains the exact same
component tree?
Well angular server side application is a node application that is not going to run in the browser and it's only gonna to be run on the server side either
at the nodejs process running on our backend, or at build time using the ng CLI for building our app.
Learn: So the server side angular application is gonna to be responsible for taking a given route of our app and is going to render the html
 of that particular route and it's also going to add all the css which that particular route with it's particular set of components needs, in order to
 get rendered by browser immediately when the html payload hits the browser.
So angular server side application will never run on the client and it will produce actual html.
Again, angular server side application which is corresponding to the app.server.module is gonna responsible for generating html and also for identifying
the css needed by the app and adding that css to top of the html page, in an inline <style> tag. So that <style> tag is inside <head> tag.

As we can see, angular server side application and angular client side application are two completely different applications that run on two
completely different contexts. The client side app runs in browser and is responsible for, for example handling browser user events like click event.
But server side app is only run on the server and it's only responsibility is to produce the html and css that correspond to a particular angular route.

Now how do these apps(server side and client side) interact with each other? Do they interact at all? Also what's the difference in configuration
between the app.server.module and client side application module or app.module? How is it possible that these two completely different applications that
do completely different things have such similar configuration?*/
/* 3. Understanding Angular Universal - Client and Server Runtime Interaction:
So in previous lesson, we said: whenever we add ng universal to an app, we actually have two applications with two separate builds and each of
those applications(client and server apps) have their own application root module. But how do they interact at runtime?

Let's visit configuration of server side application root module and compare it to the configuration of client side root module.

We can see in order to configure our application server module(app.server.module), we only need to import the client side application(AppModule) and
also the ServerModule to imports array of app.server.module . The reason behind why we need so little config in order to define our server side
application when compared to the client side, is because we're using powerful DI mechanism of angular.

If you go to ServerModule docs of angular.io , you see that module is gonna contain a series of angular injectable services(some providers).
For example in SERVER_RENDER_PROVIDERS, we have all services that the angular framework needs in order to render an ng comp, ON THE SERVER SIDE.
Or in SERVER_HTTP_PROVIDERS we have a series of http injectable services like for example the angular HttpClient that we need in order to do http
requests on the SERVER instead of client.

Now our client side application, instead of using the ServerModule, is gonna use BrowserModule. The BrowserModule contains a completely different
set of injectables. The BROWSER_MODULE_PROVIDERS contains all the necessary services that the angular framework needs to render ng comps ON THE BROWSER(
client side) as opposed to server.

So AppModule receives via the BrowserModule, a series of injectable services that allow the angular framework to work in a browser context. Those
injectable services will know how to render a particular component into DOM nodes, so they can be directly injected onto a running angular page.

On the other hand, the application server module is going to receive via ServerModule, a series of injectable services that allow the angular framework to
render comps on the backend. That means, transforming a particular tree of comps which belong to a particular angular route, into html, in it's text form,
plus the css needed, in order to render that html properly and it's going to produce a FILE or an html and css payload that can be sent in ONE go(so the
reason that it uses inline <style> tag and not another file, just for css, is that it needs to send all of the generated stuff, in one file), to browser.

So the ng framework is leveraging the DI mechanism in order to create two different apps with very different rendering capabilities, one for running on
server and the other for running on client, but both them sharing the exact same list of comps.

Now how do these two applications interact?
Well, whenever the server side application(remember, we have 2 apps) renders a particular angular application route, it's going to produce a file,
containing both the styles needed to render the page and also the html at the bottom of that file(we can see that file by clicking on view page source).
So that file is the typical output of an angular universal server app.
That embedded <style> tag is part of that file itself and it's unlike the external stylesheet that you can see which is on a separate <link> tag.

Now how these two apps interact?
Well, first the ng universal server side app, typically in response to an http request, is going to produce that file with html required for that route
and the css needed for that route, first. That file contains the html and css needed to bootstrap the angular app on the client side. That file is then
sent over the wire using http protocol to the user's browser. Then the browser is going to parse that html and because all the html and css are present
on the body payload, the user is going to IMMEDIATELY see sth on the screen, just like a static html page. Then the angular frontend app is gonna get
started and it's gonna take over the page. So that html payload which received from server, is gonna include all the JS needed for angular, to run on the
client side(so as we understood, in both the non universal angular and universal one, in the first response from server, whether we're using universal
or not, we're gonna receive some <script> tags which contains the actual JS for bootstrapping angular on client side. But in universal one, we also
gonna get some html and correspond css which is inside an inline <style> tag, in order to immediately show user some content. But in that case, we also
get an external <link rel="stylesheet"> element, besides the inline css too. But client side angular app will get rid of all that inline css because
it's duplicated. So that css just is used in order to show user some content immediately and I think it would be deleted by angular after it kicks in and
from there it shows the styles.css styles, instead of that inline css which was sent from server. Also we have that external <link rel="stylesheet"> in an
non angular universal app.). That means all the angular comps and all the essential comps and services of the angular framework that are needed
for angular to run correctly on the browser, is included on the <script> tags of that payload.

Once the client side angular app is ready to take over the page, the first thing that application will do is to remove those embedded styles from the page.
Because they're duplicate from the styles that were loaded via <link rel="stylesheet" href="styles.css"> external stylesheet.
The angular client side app is gonna look for the styles with particular identifier(<style> tags with the ng-transition="serverApp" attribute) and
it's gonna remove them from the page and leaves only the styles from the external stylesheet.

But how does the client side app know which styles to remove?
That's configured via the importing of BrowserModule. In a normal ng app(without having universal), the BrowserModule is simply imported like: BrowserModule .
But in an ng client side app that interacts with the server side app with it's server side version, then we configure the BrowserModule like:
BrowserModule.withServerTransition({appId: 'serverApp'}) , In order to get started with the server transition configuration and in {}, we have the
configuration of angular server app, that has been initially created on the server side.

So whenever the angular client side app takes over the page, it's going to go to the DOM and remove all those embedded styles.
From there, the ng client side app is gonna take over the page and everything will work like any other ng SPA. All the rendering of future rout transitions,
such as for viewing a given course and ... , everything will be taken care of, by the client side app.

The server side application was ONLY used for producing the html payload of the INITIAL request that loaded the app onto the browser.

Summary: In an ng universal app, you always have 2 applications. You have a normal SPA app which is your app.module that RUNS ON THE BROWSER and
you have also kinda a twin server side version of the SAME application that imports that AppModule in it's imports array and that server side app,
contains the same tree of comps.
The difference between two applications is the injectable services that they receive from the angular framework. The server app receives services that
allow the app to run on server side. Meaning it can produce html and it CAN do http requests on a node environment and it gets all of that via ServerModule.
The client side app receives the services that it needs to run on the browser.

The serverside app is responsible ONLY for producing the html and css needed to display the page the FIRST time to the user and it will include on that html payload,
all the css(both external link to styles.css and embedded css) and JS tags, needed for the client side app to be loaded onto the page.
Once the clientside app takes over the page, everything works like a normal angular app.
Besides the setting up the angular server app and the server side builds, the ng add command that we have used to add angular universal to our app, it also
created a series of npm scripts.*/
/* 4. Angular Universal Hot Reload Mode and Production Build:
By running that ng add command, we have created a new twin version of our angular app. Application server module(app.server.module) contains the exact
same comps as our client side app. Because in app.server.module we imported AppModule(which this module has all comps of our overall angular app) therefore in app.server
we have exact same comps of app.module .

If we want to build the server side part of our angular app, we can run: npm run build:ssr
That command is going to start by FIRST building the production version of client side app. So ng build --prod part of build:ssr command, builds client
side app. So by running npm run build:ssr , first the client side part of app is build and then the server side of app is gonna built using
ng run <name of project>:server:production .
Important: So client side app is needed in order to create the server side version.
Our angular.json file has all the necessary info, in order to know how to use <name of project>:server:production compilation target in order to produce the server side
version of our app.
Once that build:ssr command is finished, we get dist folder and inside of it, we have another folder with name of our project and inside of it,
we have 2 separate folders, one for browser part of our app and other for server. In browser folder, we see a typical build for an angular CLIENT SIDE app.
There we have index.html which is the single page of our app and also all the JS and css bundles needed for app to run on browser, like main, polyfills and runtime.
So if we were serve this(just browser folder) from an http server, we would get a plain angular app. But that browser part was used in order to produce the server side twin
version of it.
So the main.js file in server folder of dist, contains a node server that we can start, in order to serve ng app from a node server.

serve:ssr is gonna start out server side angular app in production mode(port 4200 is usually used for client part of the app). So it's gonna start a
node express server.

After running those commands(build:ssr and serve:ssr), if you click on view page source, you can see all the html and css, needed to display IMMEDIATELY some content
to user and also you see in initial payload, all the styles of the server side app in INLINE styles inside the <style ng-transition="serverApp">
(however we also have an external <link rel="stylesheet" href="styles. ... .css"> which client side ng will remove those inline styles and instead use this external css).

After that, the client side part is loaded via the <script> tags which we received from server(it doesn't matter you use SSR or not, those <script> tags will always be
received) has taken over the page and therefore after receiving the response for initial request, again we have a plain client side ng app.
So the client side rendering engine is now rendering parts of the page directly on the browser, based on the templates of our ng comps.

The only difference between SSR app compared to a normal SPA is that we didn't receive from the server, an empty html page. Instead, we received a lot of
html.

Now if you inspect the page(don't use view page source here, because that would show the html we received from server, not the current html) after receiving the
response of initial request FROM SERVER, you see that the styles that we received inline in our original html payload, now if you search ng-transition in inspect code,
it's no longer present. So that confirms that the client side part of our app and the server side part have interactive.

On our express server running on backend, the server side build of our app was used in order to produce an html payload. That html and css payload that we got over the wire,
is used immediately to display some content.
Meanwhile on the background, the ng app has bootstrapped itself via the <script> tags of the page and it has taken over the DOM. From that moment, the ng client side app
removed from the DOM, the inline styles that were used, JUST to show the user some initial content. So those styles are no longer needed, because that CLIENT app LOADED
(it loaded All the necessary styles, so we don't need them anymore)all the necessary styles via a <style> tag. Because the external stylesheet that was loaded,
contains all the styles of app. Therefore we don't need the inline styles that were used in order to display the initial content to the user.

What dev:ssr command does?
It's gonna run our app in hot reload mode. Meaning this command is gonna track the file system for changes to for example some of our ng comp. When that command the
file was changed, then the hot reload server is gonna trigger a new build for our app. That new build is gonna build both client version of our app and also
the server side version. So the two builds(the client build and the server build) are gonna be triggered in parallel in response to a given change.
So we have both client and server versions of our app, being hot reloaded, meaning if we do a change, it will hot reloaded our app and it means, both client and
server version have been rebuilt and our server side app is now in sync and the client side is not reloading and after that reload, we can see the new changes.
That was hot reload mode with ng universal server.

5. Understanding In Detail the Angular Universal Express Server:
By adding ng universal to our app using CLI:
1) Some npm scripts added 2) The application server side module added which is the twin version of app.module and has the exact same tree of comps.
Important: So the application server side module is our server side application, works in a node environment and allows us to render a particular route of our app(which was
 requested from client side(if you aren't using prerender), so it would render that requested route, on the fly(because we're not using pre rendering)) into plain html and
 css.
3) Besides setting up the server side application, the ng cli also has set up a build for the server side app. So whenever we build our project, we're gonna
be able to build both the client side app and the server side app at the same time.
4) Besides having the server side app and setting up a new build, we also have a series of useful npm scripts.
Both dev:ssr and ng serve runs app in hot reload mode, first for SSR using app.server.module and second for client.

At runtime, we're receiving the html from a server, but the question is, which server? and how that live development server run exactly?
That live development server is using our server side version of our app for doing SSR. But where's that server?
5) When we added ng universal, we added a small express server that uses the server side version of our app in order to generate the server side rendered html that
we see on our live dev server.

Whenever we have a build of our app(server side build), for example we have the build of our server app(which is in dist/server/main.js) and using it, we can render
a particular route of our ng app. Now we know the @angular/platform-server package of angular has a function called renderModuleFactory() .
That function allows us to give it a moduleFactory which is the main.js file which is the output bundle of our SERVER SIDE app and the url we want to render and ... ,
the output of that function is gonna be a promise which resolves a string eventually and that string is the fully rendered html and css for that particular route(url that
we gave).
So that function is the heart of angular universal. It takes an output server bundle and an app route(a url that the user could have typed on the address bar) and it
outputs the rendered html that then we receive over the wire(and that's why it's a promise) and display on the browser.

So the express server, internally uses the renderModuleFactory() .
The server.ts renders an angular application on the node backend, using ng universal.
The main functionality of that server is encapsulated in the app() function. The app function is gonna used to initialize an instance of our server
(const server = app()) that we then setup to listen.
We need the client side JS and css bundles(the html isn't rendered yet! Because y default it isn't in browser bundle, because the server isn't generated it yet!, instead
we have the original index.html which is empty in beginning and we take a reference from it and assign the path to that original index.html, to index.html
variable) that we can grab via distFolder variable.

Also we need to pass an original template to renderModuleFactory() . Because as you see on angular docs, we need to pass renderModuleFactory() a document which is
our index.html (also we need to pass it the html that we need to render).
So we need both the server side app(which is main.js file and in docs is specified as moduleFactory), the document and the url.

We already have one of the ingredients that we need to pass to renderModuleFactory() , which that ingredient is index.html or the document that we want to fully
render and we assign it to indexHtml variable.

Next(after assigning dist/browser folder to distFolder and getting the original index.html and assign it to indexHtml), we need to setup the express framework
in order to handle http requests. So we're gonna setup express engine.
Important: In server.engine('html', ...) , 'html' means that we should apply ngExpressEngine to all requests that end with html .
So if we request from our SERVER, the index.html, we should be using there(in server.ts file I guess) the express engine, in order to render a response.
That expressEngine internally uses renderModuleFactory() in order to take our server side bundle, a given url that we're sending to the server such as /about and the
index.html which we assign a path to it in indexHtml variable, and then that expressEngine is gonna render out the server side RENDERED output(so we have a server side
BUNDLE and a server side rendered html) that we're then gonna receive on the browser.

Now we need to setup that new render engine(expressEngine- actually we passed 'html' to app.set()'s second arg TODO) as the 'view engine' of express framework.
So this way, express knows exactly how to render html requests. We're doing it in app.set('view engine', 'html');

We also need to inform express where to find the templates that it needs, in order to render our views. In our case, that's gonna be in our dist folder
which we have a path to it in distFolder variable. We're doing that in server.set('views', distFolder);

Now we need to tell express how to link(match the incoming req and the code that's gonna handle it) a given http req that it receives incoming,
to the code that's gonna handle it on the server. (For that first let's link a given http request that needs a static file, to a middleware of express, that
handles static files, as below:)
We're gonna first define how to serve static files. Those static files are for example the static js and css bundles that our app is gonna load at
runtime.
Important: Let's remember that we do receive html and css in browser, using ng universal and we're gonna display that immediately to user, BUT THEN via
 <script> and <link rel="stylesheet">(or <style>?) we're gonna load the CLIENT side app from the backend as well, via the bundles that are in dist folder.
 Once those bundles arrive at the frontend, then the client side application is gonna take control of the page.
So that's how express knows how to server those static bundles. So it's gonna take them from the dist folder and it's gonna serve them with
a cache control header with an expiry of 1year(maxAge: '1y'), meaning that the bundles(static files) are gonna get cached on the client side and they're
gonna remain cached. Also we can see that we're serving every request that has a dot on it(*.*) using that static file express
middleware(server.get('*.*', express.static(...))) .

So if we load from our server, a static bundle like .../styles.css then that request, actually requests for styles.css . Because it contains a dot, it's
gonna get mapped to '*.*' express route and then the requested(in our example, styles.css file) file is gonna get served as a static file from the
dist folder directly.

Now besides configuring how to handle static files, we're also gonna need to configure how to handle requests such as /about request.
All of those requests are gonna handled via '*' route and it's route handler and what route handle is gonna do, is it's gonna take the index.html
and it's gonna render that html file, using ngExpressEngine(that we setup in server.engine(...)), which is based on ng universal and we're gonna pass
to that engine, a couple of things. First we pass the ongoing request(req) to it, so by doing that, the engine knows what is the URL that needs to be
rendered and then we're gonna provide a couple of other ng universal specific configuration params(providers: [...]). Now with that, our express server is
ready to be used.

The key thing to understand is, that express server is gonna map http requests to the code that handles that request on our backend(server.ts).
Any requests like /about, are gonna get mapped to app.get('*', (req, res) => {...}) which is using the ng universal ngExpressEngine which this engine knows
how to render ng apps using our server side application bundle.

The static files are gonna served directly from the dist folder which includes JS and css bundles.

Recap: Whenever we add ng universal to our app, we set up these:
- A server side app which is a twin version of our client side app but working on the server and it outputs plain html and css
- We set up a new build that is gonna build that is gonna build that server side application
- We setup an express server that can be run as a node process and it's gonna be in charge of taking any requests sent by the browser(usually the
initial reqs, other reqs are handled on browser and won't send to that express.ts) and outputting corresponding generated html on the node server

We can do server side rendering by using RUNTIME rendering via that express server, but another alternative is to do pre rendering. With that
second way, we can have all benefits of ng universal without even running a server!*/
/* Section: 3. Angular Universal Prerendering:
6. 1. Angular Universal Prerendering - How does it work:
Important: One of the main use cases of ng universal is to enable ng server side rendering. SSR happens when we have a server, for example a
 node express server that accepts incoming request such as when user TYPES(not navigate through app on browser!) /about address on the address bar,
 the server is gonna receive that incoming req and it's gonna use the ng universal bundle and the ngExpressEngine, in order to PRODUCE an html response.
 So that's the typical on the fly SSR scenario that we tend to associate to angular universal and other SSR techs.
It turns out that this is not the only way to use ng universal. So besides having a server at runtime that renders the pages on demand for each http
request, we can also opt for pre rendering our app.

If we want to prerender our app, we need to find all the application entry points, such as the root of our app('/'), also for example '/about' is
another route of our app. Or whenever we click on view course button, we're gonna hit /courses/01 or ... .

Make sure you stop all development servers and then run npm run prerender.
After that, in dist folder, we'll have a fully pre rendered version of our app. So that was a full production version that was built by running
npm run prerender. So if you check dist/<name of project>/ , we're gonna see just like before, two folders. In server folder we have a production
ready express server, ready to be deployed and we can even run it locally using npm run serve:ssr , because if you look at command description in
package.json , we notice it's pointing to the main.js file at /dist/<name of project>/server .

Now if you look at contents of browser directory inside dist folder, you see index.html file of our SPA app and also several production bundles, like
production css bundle and also main.<...>.js , polyfills.<...>.js and runtime.<...>.js production js bundles. Those js bundles contain the client side
version of our application. So that client side app(which those js bundles contain that client side app, so they need to be loaded on browser in order to
that client side app take over the page) is the app which is gonna take control of the page, after all the scripts tags which those
tags point to those js bundles in dist folder, are loaded on the browser.

The index.html of our app corresponds to the NORMAL entry point of our app. Although the index.html file is still in browser folder, it's
the server rendered html file which isn't empty anymore because of SSR. So that was rendered using ng universal and the server side bundle.
So if you search for <body> tag, you can see a lot of html inside of it.
So what happened there, that we have now a non empty html file?
(In a SSR app, the index.html is empty in dist folder and it will be filled, if user actually sends a request to server and then ngExpressEngine has to
render that html and inline css and then send back to browser. But in a pre rendered app, those index.html files(yes fileS and not a file, because we would have
one index.html for every entry route of our app) are filled with html and inline css by default and the server side app will be used only in build time. But in
SSR app, the server side app will be used for each request of user.)
(I think the difference of pre rendering and server side rendering is in SSR, the html must be BUILT at runtime by ngExpressEngine and the server side
application of angular, but in pre rendering, the html files are already built in compile time and would sent back to user, when he sends a request to
server for seeing those pages.)
At runtime, that index.html is set to be pre rendered. So we didn't render that html using an express server and using the ng universal ngExpressEngine,
instead, we have used a build tool(which in this case was command line) in order to PRE render the html that we need in order to serve the root page of
our app and we have saved that html and also css(that we can find at top of the index.html file which is an inline css), inside that index.html .
That means if we would try to serve the content of browser folder in production from a production folder and if we would hit(write in address bar) the
root of our app, we would get serve that index.html which is a pre rendered file. So the user would immediately see sth on the screen.

Also notice there's an about folder in that browser folder and in there, we have a different index.html file. Now if you again search for <body> for that
index.html in about(a route of our application) folder, we see, that file is different than index.html which was in root of browser folder.
That index.html which is inside about folder, is gonna contain the rendered html that user needs, if he would access /about page DIRECTLY(and not by
navigating through the client side application). So imagine that the user, instead of typing the root of our app on the address bar(or by reloading the
/about), the user would instead type /about and then he pressed enter. Then in that case, that index.html in about folder, is the html that the user is
gonna receive, which that html contains ALL the html that user currently receives from our server side ngExpressEngine.

So currently we have 2 different ENTRY(that's because by TYPING in the url or reload the url, we're gonna receive those html files and not by
navigating through client side angular application - So those files are kind of an entry points(because users type in and then enter the websites) to
our app) points for our app. We have the index.html of our root page, containing all the html and we have a second version of our index.html page,
which corresponds to the /about route.

So what we did when we run npm run prerender?
We used angular CLI in order to produce on browser output folder(/dist/browser), a completely pre rendered version of our SPA. So we somehow
GUESSED what are the multiple entry points of our app, in this case, the root path and /about path(therefore for each of them we pre rendered an index.html
file, also some js and css bundles for entire CLIENT SIDE app(inside each index.html, we have some inline css just for that route and client side ng will
get rid of it when it will bootstrapped) in root of dist folder) and for each of those paths, we have used the angular server bundle of our app,
in order to pre render that particular route and we have saved that generated html and css into separate index.html files and we have placed them on
different folders.

The end result is that if we serve the content of browser folder from a plain static server(so that server doesn't have to be a node server and it can
be a plain static server), from there, we're gonna be able to access those different entry points simply by TYPING(and not navigating through client
side app, if you want to get html from SERVER) /about or just plain domain(for root entry point) on browser url address bar and we'll get back from
SERVER, a large html payload. So we won't be getting an empty html page like it would be the case in index.original.html which is the original version of
our app(and sits next to index.html in pre rendered dist folder) where we would get an empty page, containing only the application root(<app-root> and
the external css <link> tag and the <script> bundles which won't be completely loaded by user, immediately when user sees the page), instead, when we
browse our app(in pre rendered html files or SSR(this needs ng universal and an express server running)), we're gonna be able to get full
html and css payloads from our server, without even having to run an express server with ng universal on the backend(for pre rendering, but for
ng universal SSR, we need a node server running with ng universal- Important: So in SSR, we need an express server with ng universal on backend, in order
                                                                    to render the html files for requests of user).

So in pre rendering, ng universal was responsible for creating those htmls, but that happen at application build time and not at runtime.

So if after pre rendering and creating the dist folder, we start a static http server on browser folder of dist. For that, we're gonna
run: npm run serve:prerender (and not serve:ssr , that's for SSR ng universal) which is:
"serve:prerender": "http-server -c-1 dist/<name of project>/browser".
In this command, we're using a static server(http-server) which is great for development purposes and in -c-1 we say we don't want to cache any of the
files and in rest of command we're saying that we wanna serve the content of browser folder.

That command very quickly starts a new http server on port 8080 and if your port 8080 is already being used in your machine, then the http-server because
it's a development server, is gonna try to use 8081, 8082 and ... . That 4200 was also for our angular universal live dev mode server but here, that's a
completely different thing. Here we wanna run the production version of our PRE rendered app using npm run:prerender. Now if you see the html you
received from static server and see the <body> tag, we see a full html payload.

Now what happened after the html we received was served?(so the static server was sent the html to user immediately, and <script> tags were also
received but the client side app takes time to load in order to load the client side app)
The app was started up and the <script> tags were loaded from our server, so that production bundles contain the angular client side application which
meanwhile, took control over the page. Now if you click on routerLinks and after that click on browser's back button or again navigate to another route,
that's all being taken care of, by the CLIENT side application. The server side app was ONLY used at build time when we produced the content of browser folder
which is inside dist folder.(Assuming we're using an angular app which was pre rendered.) So in our frontend we have a plain ng app running.
Important: It's not being used at runtime AT ALL. But what happens if we hit the reload button of browser or type a route of app in address bar and hit
 enter?
 (So if for example the user is currently on /about and hit refresh or when user type /about in url, we're gonna serving the index.html
 file that was inside about folder).
 After doing that refresh or hitting enter on current url of address bar or typing another url and hit enter, we're gonna reload from the server, that
 page(about page) containing all the html needed to display the /about page.
So if you look at view page html and search for <body> and search for content you see on page, in the html of view page source, you're gonna see
that html, you see that corresponds to html of about page(and we're also requested for /about page FROM SERVER by reloading that page or
typing /about and hit enter).

Summary: Whenever we load (or reload(which will cause to get html from server)) the root of our app which corresponds to '/' or ('') address, then
we're gonna load the index.html from our static folder(the index.html which is in root of browser folder). But if we type on the browser address bar
'/about'(and then hit enter), then we're gonna load (the content )of index.html inside about folder.

As you can see, using ng universal pre rendering, we can have a fully rendered app in production serving large html payloads to users, without having
to run a node server. So we don't have to worry about starting or stopping that server. Also we don't have to worry about deploying that server
to a nodejs hosting service. Instead, we can use a plain static content server such as Apache or AWS, so we can serve that content from anywhere.
Those are just static files and therefore there's no node server runtime.
Not having a node server, in order to RENDER our application at runtime means that we'll never have to worry about performance issues in a node server.
We'll never have to worry about memory leaks in a node server and also we won't have to deploy and maintain that server in general or upgrading it
over time and ... .

Also serving those files statically is always gonna be much faster than to server side render those files. So that means that we can with ng universal
pre rendering, get the best of both worlds. We have static files in our app, so we have a super fast UX. We don't have a node runtime comp and we're
STILL giving to the user best UX and the user is getting a full payload of html and css, in order to be able to see sth quickly on the screen which is
exactly what we were looking for while using ng universal.

Now we need to know how to render dynamic routes. */
/* 7. 2. Angular Universal Prerendering - Angular Router Integration:
We're gonna understand the relation between ng universal pre rendering and ng router and we're gonna look how to do dynamic route pre rendering.
So we understood whenever we have executed prerender command, in dist folder, we have created a pre rendered version of our ng app.

In dist/browser, you can see that we have a pre rendered index.html for the root entry point of our application, but we also rendered an index.html for /about route.
So that index.html inside about folder is gonna get loaded from our static server whenever the user types /about address on address bar and hit enter (or
reload the page when he's on /about route).

Now we can understand very good the prerendering command, pre rendered the root entry point of our app(which is the index.html file inside root of browser folder),
but how is it possible that the pre render command also knew about the '/about' route of our app?
So it seems that whenever we're running npm run prerender command, we're first inspecting the content of angular router configuration and
determining what are the multiple routes that need to be pre rendered.
So it's like, npm run prerender, somehow inspects the routing config of our app which is available at app-routing.module which is inside src/app and from there,
npm run prerender, is determining that our app has a root('') path and 'about' path and that those two paths need to be prerendered separately into separate index.html
files.

Let's confirm that npm run prerender is inspecting that file(app-routing.module I mean)(and it will create a new index.html file for each object which has path prop in
app-routing.module) by simply adding a new entry in our routing config. So let's add about-v2 as path value of new object of those routes, so we just want
to create a new route and we don't want to necessarily create a new component, so we just map that path to the same AboutComponent which we also used that comp for
path: 'about', so we just added a new route and not a new comp.
So that's just a quick test in order to see if when we pre render our app, we will also have in our pre rendered output, ANOTHER folder containing that new path.
So now after adding that new path, if you run npm run prerender again(that command needs to be executed from the root folder of our repo where the package.json file is
present.)
Now you can already even see on log of that ran command, you can see that there's a new index.html in dist/<name of project>/browser/about-v2(name of the new added path
prop.)
So that confirms that the ng cli prerender command and angular routing config are somehow integrated with each other and that static routes like the empty route path route
(or path: '') and path: 'about' (which cause creating the about folder in browser folder of dist) and new added route are gonna be automatically
included in our pre rendered output.

Now, even though npm run prerender adds to the output of the dist folder(output means the things that are in dist folder which are <name of project> folder and there
we have browser and server folders), several routes, those are only the STATIC routes of our app that can be determined JUST by inspecting app-routing file and it's
routes inside there.
Important: So we can see that there are no entries on the output folder(browser folder of dist) for routes that have dynamic stuff. For example like: path: 'courses/:id'
 Which corresponds to like <domain>/courses/01 So that route(or actually routes, because you can have multiple of those routes because it's a
 dynamic route, like /courses/01 or ...) is NOT gonna be pre rendered.
That's normal, because the content of :id (parameter) is a dynamic value and there's no way for ng cli at application build time, to know what are the possbile values for
those dynamic segments. So there's no way for ng cli, to also pre render those routes(the routes that have dynamic segments and ...).

Now the question is, what happens to our ng pre rendered app at RUNTIME whenever we try to access one of those dynamic routes?
Let's answer that by running our pre render server. So run: npm run serve:prerender . This command is gonna start the plain http server on the browser directory which is
inside the <project name> folder which is inside dist folder. So the browser directory, contains all of those static files(like the index.html for every static entry route and
also the external css bundle and js bundles and also the original index.html which it's name is index.original.html which the static root index.html and index.original.html
and js bundles and css bundle are in root of browser folder and also we have some other folders in browser folder, which they have a same name of our static routes and
those static routes are specified in app-routing.module which contain static index.html for that static route.).

Now let's see the behavior of that app in runtime after running that serve:prerender . Now if you reload or type and then hit enter the root of our app which is a
static route, it's working good. Also you can do the same for all other static routes.

Also if you previously added some static routes and then built the app npm run prerender but then removed that route from app-routing but you didn't run the
prerender command to build the app for pre rendering and run the serve:prerender command, you can still visit that removed static route, because we haven't executed
the build for prerender again, after removing that route. So the content of browser folder(maybe the content of server folder is different but we still have the
index.html file for that removed route, so we can still access that route at runtime) is still the same and means the about-v2 folder is still on our dist output folder.

Important:
 Now let's see what happens at runtime(when the app is running and serving from static server) if we access a dynamic route like /courses/01 .
 (This accessing has 2 ways( 1) through navigating our running CLIENT SIDE app(for example clicking on an <a routerLink=""> element)  OR,
 2) through typing the url of that dynamic route and hitting enter(through browser) or if you're on that dynamic page and press reload) after starting the application,
 because in that case, the angular frontend application is taking control of the page, we're gonna move to the correct course page and everything is ok.
 So we're at /courses/01 , but we only managed to access that dynamic page, because we have FIRST LOADED the WHOLE application at application route folder(or route) which that
 root route is a static route so we can access the website via pre rendered html(so we can access websites from static routes which isn't handled by client side angular, but
 from pre rendered html files(in case of runtime ng universal, that case would be handled by server side angular app, but in this new case, we don't have a server side running
 app, but instead static html files for static routes)) and from there)
 and from there, we had moved to the dynamic route.

Now what happens if we're on that dynamic page and reload the website(or type the url of that dynamic page and then hit enter, or enter the website from internet,
by clicking on that dynamic page route(for example we were on google and then ENTER the website through a link to a dynamic route of that website(I don't think if those dynamic
pages would be on google and indexed by google, but let's just imagine-in case of ng universal it definitely will be on google, because it would be indexed) will be
actually on google)))?

We're gonna see that page isn't available on our server. So we got back a 404 not found error.
That behavior is normal, because if you look at browser folder, we see that static server is serving static files from the browser folder of dist and in that browser folder,
indeed we have our root index.html, also we can serve the page if we refresh the /about page, because there we have an index.html for /about page which is inside about
folder and ... , but we don't have anything for /courses/:id to serve. So you can also see the log of server that the http get request from browser and the response for
that request which requested a dynamic route from static server(so it means it wasn't handled by client side app and therefore it was an actual request to server, so
server must handle it) and you can see the response for that request which is 404 which is logged on server and that's normal because in browser folder, a folder named
courses which should contain some content for requests to SERVER(and not handled by browser because in browser, the loaded client side app, can generate that request for
CLIENT side app by using it's JS bundles) and for /courses/01 route.

Now one thing that we can do to solve this issue would be to configure our production SERVER to serve back a fallback file such as the root index.html as fallback, in place
of SENDING(so if the user reload or type dynamic routes, the server will send the root index.html) a 404 default ugly not found to browser. So in that case, if a page
was not found by server, we would serve to user, the root page of our application which is the index.html file lives in root of browser folder.
BUT that's not good for UX right? So instead of doing that, we're gonna look how can we leverage the ng cli, in order to help us render DYNAMIC routes.

It turns out the same way that we can render a static route such as /about which lives in app-routing.module in form of {path: 'about', component: ...} and therefore
would have an index.html in browser folder of dist, we can ALSO prerender dynamic routes!!!*/
/* 8. 3. Angular Universal Dynamic Route Prerendering:
We understood how to use the npm run prerender command in order to have ng universal prerender our app and that prerender app would be in browser folder. There,
we have multiple rendered files for different routes of our application. But that prerender command by default won't render DYNAMIC routes, such as 'courses/:id' . So
that route won't be pre rendered and that's normal because there's no way for the pre renderer to guess the correct :id, those ids are present in a DB, so there's
no way for the pre rendering process to know that.

We can force the pre rendering of certain routes, besides the static routes by using an extra option on the prerender command. So let's configure it to prerender certain
dynamic routes. So pass in the routes option by saying: --routes /courses/01 . So that was a dynamic route that is not getting picked up by our pre rendering process.
Also we can add another route by adding another --routes option and this time let's render the route /courses/02(this could be also be 2, just look at your db or api to
find out which one.) for example.

Now let's prerender our app by running npm run prerender. In browser folder, you can see the pre rendered application and we have the same root index.html in root of browser
folder and other folders for our static routes and their index.html files, but now we have a courses folder too! and in there, we have two different folders which are
01 and 02 and each with it's own index.html . That means now, whenever the user tries to type in address bar and then hit enter or enter the website from google by accessing
/courses/02 or reload the /courses/02 page, now our static server is gonna have some content to serve back to user.

So if user tries to access <domain>/courses/02, the static http server is gonna look inside the browser/courses folder and then inside 02 folder and
as per the normal convention for static http files, when we try to access a FOLDER in address bar(for example when the user tries to access
<domain>/courses/01 from the server directly(because if it was asked from client side ng app, it was gonna create that html by using JS bundles(angular
framework and our codes and also the template of that component responsible for that requested route))), the server is gonna try to look
for a file named index.html, if on the other hand, we would have in place where 01 folder lives in server, another page beside index.html, for example
blog.html , then the static server could access that page if user was requested <domain>/courses/01/blog.html , but if user was requested
<domain>/courses/01, the server would try to look for an index.html in 01 folder of server. But if user was requested a specific file inside that 01 folder,
well, server will try to send back that specific file.
But in our case, because user is trying to access <domain>/courses/01 , he's only requesting courses/01 , so he's only trying to access a FOLDER and not a
specific file, the static http server BY CONVENTION is gonna know that in those cases, it needs to serve the index.html file.

So let's see those routes in action, so let's start our static server by running npm run serve:prerender . This command gonna start a small static
server which is gonna serve our pre rendered files. Now if you try to access those dynamic routes that you pass as --routes to prerender command,
in browser, byu typing those urls or reload their routes or enter website through those dynamic routes from google, you will get their index.html
pre rendered from the server for each dynamic particular course you wanna see.

So by typing the url and pressing enter or reloading those pages again or enter website through those routes, they haven't been generated on
the client and if you click on view page source, we see that indeed we got a fully rendered html page. Because if you search for <body> tag in that
view page source result, we can see all those html present on the page.

But if you now try to access /courses/03, that's not gonna work, because if you see inside browser folder, we can see that we have generated the 01 and
02 dynamic routes which is because in prerender command we just specified to prerender /courses/01 and /courses/02 ONLY and not /courses/03.

So what would happen in an app with a lot of dynamic routes? How would we manage that? Because having those dynamic routes specifically to prerender
npm script is not a manageable way to prerender a large application(with a lot of dynamic routes).

So if our app has a lot of dynamic routes, then in that case, what we can do is add a file to root of our project, which contains all the routes that we
want to prerender those routes, that file only has DYNAMIC routes. Because prerender command by default can inspect app-routing.module and guess
the static routes. So let's call that file, routes.txt and there we would have like:
/courses/01
/courses/02
/courses/03
...

So instead of specifying inside description command of prerender npm script, separate routes one by one, we can instead pass another parameter there
called --routesFile and for the value of that option, we pass the name of the file which in this case is routes.txt (I removed those multiple -routes
and their values from that command.)
So now the prerender command is: ng run <name of project>:prerender --routesFile routes.txt

Note that in our case, that routes file is constant and we written it ourselves, but we can easily imagine a more complex scenario where that file is
being dynamically built with each new production build by inspecting all the courses(dynamic routes) in a given DB and adding them to that routes file.
Then our build is gonna prerender all the routes inside that routes file.

Now if you run npm run prerender, now if we open dist and then <name of project> folder, we're gonna notice that inside the courses folder, we have
outputs for all courses that we specified in routes.txt file.
So we managed to prerender all those dynamic routes which are specified in routes.txt file. Now if you start again static server by running
npm run serve:prerender, then we have a server running on a certain port(usually 8080) and now if you reload /courses/03 or type that route and press enter
or enter website through that dynamic route(which all of these result in sending a request to server and asking about that dynamic route's html file)
we will get the index.html file for that requested route from server.
And we know after our index.html file gets loaded from server(which is the same behavior of SSR and also prerender. So both of those ways, send us a
rendered(in case of SSR)html payload or pre rendered index.html or html payload(in case of pre rendering)), the JS bundles are gonna get loaded
and after they loaded, the CLIENT angular application is gonna take over the page as usual.

Summary: With angular universal we have two ways of using it. Either we use it on server in order to dynamically render ON THE FLY user http requests and
generate an output html that the user can immediately see on the browser. But instead we can also completely pre render the application at BUILD TIME.
This second use case(of course IF it's doable for your app), has multiple advantages. One of the biggest advantages is that we don't need a NODE server
in production(but we do need a static server), therefore we don't have to troubleshoot memory issues, or troubleshoot performance issues in the server,
because we simply don't need it. Also the serving of the payload is gonna be faster. So it's much faster to serve static content when compared to
handling requests via a node process(SSR) and for the end user, the result is the same. Because they're getting that immediate html payload and being
able to quickly see sth on the screen and knowing that the app is up and running, while on the background, the angular JS bundles are still getting
loaded and the css of app is still getting loaded and eventually the angular client side application will as always, take control of the page at runtime.
This means that with ng universal pre rendering we can have best of both worlds. We can have all the advantages of using ng universal in terms of
preceived startup performance and UX, without having to run a node server in production.

Now we understood how ng universal works in it's two use modes which are SSR and pre rendering. Let's see what else can we do with it?
Let's start by looking how can we use ng universal in order to optimize our app for search engines and social media crawlers? */
/* 9. 4. Angular Universal and SEO - Search Engine Optimization Introduction:
We want to look how use ng universal in order to optimize our app for search engines and also look about compatibility with social media crawlers.

In order to understand how ng universal helps us with SEO(search engine optimization), we need to understand how search engines work and how do they
index our pages?
The results for a search on search engines, contain a link and each link has a title(you click on title of link to enter that website) and a
description(which is under that link title result).
Now how does the search engine know what to put as title of link? Because the content of title isn't necessarily present on the page that we can enter
that page by clicking on that title link. Also how does the search engine know what description to show to user?

Those search engine title and the description are presented as metadata on the page that by clicking on that title we can visit that page and those two
things(title of link result, present on google result and the description) are not visible html of that page, but they're present on <header> of the
html of the page that we get that html and that <header> from server(because the ng client side isn't loaded yet when we access that website through a
search engine results) whenever we access that page.
So the google search engine crawler is gonna go over our website and read the title and description from the html payload. Then it will inspect the
rest of the page and that page will then be added to search engine index.

So the title and description which are present on google results for a query that the user done, are very crucial for search engine and that's because
those two things are things that user is gonna see on the search engine results whenever the user types in a query.
So it's based on the title and the description that the user is gonna take the final decision on what link to click on search engine results.
Of course the first link on results is gonna receive more clicks than later links. But a lot of decision that the user is gonna take would be based on
the title and on the description. So those two things need to be filled in correctly with relevant content to entice the user to click on EACH page of
the website(because google index each page(at least the non required authenticate ones of our website and therefore the users can see each of them in a
search query, so all of those pages are crucial)).
EACH PAGE of the website should have it' sown custom title and description that matches that page.

Now let's go to see index.html file in src folder to see where those two information are coming from.
There, we have a <title> tag inside the <header> of our html page. Also the <body> contains the <app-root> which is our angular app, but it's empty.
Important: That <title> tag contains the text which is gonna be displayed to user, as the title of a search engine result. So that's where the search engine
 is looking for the title information. But yet we don't have a description tag, but we can add the search engine description by writing(maybe under the
 <title> tag):
 <meta name="description" content="...">
So that's the description which that web page is gonna be displaying on the google search engine, IF the google search engine would crawl that page.

Note: Other search engines also grab the title and description from that <meta> and <title> tags. But in particular case of google and several other
search engines, the description is not isn't always displayed. So the text that we specify in content prop of <meta name="description">, isn't always
what we see as the description in search results. Because many times google is gonna grab an EXCERPT of text from elsewhere on the page(currently our ONLY
page is index.html , so we only have 1 title and description for all of the pages of our website currently!), if that is more
relevant to the user's search query.
However the title is currently ONLY coming from the <title> tag and not elsewhere. So that <title> is extremely crucial for SEO.

A good title is gonna make users click more often in our search result link as it shows up on the list.

Now because our website is a SPA, all the pages of our app are gonna be rendered based on index.html file in src folder.
There will be multiple routes that are gonna get rendered inside the <app-root>, but the title and description for EVERY PAGE in our app is gonna be
the same if we don't optimize each page SEPARATELY.

So let's see how those <title> and <meta name="description" content="..."> work at runtime if we startup our SPA. So from root of project run: npm start
So right now we're not starting our ng universal express server. Instead, we're simply starting our CLIENT SIDE app in development mode without any
server side rendering or pre rendering involved. After a moment, our client side app is gonna be up and running.

Now to look at title and description of page, look at elements section of devtools and you see we have the title and description which we specified in
index.html and we got those things from server even we aren't use server side rendering or pre rendering at the moment. Because the things we received
from server even without SSR or pre rendering contain <title> and description!
So those two things came directly from index.html payload (either you use SSR or pre rendering or even not use any of those two, you get an index.html .
But in all of those 3 cases, it would have a index.html . But in 2 first cases, we create requested html in <body> tag in server too! and also in those 2
cases, each page can have a different title and description which came from server in first time we visit website or by reloading and ..., or when we
navigate in client side app, we can set a new title and description in all 3 ways, but when you first visit the website or reload or ..., only in 2 first
cases, you will get a custom title and description, because in normal SPA, the client app must be loaded in order to set the custom title and description.
But in third one, we can't and therefore all of the pages have the same title and description until the client side ng gets loaded and manipulate it,
which isn't good.)

Now let's view page source in order to see EXACTLY the html payload that we have received from server and you can see the title and the description are
correctly filled in, but our app is not yet rendered because we only get an empty <app-root> but rest of index.html including the title and
meta description that is gonna used by search engines in order to display search results are present.

Now what we like to do is to have EACH AND EVERY page of our website to have it's own title and description. For example if you navigate through client
side app to another route, currently, the title and meta description isn't reflected or changed based on the page we navigated.

So we want the title and meta description to reflect the content of each page when we go to that page. So we don't want a generic title and description for
the whole website.*/
/* 10. 5. Angular Universal SEO - Setting a Custom Page Title And Meta Tags:
Now we're gonna look how to use angular to create a custom title and description for EACH page of our website. So at RUNTIME, the common title and
description which was sent from server in index.html , won't be used and instead, it can be used for example, as a FALLBACK title and description in case
that the page doesn't have a specific title or description. So the title and description of index.html file in src folder, will be used as fallback.

Let's create custom title and description per page.
Now whenever the user is on a particular comp which corresponds to a certain page(how we find out which comp is correspond to which page?
In routing modules. Also remember there are some comps that are related to a page at all. So the comps that are really responsible for a route are
crucial for setting title and description for them), we want to set the page title and description to sth custom.
For that, inject angular Title service and use it in ngOnInit() to set the title of the page, by using setTitle() . That tile should also should show up
on browser tab of that page.
Now because we aren't using ng universal for setting title and description, if you see the view page source, you don't see the newly title and description
that we set for a comp which is responsible for the path that we're currently visiting yet. But in devtools and in tab of browser for that page,
you can see the new ones, Why?
Because from a search engine perspective, the question is how did that title(new one) get set and what was the title that we received from our
BACKEND?
So if you click on view page source, we see the initial html payload that we have received from server(in other words, the latest html that we
received from server) and all we get there, is our index.html file that later on, on the client, via the <script> tags which includes our JS bundles and
framework bundles, has loaded angular and our comps and took control of the page and generated all the html inside the <app-root> tag.

Important: That means that the ORIGINAL title and description of our app WAS the values that we have set in our index.html, but at runtime or in other
 words, when the application started up and angular took control of the page, THEN that comp(which corresponds to the route we're visiting) was created
 and ONLY AT THAT MOMENT, the title and description of page updated to the values you have set in setTitle() and ... of that comp.

But the question now is, which of those two titles will a search engine takes into consideration, in order to add to the search results?
Will the search engine take the ORIGINAL title that was received on the html payload that we received from server? Or will the search engine take the
updated title that was updated at runtime via JS code, when the app was fully started up?
It depends on the search engine. A few years ago, most search engines would take the ORIGINAL title from the payload which you can see it in
view page source and that means that only server side rendered titles were taken into consideration and therefore titles which were set at
runtime by JS like the case that we did earlier, were ignored by most of those search engines except google search engine.
The google search engine since several years, has taken into consideration that JS runtime UPDATES(so if there were no updates it would take the
server sent title and description) to the title and to meta tags.
Nowadays, most of the commonly used search engines, all take into account the JS changes at runtime, therefore they gonna take the dynamic title
that was set by angular, after the app has been started up.
However there are still a couple of crucial search engines that still don't process the runtime value of the title and meta description.

So if we want to do search engine optimization for those particular search engines too, then we need to server side render our title and description.
For most other cases including google search engine, that's not necessary anymore.
So the original title which we can see it in view page source, is coming from index.html and from server but LATER it will be replaced by client side
set title.
Now let's see how we can server side render our title.

So now, instead of running npm run start, we're now gonna now start our app with SSR activated. So use npm run dev:ssr which starts our
ng universal server in hot reload mode.

Important: Always remember, the title that you see in devtools is set by client side app at runtime after the app has started. For looking at
 what was the title and description that was set in server, you need to see view page source. If you do SSR for title and description, those two
 things can be set in server and therefore at runtime we can see those two things that was set in server and therefore the client side version of
 those two things and server side version of those two, are the same.
Now if you refresh the page to get results from ng universal SSR and see the devtools, you see the new title is still set on the page which was
set by client side app at runtime, like plain angular app without universal.
But the question is now, what we get from the server with that ng universal app?
This time, we get a fully server side rendered version of app, which includes not only the correct title and description, but also all the html
needed to display some content to user and also the <head> of our page including title and meta tags are also server side rendered as expected.

So our app which is now can be server side rendered on the fly too, is now search engine friendly. So this new version of app is gonna get correctly
indexed by ANY search engine and not only the most modern search engines that are already taking to consideration the runtime generated JS content.*/
/* 11. 6. Angular Universal - Social Media Crawlers Support:
The twitter social media crawler is gonna inspect the metadata of the page, looking for info on how to build a twitter card for tweeting the page and
sharing it on social media.

Angular Title service allows us to set a custom title for the page. For filling the description metadata and other twitter specific metadata, we inject
angular Meta service.

The search engine MIGHT display the description metadata that we set using Meta service, on the search engine results list, below the page title.
EX)
this.meta.addTag({name: 'description', content: this.course.longDescription});

So with this and the title, these are two tags that search engines are gonna look for, in order to build search results of that page.

Now let's ALSO make our course page compatible with the twitter crawler(currently that page is compatible with search engines, because we set
it's title and meta description tags). Because twitter crawler is gonna look for meta tags on the page <header>, for information about how to build a
twitter card for a visitor to be ale to tweet our page and share it on twitter platform. So that twitter crawler needs information about what's the
handle that we want to associate the page to?
We want to be able to set the title of the card, the description, text and ... . First meta tag is twitter:card meta tag and also I added several
other tags that we might want to fill in, in order to customize how our page is gonna be viewed by the twitter crawler.

In content prop for twitter:site , @AngularUniv is the handle that we want to associate the tweet to. So in that case, @AngularUniv is the twitter
handle of the angular university. Also in twitter:title we're gonna set a title for twitter card and ... . With them, we have all the twitter
specific metadata available in our page.
EX)
this.meta.addTag({name: 'twitter:card', content: 'summary'});
this.meta.addTag({name: 'twitter:site', content: '@AngularUniv'});
this.meta.addTag({name: 'twitter:title', content: this.course.description});
this.meta.addTag({name: 'twitter:description', content: this.course.description});
this.meta.addTag({name: 'twitter:text:description', content: this.course.description});
this.meta.addTag({name: 'twitter:image', content: 'https://...'});

Now start ng universal live server in dev mode using npm run dev:ssr and after a moment our server is gonna up and running.
Now if you look at elements tab of devtools for the comp which is responsible for a route, you see that our code added those twitter
specific meta tags to the bottom of <head> but also you see we have a duplicate <meta name="description" content="x"> in bottom of the <head> and
that's the new one that was added and also the one that we always have in top of <head>.

For removing that duplicate issue and also update the top <head> meta description tag, instead of using addTag() for description tag, we need
to update the existing description description tag that we got from the server which lives at top of <head>, so use updateTag() method.

Important: When you're looking at elements tab of devtools, you're actually seeing the elements at RUNTIME and not what we got from server.
 Now with ng universal we can see in view page source that the <title> and description metadata are correctly filled in also on the html
 payload that we got from the server. Now if you also search for other <meta s on that view page source, you can see we also have all the twitter
 metadata from server.

How does those twitter metadata work?
All the data that we have as <meta> aren't VISIBLE on browser of user. Instead, those meta tags are gonna be used by twitter crawler, whenever
it comes to our website by following the url of the page that has those <meta> twitter tags.

So when somebody on twitter is gonna try to tweet our page, maybe using a twitter button, but maybe just by PASTING a link to the tweet and from there,
the twitter crawler is gonna come and inspect the page via the url (which must be the url of page that person wants to tweet about that page) and that
crawler is gonna grab from the twitter meta tags, all the info for displaying in a nice way, the tweet to the user, with a title, description, a
small thumbnail and ... .

Now we find out how to adapt our app using ng universal in order to be search engine friendly and social media crawler friendly.

We can use ng universal to build a custom application shell for our app in order to even more improve the startup performance of our app especially
the preceived startup performance time. So the time that takes, to user feels that the app is now fully functional.*/
/* section 4. Angular Universal Application Shell
12. 1. What is an Application Shell
The best way to understand exactly what is an application shell, is to remind ourselves first, what is the main reason and why we're even
using ng universal in our app?
For that launch your ng universal live development server.
We're adding ng universal to our app in order to be able to provide to the user, an initial html payload when the app is initially launched in the
browser. The reason why we want that initial html payload is to be able to show to the user sth quickly on the screen, giving to the user the
preception that the app is up and running and everything is working correctly. If we don't provide an initial html payload to the user with some
visible content, the user might even think that the app is broken, it's unresponsive and he(it, or the app) might even leave the page
without loading the app. This effect is gonna be much more noticeable on mobile over slow networks.
With typical SPAs, we're serving an empty INITIAL html page, containing just the root tag of our app and with no content received from the server.
So if we just display that page to the user, it's gonna be a blank page and the user is not gonna see anything on the screen and the user is gonna
have a poor preception of the performance of app. He's gonna think that the app is very slow and it might even be broken.
So imagine you as the app user, having to wait 5 or 10 seconds looking at a completely blank page and waiting for an app to load. That's exactly
the problem that we're trying to avoid by using ng universal.
We use ng universal which is a node based angular rendering engine, in order to prepare some html to the user, up front. That html is gonna be
displayed to user and user will preceive the app as up and running, while in reality, it's just plain static html(which was sent from server) that is
getting displayed.
On the background, the page is loading the JS and CSS bundles that are gonna activate the angular app on the FRONT end. Then the angular app on the
client side is gonna take over the page.
View page source shows us the INITIAL html payload that we got from SERVER.

Depending on the content of the page that we have server side rendered, that html could be potentially A LOT of html that we have to send over to
the wire to user and therein lies the problem that an application shell is trying to solve. Maybe for certain situations, sending a full
server side rendered html payload to the user is too much for what we're trying to acheive. Because we're just trying to give to the user, a QUICK
indication that the app is working correctly and it's starting up. We don't want necessarily to show to the user, a COMPLETE CONTENT of the page.
For example maybe showing to user, just the top menu of our app plus a global loading indicator spinning at the center of screen, maybe that's
sufficient, in order for the user to preceive the app as correctly working and almost ready to be used.
Important: Remember: The goal is to show to user some meaningful content as early as possible in order to indicate that the app is working
 correctly and maybe showing all those html to user is counterproductive for that goal, especially because a lot of content that we have is below
 the fold. So the user won't be able to see it anyway when it gets loaded onto the page, WITHOUT SCROLLING(it's below the fold).
 So although we want to use SSR in order to show to the user an initial payload, we might want to CONTROL EXACTLY WHAT PARTS OF THE PAGE get
 server side rendered or not, in order to optimize the INITIAL html payload that gets send to user.
 So the html payload should have JUST ENOUGH html, in order for the user to preceive the app as working, but it should NOT be so LARGE that
 defeats that purpose.
That amount of initial html that we want to send to the user, might depend on the page that the user is on it currently.
For example, on the all courses page(root page), maybe we want to server side the complete page initially, because it's not a lot of content.
But for example on view course page(/courses/:id), maybe we just want to render the header course and display a loading indicator to user or maybe
we only want to render the first two or three lessons of the courses and we load the rest later, when the front end app starts up. So if that course
would have a lot of entries, we might not want to send ALL of the lessons of the course, on initial html payload, because again, the user would not
even be able to see all of that info on the screen due to the need of scrolling.

As you saw, with SSR, we would like to have the ability FOR DIFFERENT PAGES to CONTROL EXACTLY what gets server side rendered or not, in order to
optimize the INITIAL payload of html sent to the user and that notion of having a REDUCED VERSION of the app that shows only a part of the content
to the user, such as top menu and maybe some part of the page which is top of the content and a loading indicator, that reduced html version of app
is called an application shell and application shell is the minimal amount of html that we can send to the user at application startup time, that
will still give to the user the impression that the app is working correctly.

In order to create an app shell, we need to somehow control on a per page basis, which parts of the page, get server side rendered or not.
So let's implement that using a couple of auxiliary application shell directives that we need to write them.*/
/* 13. 2. Application Shell Implementation - The appShellRender Custom Directive:
Let's discuss what the shell will look like. In particular case of tutor's app, in order to show quickly some content to user, we're gonna
reduce the application shell to containing only the top menu(which that menu is present on all of the pages) and add a loading indicator in
place of main content of page.

Important: In index.html , the <app-root> corresponds to our app.component template.
Now let's identify the elements that we want to keep on the application shell and separate them from those that we want to remove(so they won't be
on app shell and only will be displayed after the client side app take over).
Also remember the goal is to make the app shell as small as possible while displaying some meaningful content to user.

Now we want the loading indicator to be visible to user only when the app is server side rendered(is being server side rendered on ngExpressEngine).
When the app reaches the client, we want to hide that loading indicator. So we want that loading indicator to be included ONLY in the app shell.
It should be visible only in the initial payload that we receive from server whenever we startup the app, the user is gonna see the top menu bar and
loading indicator immediately (so when the app starts up, the user is gonna see ok the app is up and running and it's ALMOST ready to be used)
and after a moment, the client side app that was loaded via the JS bundles of the page, is gonna kink in and it's gonna take control of the page
and it's gonna render the rest of the content to user. At that moment(when the angular frontend app took control over the page), we wanna make sure
that we hide the loading indicator.
Important: So that part, needs to be rendered ONLY on the server side and it needs to be hidden on the client side. How can we ensure that?
Well we need a new angular custom structural directive which we call it appShellRender and place on elements with *.
So with that directive, we're telling angular that we want to include that part, only in app shell which means, ONLY when we render that part on
server side. ALSO we're telling angular that if we're running on browser or on client side, then that part should be hidden from user.
So it's gonna be work a little like *ngIf but it's gonna be application shell specific.

The directive should render the container to which that directive applied, on the server side ONLY and not on client side. So somehow this
directive needs to know if it's getting rendered on client side or on server. In order to determine if we're on client or on server,
we need to use platformId. So the platformId is gonna be different if we're rendering that directive on client or on server.
So we need to use angular DI system in order to inject the platform identifier.
Important: We need to inject that platformId by using angular @Inject() decorator and that decorator allows us to inject other things than
 TS classes. So we can also inject a unique identifier and inside () of @Inject, we specify the identifier of the injectable that we need to inject
 there. So in this case that identifier is PLATFORM_ID.
Remember, the directive we're creating can also be used with * syntax is known as an ng structural directive. It's gonna affect the structure of
the page. And it's job is to show or hide a given part of page, depending on certain conditions.
In order to implement that directive, we're gonna need a reference to the template or element which that directive its applied. So in this case,
we need a reference to <div> to be able to show that <div> or hide it in our page.
We can grab a reference to that template section, by injecting it directly in constructor of directive. So inject TemplateRef.

Now that we have a reference to the template, the structural directive needs to be able to instantiate or delete the template, depending on certain
conditions. In case of our directive, depending on content of platformId, meaning depending on if we're on the server or on client.

In order to be able to show or hide that template, we need a special ng service known as ViewContainer which has type of ViewContainerRef
Important: In general any angular structural directive is always gonna need the template reference(templateRef) and the viewContainer.

EX)
<div>
<mat-spinner *appShellRender></mat-spinner>
</div>

Remember: An angular directive is a plain TS class with @Directive.
To indicate that a directive is an attr directive, we need to wrap the name of selector of directive in [].

Now create app-shell-render.directive.ts:

@Directive({
    selector: '[appShellRender]'
})
export class AppShellRenderDirective {
    constructor(@Inject(PLATFORM_ID) private platformId: PlatformId,
                private templateRef: TemplateRef<any>,
                private viewContainer: ViewContainerRef) {}
}*/
/* 14. 3. Application Shell - appShellRender Custom Structural Directive Implementation:
We want to create a structural directive that allows us to render certain parts of the page on the server and to have those parts of page included
on our application shell.
Important: The app shell is the html that gets rendered on the server when the app starts up and in our case, we would like to include a loading
 indicator on center of page so that the user gets a sense that the app is already working, but we don't want that loading indicator to be
 displayed on the client. We want it to be included ONLY on the INITIAL payload of html that the user receives which is known as the application
 shell.
So that custom structural directive needs to render that part of template(templateRef), if we're on server and it needs to hide it if we're on client.

The best MOMENT to decide if templateRef should be rendered or not, is gonna be at application startup time. So we're gonna decide if we want to
show the application shell element(for example the loading indicator) or not and that decision will remain valid throughout the lifecycle of the
application. So we do that in ngOnInit() which will be triggered by OnInit, only once which is the first time that directive gets created.

We're gonna cover two cases. First we're gonna cover the server case or the case when the app is being rendered on server. In that case, we know we're
generating the INITIAL html payload that we want to send to the browser. So in that case, we want to include the application shell element on the
template.

So if we're on server, then we need to render that template part.

this.viewContainer.clear(); gonna remove any template that might have been previously instantiated using ViewContainerRef.

Ex)
ngOnInit() {
    if (isPlatformServer(this.platformId)) {
        // Here we instantiate our template part in the view. For example we add that <mat-spinner> to the application shell
        this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
        // We want to hide the element because that element is only part of the application shell.
        this.viewContainer.clear();
    }
}

Now we need to include that directive to app.module and in it's declarations array.
Remember: That directive will only be noticeable on server side rendered applications. So we need to start ng universal development server.

Now if you start the app, you can see the loading indicator was part of the application shell. We could see that the loading indicator was visible
in the INITIAL html payload and got displayed, but we can also see that it has now been hidden, once the client side app has kicked in and took
control of the page. So once the client side app takes control of the page, all the application shell sections of the page which are marked with
*appShellRender are gonna be hidden from the user.
Now if you want to see that indeed those app shell sections were included on the initial html payload, go to view page source. So there, you can
see the initial html payload that we received from server and if you search for the things that were marked with that custom directive, so in our
case <mat-spinner>, you see that it's included on the html payload and also the <amt-spinner> was replaced by a lot of content in order to be able
to show to the user a loading indicator. So in code we just write <mat-spinner></mat-spinner> but in view page source it would be:
<mat-spinner <a lot of classes and attr and ...>>.

Now if you scroll down, you see a lot more html was included in our initial html payload. So all the content of page ALSO was included!
So the initial payload included loading-indicator and ALSO all of the other html and content of page. BUT THIS IS NOT WHAT WE WANT!
Important: What we want is to show to user ONLY the initial loading indicator(only the stuff that marked with custom directive) and we don't
 to render on the server, ALL the content(we don't want to render both unmarked and marked with that directive stuff. We just want to render the
 marked elements) and we want to let for the client side app to render those unmarked stuff.
So we need another auxillary directive, similar to this one, that's gonna allow us to REMOVE content from application shell.*/
/* 15. 4. Application Shell - implementation Finished and Demo:
We have created a custom structural directive(appShellRender) that allows us to render sections of the page and add them to the
application shell which gets render on the server side.
Now we want to do the opposite.
We want to mark certain parts of the page as NOT illegible for server side rendering. So we don't want on server side rendering of our comp, to
include all the content of the template of that comp. So we might not want to include the whole template and we would prefer instead to see ONLY
a loading indicator for example. Or maybe we would like to include on the page(initial SSR rendered page, which later, rest of the content would be
rendered by client side angular), just a header and a course thumbnail and we would like the rest of the page to be hidden and instead the
application shell should only contain the loading indicator in that place.
So now we need to somehow configure that template of comp, in order to ONLY include some elements that we want, IF THE APP IS ON THE CLIENT SIDE or
on browser. But on the other hand, on the server which is when we're rendering our application shell, we would need somehow to mark those elements
that we don't want to be on application shell, as not eligible to be included on the application shell.
The way that we're gonna do that is by using another structural directive which is gonna work in a very similar way to *appShellRender and it's
named appShellNoRender.
Important: It means that ANY template element that this directive gets applied to it, should NOT be included on the application shell.
So in implementation of this new directive, we say if we're on the client side, then we wanna be able to show the content to the user. On the other
hand, if we're on the server, we don't want to render that part of template which that directive is applied.
EX)
if (isPlatformServer(this.platformId)) {
    this.viewContainer.clear();
} else {
    this.viewContainer.createEmbeddedView(this.templateRef);
}
So that means on the server, we're not gonna render the part of template that has this directive, to the outputted html(in if statement). On the other
hand, if we're on the client, we wanna instantiate that part of the template. So that template(which is accessible via templateRef) which
we're applying this directive to it, is only gonna be visible on the client and NOT ON THE SERVER as intended. Now add that directive to app.module and
in it's declarations array.

For testing the code, make sure you you're running the ng universal live dev server.

Now whenever we hard reload with cmd + shift + r meaning that we're gonna reload with everything from the server FOR SURE.
Now unlike before, if you click on view page source, we did get the parts that were marked with *appShellRender, but unlike before,
we don't get the things that were marked with *appShellNoRender(so if you didn't use this directive, you STILL would server side render those stuff
too, because we didn't said that we don't want to render them on server).

So the *appShellNoRender content would only be loaded when the client side app was bootstrapped and took control of the page and at that moment,
a new request would be send to the server to fetch the required data and then the client side app would display them. So that content didn't
come from the INITIAL response from server and you can confirm that in view page source. So in there, you would get the *appShellRender , but
we won't get the html of things that were marked with *appShellNoRender , so they won't be included on the application shell.

Another optimization that we typically need whenever we have an ng universal app, which is how to transfer state between the server and client.*/
/* SECTION 5. Angular Universal State Transfer API:
16. 1. What is the Angular Universal State Transfer API:
The state transfer api is an ng universal feature that allows us to transfer some state between the server side application and the client side
application. But why would we even want to do that?
First run ng universal development server by running npm run dev:ssr.
Now open the network tab and filter the ajax(xhr) requests. Now go to a route through in app navigation. Now whenever we get to that page,
we're gonna do two ajax reqs but they're separate from each other and are for different purposes.

Let's remember, this app is an ng universal application, therefore a part of that page is being server side rendered whenever we RELOAD(or type the
url of that page and then hit enter or enter that page through google).

Now if you refresh the page, the page is going to get server side rendered and we're gonna see the content of application shell like our loading
indicator, also we're gonna see the content that were on application shell that was sent from server, IMMEDIATELY displayed on the screen.
For example we see a text that was on app shell that was immediately displayed and the image which also was on app shell, displayed shortly after
that text, while the other data that wasn't on app shell was still getting loaded(the image and that text were both on the app shell).

You can filter the requests for a specific destination, by using the filter input in devtools, for example you can search there 'firebase'.

Also you can see some GET requests(and obviously xhr, because we're filtering only the xhr requests from all requests that we made) that are like:
?EIO=3&transport=... and they were related to hot reload mechanism of ng CLI development server. So we can filter them out by writing for example
firebase on filter input, in order to make sure that we ignore those reqs, because they're not actually being made by our app and because
they won't be present in production.

Wait! Our app is being server side rendered, therefore if you click on view page source to see the original html payload that we received from
the server, we're gonna be able to find the things that were server side rendered and those things were already server side rendered and delivered on
the initial html payload that we received from server and that's why they show up on the screen a bit faster than the other things which the data
of those other things(if they need data, of course!) still needs to be fetched from the backend.

In order for server side application to be able to display the things that they need to be fetched from backend, the server side application needed
to do a backend request to our api which is identical to the request that we see on browser's network tab, to fetch those info and then be able
to include that info or other info based on that info on the original html payload that we received.
Then that original payload arrived at browser and what happened after?
The first thing that happened is that we managed to see some content very quickly on the screen, because they were included on the original
html payload. MEANWHILE, IN THE BACKGROUND, the <script> tags of the app, loaded angular onto our page, the ng framework kicked in and took
control of the whole page and when that happened, our component(s) that corresponds to that page which we're seeing, was(were) instantiated and
that(those) comps, made a couple of requests to the backend even the requests that were already made on the backend.
Some requests to fetch data are necessary but the data that those reqs were got, were ALREADY included on the original html or used in the
server side app to render the original html payload, that we got from server.
So ideally, whenever that app starts on the page, there's no need to call the server a second time, to fetch AGAIN the data, because we
already have all the data that we need(to show to user), on the original html payload. So the second time requests are DUPLICATE, because
our server side app just made an identical request on our backend.

So when the client side app starts up, will end up accidentally doing a second time duplicate http request to fetch the EXACT SAME data which
was just fetched a moment ago on the backend, just in order to display it again on the screen.

For larger apps, the presence of those duplicate HTTP requests, might even create some unwanted flickering effects on the page, where
you can see clearly the content of the page INITIALLY as it was rendered out of the initial html payload, and then, the content is
REMOVED while a request(s , the duplicate ones) is being done to the backend and it's shown AGAIN to the user.

So that type of unwanted(unnecessary) flickering effects on the app, caused by unwanted(unnecessary) requests that are repeated to the
backend, is sth we wanna avoid for UX. We would also wanna avoid the duplicate requests for performance reasons(there's no need to do the
same reqs, twice).

Ideally what we wanna do, is to fetch the data ONLY ONCE AT THE BACKEND, while we're preparing the original html payload.
Then we need to find some way of transferring that data which was already fetched on the server, on to the client without needing to do
another req to server.
So we need a mechanism for transferring state(the data that was fetched on server for example the course object) from server side
application, into the client side app. */
/* 17. 2. Reviewing the Course Component and the Course Resolver:
In certain situations, the ng universal server side application that is being server side rendered or pre rendered, needs to do some
api requests in order to fetch data from the backend and generate the corresponding html(that the user wants that html for viewing the page) and
Important: We want to avoid the CLIENT side application when it gets kicked in and started on the browser to have to fetch that information AGAIN.
How we can solve this problem?
First let's identify the data that we wanna somehow transfer between the server side and the client side. So in server side, we get some data
and then use it in initial html payload somehow(or use them for calculation in TS services or ... and then add calculated used data to html) (so
that initial html payload will be come from server side app, whenever we refresh the page or type in url and hit enter or enter the page of
website through google).

The requests that are shown in network tab of devtools were made by client side application.

The duplicate request is made by client side application in startup time but that same request was already made a moment ago by the server side app,
when we server side rendered our page and fetch the data needed for html payload. So how we can avoid that http request that is being made
twice, once by server side application and another, by client sie app?
In order to solve the problem(even if you're using a resolver to fetch data for that comp,) we need to adapt the implementation of resolver or
comp, for using transferState api. It's a special service that allows us to transfer data from server application into client application.
Then, the client application(or if you have resolver for that route which is being SSR, the resolver will get the data from server side app)
is gonna get that data the first time that the page gets loaded and that resolver will provide that data to the responsible comp, without having to
fetch that data again from api, by using a duplicate http request. */
/* 18. 3. Transfering State from the Server to the Client with the State Transfer API:
Let's adapt resolver to using transferState api. Our final goal, is to for example find a way to transfer the course object which is
provided by the CourseResolver to the CourseComponent and we wanna somehow transfer that course object between server side application and
the client side application.
Now inject transferState into resolver. Now at this point, before STARTING to use transferState, it's crucial to shut down the live development
server, otherwise you might run into a compilation error. Now how transferState service work?
We can call get(), set(), remove() and hasKey() . So it's like a key value data store where we can store data using set(), we can verify if the
data exists in our store, using hasKey() and we can retrieve the data using get(), we can also remove any data from that data store using remove() .

So we can solve the problem of duplicate http request for fetching again the course object in resolver for example. We're gonna fetch
the course object only ONCE in server, we're gonna store it in our transferState data store and we're gonna retrieve it again on the client
side. In order to be able to use the transferState service, we're gonna need a transfer state key. It's a key that identifies the state object that
we wanna transfer between the server and client and in makeStateKey() we give define a name in string and then it needs to be a unique key per object
that we wanna transfer, so let's append the courseId.
As you can see, we can store different courses in our state transfer data store by using different keys. Also you can provide the type of object
that is being stored in <> and as we're storing a course object, we passed Course in <>. So now we have a data store key called COURSE_KEY that
allows us to store and retrieve course objects in a type safe way.
EX)
const COURSE_KEY = makeStateKey<Course>('courseKey-' + courseId);

Now how we're gonna use that key in order to implement the data transfer between the client and server?
On the server we're going to be doing those http requests and fetch the course from the api, then, still on the server, we wanna store the fetched
course on the transferState data store using the COURSE_KEY. Then on the client or when the application starts up, first, before anything else,
we're gonna check the transferState store to see if a course is already there by using the key. If the course is there, we're gonna fetch it from
the DATA STORE(all of this is doing in resolver) and we're gonna provide it to courseComponent via the resolver. Then we're gonna delete the
course from the data store because we don't need it there anymore and we have already retrieved it. From there, the transfer state between the
server and the client is completed and the client side app will continue to work normally.

We're gonna have two cases: Either the Course that we want containing a particular courseId is already present on the transferState store or the course
is not present yet. So let's check for presence of the course:
When there's no course in our datastore(the else branch), we need to call the api and retrieve our course using service method and this situation where
we don't have the key in datastore can happen in a couple of situations. It could happen on the server, when we're trying to server side
render the application AND we have NOT YET loaded the course from api, but the else branch might also happen on the client side whenever we're
navigating into this page or any other course page using the angular router. In that case, if we're already on the client and the application has
finished starting up, then in that case our datastore will already have been emptied out. So in that case, we wanna repeat the call of the method
of service(the else branch).
So let's suppose we're in our backend and server side rendering our app, therefore we're in else branch and therefore, we have not yet stored the
course in our datastore because we have not fetched it yet.
So what we wanna do after fetching the course from the api?
We need to store it in our datastore in order to be able to transfer it to the client side. We can do it by using tap() and there we store it in
datastore.
Inside the tap(), in case that we're on server, we want to store it in the transferState datastore. So let's first check if we're indeed on the
server by using isPlatformServer() and pass it the current platformId and you can inject the current platform that we're on it, by using the
PLATFORM_ID injectable. So with that platformId we can determine if we're on the server or on the client.
Now if we're indeed on the server, then after fetching the course from api by using that service method, we wanna store that returned data to
our transferState store by populating the corresponding key which is COURSE_KEY with the value that we wanna store which in this case is course object.
So now at this point, our app is server side rendered.
Important: We have fetched the course from api and used it to render the page and generate the html and ALSO we have saved the course and attached it
 into the html payload in order for the course object to be available to the client side application when the client side app starts up.
So the browser will load our initial html and the client side app is gonna get kick started. So what will happen there?
Well, again the course resolver is gonna get triggered because we're on the route that will call that resolver which that route is for example /courses/01.
So the client side app is gonna trigger the resolver in order to TRY to fetch the course(which it's type is specified in <> of return value of resolve() method of
resolver) that the course.component needs. So in that case, we will be in if branch of below, where the transferState datastore DOES CONTAIN our course that we have
stored on the backend. So what will happen there?
Well, because the data(course) is present on the transferState datastore, we want to first fetch it from that datastore and in get() we also need to provide a default
object(actually a value) in case that there's no course stored under the key we specified. Now we have received the data in our frontend, we want to remove it from
transferState data store. Because we already have it and we wanna provide it to our course.component.ts .
With that, we have both fetched the course object which was transferred from the server onto the client and we have removed it from the transfer data store.
Now we have to return that fetched data to any component that is associated with this course resolver. So we need to return an Observable of Course or Observable<Course>, just
like what we defined as returned value of resolve method and we can create it with of() factory method and pass it the only value which would be emitted which is gonna be
the course object. So of(course) is gonna create an observable that is gonna emit only one value and then it's gonna complete.

EX)course.resolver.ts:
resolve(route, state) {
    const courseId = route.params['id'];
    const COURSE_KEY = makeStateKey('courseKey-' + courseId);

   if (this.transferState.hasKey(COURSE_KEY)) {
    const course = this.transferState.get(COURSE_KEY, null);
    this.transferState.remove(COURSE_KEY);
    return of(course);
} else {
    return this.courseService.findCourseById(courseId);
    .pipe(
        first(),
        tap(course => {
            if (isPlatformServer(this.platformId)) {
               this.transferState.set(COURSE_KEY, course);
            }
        })
    );
}
}

Now we have finished the implementation of course.resolver . Now let's understand how it works at runtime.*/
/* 19. 4. Angular Universal State Transfer - Runtime Demo:
Now let's see the new implementation of our course.resolver in runtime. We're transferring the course object from server side application into
our client side app.

In order to use TransferState service, we need to add some special config to our app.module . So right below BrowserModule.withServerTransition({...}),
add BrowserTransferStateModule. That's the module that contains the client side version of TransferState service. So that's a service that runs in the
browser that allows us to retrieve and store data onto the html page itself.
Now besides the BrowserTransferStateModule, we also need a server side version of that service so import that server side version in our app.server.module .
So there, below the ServerModule of our server side application(app.server.module), add ServerTransferStateModule.

So the TransferStateService has actually two different versions, one for client and one for server. Now run npm run dev:ssr
which starts ng universal development server.

Now if you reload the page or type and enter or enter through google to this page, we get the server side rendered or initial html of the page
with application shell and if you see the network log, you can see this time around, we won't have duplicate reqs.

Now where did the course object get stored, when it got transferred between the client and the server?
For that, let's inspect the content of initial html payload that we received from the server which is in view page source.
Important: The TransferState uses that html payload in order to transfer state from the server onto the client.
In there, if you scroll down to very bottom of that document which is the html payload that was server side rendered, we're gonna see a
<script id="serverApp-state" type="application/json">{&q;courseKey-01&q:...}</script> and by seeing type="application/json" we understand that the
content of this tag is of type json and therefore you can see some info with html escape json format which is for course object that was transferred with
transferState.

So that <script> tag which was embedded on the <body> of our server side rendered html payload is how the transferState api works.
On the server, any state that we store on the transferState datastore, is gonna get applied to the page using a similar <script> tag that I mentioned.
The content(the data that we stored on transferState) which is usually JS objects, is gonna get rendered as escaped json in an html context, and when
that content arrives at our frontend application, THEN, when we do transferState.get() , the content which is arrived and available on <script> tag,
is gonna be available to transferState service.

Summary: What's transferState service?
It's an angular injectable service that allows us to transfer state between the server side application and the client side app. We do that by
including any content that we want to transfer, directly on html payload in order for it(the content or transferring data) to be available on
the client side.
The goal is to avoid the application on the client at the startup time, needs to repeat certain http requests in order to display data that was
ALREADY included on the initial html payload. So it's a performance optimization but it's ALSO for user experience because those repeated http
requests on the client side to fetch again the data from api, might result in unwanted flickering effects which are situations when we see some
content initially on the page, because it was included on the html payload, then the content disappears from the page because it's BEING fetched again
from api and then it shows up one final time. So if you see that sort of unwanted effects on an ng universal app, then use transferState to solve it.
*/
/* SECTION 6. Angular Universal Production Deployment:
20. 1. Angular Universal Production Deployment - Introduction:
We want to deploy an ng universal app in production and we have 2 options when it comes to ng universal apps.
We can opt for pre rendering the whole app or we can opt for having a runtime node server that server side renders the application.
The simpler one is pre rendering.
When we pre render our app, we're gonna create all the static html that we need at application build time and we're gonna left after the build is
completed, with a static folder which contains all the files that we need in order to deploy the app to production. We simply need to take those
static files and deploy them into any static server, such as for example an apache server or enginex server or even amazon web services S3 bucket that
we can link for example to amazon web services cloud distribution.
So any static server that allows us to deploy static files, will be good for deploying in production a pre rendered ng universal app.

Now what if we want to do on the fly server side rendering instead of pre rendering?
We're gonna need a node server running in production. So one of the main advantages of pre rendering our ng universal app is that we don't need a
node server in production.
However in order to do on the fly server side rendering, we're gonna need the server to run our server process which corresponds server.ts file.
In order to run that express server which is configured in server.ts, we're gonna need a node server at runtime.

So we wanna deploy our ng universal app to production, using a nodejs hosting platform, so we're gonna use google cloud platform and
more specifically, google cloud app engine for node. So go to console. Now create a new project after going to google cloud app engine.

Now we need google cloud CLI in order to deploy our project to production. Then we need to look how to setup google cloud sdk.

21. 2. Preparing an Application for Deployment on Google App Engine for Node:
Let's setup google cloud sdk which needed for deploying ng universal. After installing sdk, run: which gcloud for checking. Now we need to login to
GC from command line. So run: gcloud auth login .

Now add a configuration file called app.yaml . Yaml is a special type of configuration format and it's a lot different than json. In yaml,
everything works with whitespaces and indentation and there write:
runtime: nodejs10

You could use that config file in order to specify things like the number of instances of your server that you want to deploy at the same time or the
amount of memory that each instance can consume. But we're gonna leave the default options.

Now go to package.json and do a couple of changes that are gonna allow us to build the app and deploy to production.
Whenever a project gets deployed to GC app engine, the platform(GC) is gonna try to start up the server by running: npm run start. BUT! right now,
the npm start command is starting our local development server(without looking for ssr and node server!). So we don't want that command to run in
production. So let's rename that start command to sth else as a precaution. Call it start:dev . So now we have:
"start:dev": "ng serve"

When we deploy the app to production, we want to first do a complete server side build. So we want to build both the frontend of the app and then
using that latest frontend, we want to create a new build of our ng universal bundle. In order to do that, we need to run build:ssr just before we
launch the server.
The GC devkit allows us to define a preparatory task in our package.json which is called prepare. That task is gonna get executed just before
npm start which starts our server.
"prepare": "npm run build:ssr" so it's gonna do a full server side build of our app in production and with that preparation step concluded, we're
ready to start our server.
So when the app gets deployed to google cloud app engine, the npm run start is gonna be called by the platform, in order to start our server.
When that occurs, we want to serve our new node process in production mode and we can do that by running: serve:ssr which is gonna call node and
gonna use the production main.js of our dist folder, in order to run the express server.
"start": "npm run serve:ssr" and it's gonna start our node process in prod mode.
now our app is ready to be deployed to GC app engine. Now let's deploy the app to production and test SSR in production.*/
/* 22. 3. Angular Universal In Production - Final Demo:
Make sure you're on same directory that contains package.json and app.yaml . Now run: gcloud init. Now choose 2. , then choose the google account that
you used to create that project before.

With that, our GC sdk is configured and ready to use. Now we have to deploy the app by running: gcloud app deploy .
It will show the configuration of your app(app.yaml)

You can look at the server logs by running: gcloud app logs tail -s default .

Now in order to confirm that our app is server side rendered, look at view page source to inspect the html payload and search for body tag and
you know all of that html generated on the server side.*/
