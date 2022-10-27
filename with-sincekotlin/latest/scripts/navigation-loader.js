navigationPageText = fetch(pathToRoot + "navigation.html").then(response => response.text())

displayNavigationFromPage = () => {
    navigationPageText.then(data => {
        document.getElementById("sideMenu").innerHTML = data;
    }).then(() => {
        const base = new URL(pathToRoot, window.location.href)
        document.querySelectorAll(".overview > a").forEach(link => {

            link.setAttribute("href", pathToRoot + link.getAttribute("href"));
        })
    }).then(() => {
        document.querySelectorAll(".sideMenuPart").forEach(nav => {
            if (!nav.classList.contains("hidden"))
                nav.classList.add("hidden")
        })
    }).then(() => {
        revealNavigationForCurrentPage()
    }).then(() => {
        scrollNavigationToSelectedElement()
                    document.querySelectorAll("#sideMenu a")
                        .forEach(elem => elem.addEventListener('click', (event) => selectPage(event, elem)))
                    document.querySelectorAll("#main a")
                        .forEach(elem => elem.addEventListener('click', (event) => selectPage(event, elem)))
    })
    document.querySelectorAll('.footer a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    window.addEventListener('popstate', (event) => {
        openPage(document.location, false)
    });
}
const selectPage = (event, elem) => {
    const link = elem.getAttribute("href")
    let pattern = /^#|^(?:[a-z]+:)?\/\//gi;
    if(link.match(pattern))
        return;
     event.preventDefault();
     event.stopPropagation();
     event.stopImmediatePropagation();
     openPage(link, true)
}
const openPage = (link, isPushState) => {


        navigationPageText = fetch(link).then(response => response.text()).then(data => {
        convertToAbsoluteLinks2()
        var parser = new DOMParser();
        var doc = parser.parseFromString(data, "text/html");
       let baseEl = doc.createElement('base');
       baseEl.setAttribute('href', link);
        doc.head.prepend(baseEl);

                const oldPathToRoot = pathToRoot
        updatePathToRoot(doc)
        replacePathToRoot(oldPathToRoot)
//convertToAbsoluteLinks()




         document.getElementById("main").innerHTML = doc.getElementById("main").innerHTML;
         //document.getElementById("navigation-wrapper").innerHTML = doc.getElementById("navigation-wrapper").innerHTML;

         document.getElementById("navigation-wrapper").parentNode.replaceChild(doc.getElementById("navigation-wrapper"), document.getElementById("navigation-wrapper"));

        document.getElementsByTagName("title")[0].innerHTML = doc.getElementsByTagName("title")[0].innerHTML;
         document.getElementsByTagName("title")[0].innerHTML = doc.getElementsByTagName("title")[0].innerHTML;


        document.querySelectorAll("#main a")
         .forEach(elem => elem.addEventListener('click', (event) => selectPage(event, elem)))

     //    alert(pathToRoot + "dffd \n" + oldPathToRoot)
      return applyNewScripts(doc)
        }).then(() => {
        if(isPushState) window.history.pushState({}, null, link);
        console.log("reveal")
             revealNavigationForCurrentPage()
             window.Prism = window.Prism || {};
             window.Prism.highlightAllUnder(document.getElementById("main"))
             let selectedElement = document.querySelector('div.sideMenuPart[data-active]')
                 if (selectedElement && !isElementInViewport(selectedElement)) { // nothing selected, probably just the main page opened
                     scrollNavigationToSelectedElement('smooth')
                 }
          // scrollNavigationToSelectedElement()
            document.dispatchEvent(new Event('updateContentPage'))

        })

}

const isElementInViewport = (el) => {
    var rect = el.getBoundingClientRect()
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
}

const loadScript = (src, async = true, type = 'text/javascript') => {
  return new Promise((resolve, reject) => {
    try {
      const newScript = document.createElement('script')

      newScript.type = type
      newScript.async = async
      newScript.src = src

      newScript.addEventListener('load', () => {
        console.log("loaded")
        resolve({ status: true })
      })

      newScript.addEventListener('error', () => {
        reject({
          status: false,
          message: `Failed to load the script ${src}`
        })
      })

      document.head.appendChild(newScript)
    } catch (err) {
      reject(err)
    }
  })
}

