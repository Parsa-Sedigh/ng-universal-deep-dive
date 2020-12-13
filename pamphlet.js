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
*/
