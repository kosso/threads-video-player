// Better Videos for Threads.... 

// Remove Meta's obnoxious console message. :)
setTimeout(() => {
    console.clear()
    console.log('Naughty Facebook!...')
}, 1000)

const mut_observer = new MutationObserver(mutationList =>
    mutationList.filter(m => m.type === 'childList').forEach(m => {
        m.addedNodes.forEach(node => {
            // console.log("NODE", node.nodeName)
            if (node.nodeName == 'DIV') {
                if (node.querySelectorAll('a[target="_blank"]')?.length) {
                    // console.log('%cMUTATION CONTAINS EXTERNAL LINK', 'color:yellow', node)
                    // node.style = "border:4px solid red !important;"
                    const _links = node.querySelectorAll('a[target="_blank"]')
                    _links.forEach(link => {
                        // link.style = "border:4px solid orange !important;"
                        console.log('LINK: ', link.href)
                        if(link.href.includes('l.php')){ // These are DEFINITELY Ads .. 
                           // link.style = "border:4px solid red !important;"
                           // node.style = "opacity:0.5 !important; background:hotpink !important;"
                            const _div = document.createElement("div")
                            _div.style  = "background:red;margin:10px;padding:10px;font-size:30px;font-weight:bold;color:white !important;text-align:center;"
                            _div.innerHTML = "<h1>SPONSORED AD REMOVED</h1>"
                            node.replaceWith(_div)
                        }
                    })
                }
            }
        });
    }));
mut_observer.observe(document, { childList: true, subtree: true });
