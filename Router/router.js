import Route from "./Route.js";
import { allRoutes, websiteName } from "./allRoutes.js";

const route404 = new Route("404", "Page introuvable", "/pages/404.html",[]);

const getRouteByHash = (hash) => {
    let r = allRoutes.find(route => "#/"+route.url === hash);
    return r || route404;
};

const LoadContentPage = async () => {
    const hash = window.location.hash || "#/accueil";
    const currentRoute = getRouteByHash(hash);

    //vérifier les droits d'accés à la page
    const allRolesArray = currentRoute.authorize;

    if(allRolesArray.length > 0){
       if(allRolesArray.includes("disconnected")){
        if(isConnected()){
          window.location.replace("/");  
        }
       }
       else{
        const roleUser = getRole();
        if(!allRolesArray.includes(roleUser)){
           window.location.replace("/"); 
        }
       } 
    }

    const html = await fetch(currentRoute.pathHtml).then(r => r.text());
    document.getElementById("main-page").innerHTML = html;

    if (currentRoute.pathJS)  {
        const scriptTag = document.createElement("script");
        scriptTag.src = currentRoute.pathJS;
        document.body.appendChild(scriptTag);
    }

    document.title = currentRoute.title + " - " + websiteName;

    //Afficher et masquer les elements en fonction du role
    showAndHideElementsForRoles();
    document.getElementById("loader").hidden = true;

};

const routeEvent = (e) => {
    e.preventDefault();
    window.location.hash = e.target.getAttribute("href");
};

window.addEventListener("hashchange", LoadContentPage);
window.route = routeEvent;

LoadContentPage();