const applyNewScripts = (doc) => {
    let currentScripts = document.getElementsByTagName("script")
    let currentScriptsSet = new Set()
    for(i in currentScripts) {
        currentScriptsSet.add(currentScripts[i].src)
       if(currentScripts[i].src ) console.log(currentScripts[i].src)
    }
    let scripts = doc.head.getElementsByTagName("script")
    let promiseArray = []
    for (i in scripts) {
        if(!currentScriptsSet.has(scripts[i].src)) {
           promiseArray.push(loadScript(scripts[i].src))
           console.log("new:"+ scripts[i].src)
        }
    }
    return Promise.all(promiseArray)
}
convertToAbsoluteLinks2 = () => {
        for(i in document.head.children) {
        let element = document.head.children[i]

        if(element.src) {
        console.log( element.src)
        element.src =  element.src
        }
        if(element.href) {
                console.log( element.href)
                element.href =  element.href
          }
        }

}
const updatePathToRoot = (doc) => {
    const newScript = document.createElement("script");
    newScript.appendChild(document.createTextNode(doc.getElementsByTagName("script")[0].innerHTML));
    const oldScript = document.getElementsByTagName("script")[0]
    oldScript.parentNode.replaceChild(newScript, oldScript);
}

convertToAbsoluteLinks = () => {
        document.querySelectorAll(".overview > a").forEach(link => {
            const  oldLink = link.getAttribute("href")
            link.setAttribute("href", link.protocol + "//" + link.host + link.pathname);
        })

}
replacePathToRoot = (oldPathToRoot) => {
        document.querySelectorAll(".overview > a").forEach(link => {
            const  oldLink = link.getAttribute("href")
            const originLink = oldLink.substring(oldLink.indexOf(oldPathToRoot) + oldPathToRoot.length)

           /// alert(oldLink + "dffd \n" + pathToRoot + originLink)
            link.setAttribute("href", pathToRoot + originLink);
        })

}
revealNavigationForCurrentPage = () => {
    let pageId = document.getElementById("content").attributes["pageIds"].value.toString();
    let parts = document.querySelectorAll(".sideMenuPart");
    let found = 0;
    do {
        parts.forEach(part => {
            if (part.attributes['pageId'].value.indexOf(pageId) !== -1 && found === 0) {
                found = 1;
                //if (part.classList.contains("hidden")) {
                    part.classList.remove("hidden");
                    part.setAttribute('data-active', "");
               // }
                revealParents(part)
            }
             else if(part.hasAttribute("data-active")) {
                      part.classList.add("hidden");
                      part.removeAttribute("data-active")
            }
        });
        pageId = pageId.substring(0, pageId.lastIndexOf("/"))
    } while (pageId.indexOf("/") !== -1 && found === 0)
};
revealParents = (part) => {
    if (part.classList.contains("sideMenuPart")) {
        if (part.classList.contains("hidden"))
            part.classList.remove("hidden");
        revealParents(part.parentNode)
    }
};

scrollNavigationToSelectedElement = (behavior = 'auto') => {
    let selectedElement = document.querySelector('div.sideMenuPart[data-active]')
    if (selectedElement == null) { // nothing selected, probably just the main page opened
        return
    }

    let hasIcon = selectedElement.querySelectorAll(":scope > div.overview span.nav-icon").length > 0

    // for instance enums also have children and are expandable, but are not package/module elements
    let isPackageElement = selectedElement.children.length > 1 && !hasIcon
    if (isPackageElement) {
        // if package is selected or linked, it makes sense to align it to top
        // so that you can see all the members it contains
        selectedElement.scrollIntoView(true)
    } else {
        // if a member within a package is linked, it makes sense to center it since it,
        // this should make it easier to look at surrounding members
        selectedElement.scrollIntoView({
            behavior: behavior,
            block: 'center',
            inline: 'center'
        })
    }
}

/*
    This is a work-around for safari being IE of our times.
    It doesn't fire a DOMContentLoaded, presumabely because eventListener is added after it wants to do it
*/
if (document.readyState == 'loading') {
    window.addEventListener('DOMContentLoaded', () => {
        displayNavigationFromPage()
    })
} else {
    displayNavigationFromPage()
}
