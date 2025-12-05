import Route from "./Route.js";
import { allRoutes, websiteName } from "./allRoutes.js";

const route404 = new Route("404", "Page introuvable", "/pages/404.html");

const getRouteByHash = (hash) => {
    let r = allRoutes.find(route => "#/"+route.url === hash);
    return r || route404;
};

const LoadContentPage = async () => {
    const hash = window.location.hash || "#/accueil";
    const currentRoute = getRouteByHash(hash);

    const html = await fetch(currentRoute.pathHtml).then(r => r.text());
    document.getElementById("main-page").innerHTML = html;

    if (currentRoute.pathJS) {
        const scriptTag = document.createElement("script");
        scriptTag.src = currentRoute.pathJS;
        document.body.appendChild(scriptTag);
    }

    document.title = currentRoute.title + " - " + websiteName;
};

const routeEvent = (e) => {
    e.preventDefault();
    window.location.hash = e.target.getAttribute("href");
};

window.addEventListener("hashchange", LoadContentPage);
window.route = routeEvent;

LoadContentPage();
